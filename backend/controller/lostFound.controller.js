const LostFound = require("../models/LostFound");
const formidable = require("formidable");
const { IncomingForm } = formidable;
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createLostFound = async (req, res) => {
  try {
    const form = new IncomingForm({
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(400).json({
            msg: "Error parsing form data",
            err: err.message,
          });
        }

        const getField = (f) => (Array.isArray(f) ? f[0] : f);

        const title = getField(fields.title)?.trim();
        const type = getField(fields.type)?.trim().toLowerCase();
        const description = getField(fields.description)?.trim();
        const location = getField(fields.location)?.trim();
        const date = getField(fields.date);

        if (!title || !type || !description || !location || !date) {
          return res.status(400).json({
            msg: "All fields are required",
          });
        }

        if (!["lost", "found"].includes(type)) {
          return res.status(400).json({
            msg: "Type must be either 'lost' or 'found'",
          });
        }

        let imageUrl = "";
        let public_id = "";

        if (files.image) {
          const imageFile = Array.isArray(files.image)
            ? files.image[0]
            : files.image;

          const uploadedImage = await cloudinary.uploader.upload(
            imageFile.filepath,
            { folder: "Unify/LostFound" }
          );

          imageUrl = uploadedImage.secure_url;
          public_id = uploadedImage.public_id;

          fs.unlinkSync(imageFile.filepath);
        }

        const lostFound = await LostFound.create({
          title,
          type,
          description,
          location,
          date,
          imageUrl,
          public_id,
          postedBy: req.user._id,
          collegeId: req.user.collegeId,
        });

        return res.status(201).json({
          msg: "Lost/Found post created successfully",
          lostFound,
        });
      } catch (innerErr) {
        console.error("Create LostFound error:", innerErr);
        return res.status(500).json({
          msg: "Failed to create lost/found post",
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

exports.getLostFound = async (req, res) => {
  try {
    const { type, status } = req.query;

    const query = {
      collegeId: req.user.collegeId,
    };

    if (type) query.type = type;
    if (status) query.status = status;

    const posts = await LostFound.find(query)
      .populate("postedBy", "name department year")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching lost/found posts",
      err: err.message,
    });
  }
};

exports.updateLostFoundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "resolved"].includes(status)) {
      return res.status(400).json({
        msg: "Invalid status value",
      });
    }

    const post = await LostFound.findById(id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized to update this post",
      });
    }

    post.status = status;
    await post.save();

    res.status(200).json({
      msg: "Status updated successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating status",
      err: err.message,
    });
  }
};

exports.deleteLostFound = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await LostFound.findById(id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized to delete this post",
      });
    }

    if (post.public_id) {
      await cloudinary.uploader.destroy(post.public_id);
    }

    await post.deleteOne();

    res.status(200).json({
      msg: "Lost/Found post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error deleting lost/found post",
      err: err.message,
    });
  }
};
