const MarketItem = require("../models/MarketItem");
const formidable = require("formidable");
const { IncomingForm } = formidable;
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createItem = async (req, res) => {
  try {
    const form = new IncomingForm({
      multiples: true,
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

        // Normalize fields (formidable returns arrays)
        const getField = (f) => (Array.isArray(f) ? f[0] : f);

        const title = getField(fields.title)?.trim();
        const description = getField(fields.description)?.trim();
        const price = getField(fields.price);
        const category = getField(fields.category)?.trim();

        if (!title || !description || !price || !category) {
          return res.status(400).json({
            msg: "All fields are required",
          });
        }

        const uploadedImages = [];

        if (files.images) {
          const images = Array.isArray(files.images)
            ? files.images
            : [files.images];

          for (const image of images) {
            const uploadResult = await cloudinary.uploader.upload(
              image.filepath,
              { folder: "Unify/Market" }
            );

            uploadedImages.push({
              url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
            });

            fs.unlinkSync(image.filepath);
          }
        }

        const item = await MarketItem.create({
          title,
          description,
          price,
          category,
          images: uploadedImages.map((img) => img.url),
          sellerId: req.user._id,
          collegeId: req.user.collegeId,
        });

        return res.status(201).json({
          msg: "Item listed successfully",
          item,
        });
      } catch (innerErr) {
        console.error("Create market item error:", innerErr);
        return res.status(500).json({
          msg: "Failed to create item",
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

exports.getItems = async (req, res) => {
  try {
    const { category, status } = req.query;

    const query = {
      collegeId: req.user.collegeId,
    };

    if (category) query.category = category;
    if (status) query.status = status;

    const items = await MarketItem.find(query)
      .populate("sellerId", "name department year")
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching items",
      err: err.message,
    });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    if (!["available", "sold"].includes(status)) {
      return res.status(400).json({
        msg: "Invalid status value",
      });
    }

    const item = await MarketItem.findById(itemId);

    if (!item) {
      return res.status(404).json({
        msg: "Item not found",
      });
    }

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized to update this item",
      });
    }

    item.status = status;
    await item.save();

    res.status(200).json({
      msg: "Item status updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating item status",
      err: err.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await MarketItem.findById(itemId);

    if (!item) {
      return res.status(404).json({
        msg: "Item not found",
      });
    }

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized to delete this item",
      });
    }

    if (item.images && item.images.length > 0) {
      for (const imgUrl of item.images) {
        const publicId = imgUrl
          .split("/")
          .slice(-1)[0]
          .split(".")[0];

        await cloudinary.uploader.destroy(
          `Unify/Market/${publicId}`
        );
      }
    }

    await item.deleteOne();

    res.status(200).json({
      msg: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error deleting item",
      err: err.message,
    });
  }
};
