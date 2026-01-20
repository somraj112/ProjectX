const Event = require("../models/Event");
const formidable = require("formidable");
const { IncomingForm } = formidable;
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createEvent = async (req, res) => {
  try {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(400).json({
            msg: "Error parsing form data",
            err: err.message,
          });
        }

        const getField = (f) => (Array.isArray(f) ? f[0] : f);

        const title = getField(fields.title);
        const description = getField(fields.description);
        const startDate = getField(fields.startDate);
        const endDate = getField(fields.endDate);
        const startTime = getField(fields.startTime);
        const endTime = getField(fields.endTime);
        const type = getField(fields.type)?.trim();
        const location = getField(fields.location);
        const maxParticipants = getField(fields.maxParticipants);
        const requirements = getField(fields.requirements);

        if (
          !title ||
          !description ||
          !startDate ||
          !endDate ||
          !startTime ||
          !endTime ||
          !type ||
          !location
        ) {
          return res.status(400).json({
            msg: "All required event fields must be provided",
          });
        }

        if (new Date(endDate) < new Date(startDate)) {
          return res.status(400).json({
            msg: "End date cannot be before start date",
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
            { folder: "Unify/Events" }
          );

          imageUrl = uploadedImage.secure_url;
          public_id = uploadedImage.public_id;

          fs.unlinkSync(imageFile.filepath);
        }

        const event = await Event.create({
          title,
          description,
          startDate,
          endDate,
          startTime,
          endTime,
          type,
          location,
          imageUrl,
          public_id,
          maxParticipants: maxParticipants || null,
          requirements: requirements || "",
          createdBy: req.user._id,
          collegeId: req.user.collegeId,
        });

        return res.status(201).json({
          msg: "Event created successfully",
          event,
        });
      } catch (innerErr) {
        console.error("Create event error:", innerErr);
        return res.status(500).json({
          msg: "Failed to create event",
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

exports.getEvents = async (req, res) => {
  try {
    const { type, upcoming } = req.query;

    const query = {
      collegeId: req.user.collegeId,
    };

    if (type) query.type = type;

    if (upcoming === "true") {
      query.endDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate("createdBy", "name department year")
      .sort({ startDate: 1, startTime: 1 });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching events",
      err: err.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate(
      "createdBy",
      "name department year"
    );

    if (!event) {
      return res.status(404).json({
        msg: "Event not found",
      });
    }

    if (event.collegeId !== req.user.collegeId) {
      return res.status(403).json({
        msg: "Access denied",
      });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching event",
      err: err.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        msg: "Event not found",
      });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized to delete this event",
      });
    }

    if (event.public_id) {
      await cloudinary.uploader.destroy(event.public_id);
    }

    await event.deleteOne();

    res.status(200).json({
      msg: "Event deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error deleting event",
      err: err.message,
    });
  }
};
