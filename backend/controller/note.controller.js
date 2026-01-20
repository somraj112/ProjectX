const Note = require("../models/Note");
const formidable = require("formidable");
const { IncomingForm } = formidable;
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadNote = async (req, res) => {
  try {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024, // 15MB limit
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(400).json({
            msg: "Error parsing form data",
            err: err.message,
          });
        }

        const title = Array.isArray(fields.title)
          ? fields.title[0]
          : fields.title;

        const subject = Array.isArray(fields.subject)
          ? fields.subject[0]
          : fields.subject;

        const semester = Array.isArray(fields.semester)
          ? fields.semester[0]
          : fields.semester;

        const tags = Array.isArray(fields.tags)
          ? fields.tags[0].split(",")
          : fields.tags
          ? fields.tags.split(",")
          : [];

        if (!title || !subject || !semester) {
          return res.status(400).json({
            msg: "Title, subject and semester are required",
          });
        }

        if (!files.attachments) {
          return res.status(400).json({
            msg: "PDF attachment is required",
          });
        }

        const file = Array.isArray(files.attachments)
          ? files.attachments[0]
          : files.attachments;

        const isPdf = file.mimetype === "application/pdf";
        const isImage = file.mimetype.startsWith("image/");

        if (!isPdf && !isImage) {
          return res.status(400).json({
            msg: "Only PDF or image files are allowed",
          });
        }

        const uploadedFile = await cloudinary.uploader.upload(file.filepath, {
            folder: "Unify/Notes",
            resource_type: isPdf ? "raw" : "image",
        });

        fs.unlinkSync(file.filepath);

        const note = await Note.create({
          title,
          subject,
          semester,
          tags,
          fileUrl: uploadedFile.secure_url,
          public_id: uploadedFile.public_id,
          uploadedBy: req.user._id,
          collegeId: req.user.collegeId,
        });

        return res.status(201).json({
          msg: "Note uploaded successfully",
          note,
        });
      } catch (innerErr) {
        console.error("Upload note error:", innerErr);
        return res.status(500).json({
          msg: "Failed to upload note",
          err: innerErr.message,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      err: err.message,
    });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { subject, semester, tag } = req.query;

    const query = {
      collegeId: req.user.collegeId,
    };

    if (subject) query.subject = subject;
    if (semester) query.semester = semester;
    if (tag) query.tags = tag;

    const notes = await Note.find(query)
      .populate("uploadedBy", "name department year")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching notes",
      err: err.message,
    });
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
      return res.status(403).json({
        msg: "Not authorized to delete this note",
      });
    }

    for (const file of note.attachments) {
      const publicId = file.fileUrl.split("/").slice(-1)[0].split(".")[0];

      await cloudinary.uploader.destroy(`Unify/Notes/${publicId}`, {
        resource_type: "auto",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      msg: "Note deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error deleting note",
      err: err.message,
    });
  }
};
