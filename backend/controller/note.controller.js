const Note = require("../models/Note");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Use memory storage so we can inspect mimetype before uploading to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
}).single("file");

// Helper: upload a buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

exports.uploadNote = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: "File upload error", err: err.message });
    }

    try {
      const { title, subject, tags, externalLink } = req.body;
      const semester = req.body.semester || "N/A";

      if (!title || !subject) {
        return res.status(400).json({ msg: "Title and subject are required" });
      }

      if (!req.file && !externalLink) {
        return res.status(400).json({ msg: "Either a file or an external link is required" });
      }

      let uploadResult = null;
      let isPdf = false;

      if (req.file) {
        isPdf = req.file.mimetype === "application/pdf";
        const isImage = req.file.mimetype.startsWith("image/");

        if (!isPdf && !isImage) {
          return res.status(400).json({ msg: "Only PDF or image files are allowed" });
        }

        uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "Unify/Notes",
          resource_type: "image", // PDFs are treated as images in Cloudinary for proper headers
          public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`,
        });
      }

      const tagsArray = tags
        ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean))
        : [];

      const note = await Note.create({
        title,
        subject,
        semester,
        tags: tagsArray,
        attachments: uploadResult
          ? [
              {
                fileUrl: uploadResult.secure_url,
                fileType: isPdf ? "pdf" : "image",
                fileName: req.file.originalname,
                public_id: uploadResult.public_id,
              },
            ]
          : [],
        externalLink: externalLink || "",
        uploadedBy: req.user._id,
        collegeId: req.user.collegeId,
      });

      return res.status(201).json({ msg: "Note uploaded successfully", note });
    } catch (err) {
      console.error("Upload note error:", err);
      return res.status(500).json({ msg: "Failed to upload note", err: err.message });
    }
  });
};

exports.getNotes = async (req, res) => {
  try {
    const { subject, semester, tag, search } = req.query;

    const query = { collegeId: req.user.collegeId };

    if (subject) query.subject = subject;
    if (semester) query.semester = semester;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query)
      .populate("uploadedBy", "name department year")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notes", err: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to delete this note" });
    }

    // Delete all attachments from Cloudinary
    for (const attachment of note.attachments) {
      if (attachment.public_id) {
        // resource_type: "image" is correct for PDFs and images
        await cloudinary.uploader.destroy(attachment.public_id, { resource_type: "image" });
      }
    }

    await note.deleteOne();

    res.status(200).json({ msg: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting note", err: err.message });
  }
};

// Use a separate multer instance for updates (file is optional)
const uploadForUpdate = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
}).single("file");

exports.updateNote = (req, res) => {
  uploadForUpdate(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: "File upload error", err: err.message });
    }

    try {
      const { noteId } = req.params;
      const note = await Note.findById(noteId);

      if (!note) {
        return res.status(404).json({ msg: "Note not found" });
      }

      if (note.uploadedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "Not authorized to edit this note" });
      }

      const { title, subject, tags, externalLink } = req.body;
      const semester = req.body.semester || note.semester;

      if (title) note.title = title;
      if (subject) note.subject = subject;
      if (semester) note.semester = semester;
      if (externalLink !== undefined) note.externalLink = externalLink;

      if (tags !== undefined) {
        note.tags = Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim()).filter(Boolean);
      }

      if (req.file) {
        const isPdf = req.file.mimetype === "application/pdf";
        const isImage = req.file.mimetype.startsWith("image/");

        if (!isPdf && !isImage) {
          return res.status(400).json({ msg: "Only PDF or image files are allowed" });
        }

        // Delete old attachments from Cloudinary
        for (const attachment of note.attachments) {
          if (attachment.public_id) {
            const oldType = attachment.fileType === "pdf" ? "raw" : "image";
            await cloudinary.uploader.destroy(attachment.public_id, { resource_type: oldType });
          }
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "Unify/Notes",
          resource_type: isPdf ? "image" : "image",
          public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`,
        });

        note.attachments = [
          {
            fileUrl: uploadResult.secure_url,
            fileType: isPdf ? "pdf" : "image",
            fileName: req.file.originalname,
            public_id: uploadResult.public_id,
          },
        ];
      }

      await note.save();
      return res.status(200).json({ msg: "Note updated successfully", note });
    } catch (err) {
      console.error("Update note error:", err);
      return res.status(500).json({ msg: "Failed to update note", err: err.message });
    }
  });
};

