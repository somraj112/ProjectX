const Event = require("../models/Event");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Unify/Events",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage }).single("image");

exports.createEvent = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: "File upload error", err: err.message });
    }

    try {
      const { title, description, startDate, endDate, startTime, endTime, type, location, maxParticipants, requirements } = req.body;

      if (!title || !description || !startDate || !endDate || !startTime || !endTime || !type || !location) {
        return res.status(400).json({ msg: "All required event fields must be provided" });
      }

      if (new Date(endDate) < new Date(startDate)) {
        return res.status(400).json({ msg: "End date cannot be before start date" });
      }

      let imageUrl = "";
      let public_id = "";

      if (req.file) {
        imageUrl = req.file.path;
        public_id = req.file.filename;
      }

      const event = await Event.create({
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        type: type.trim(),
        location,
        imageUrl,
        public_id,
        maxParticipants: maxParticipants || null,
        requirements: requirements || "",
        createdBy: req.user._id,
        collegeId: req.user.collegeId,
      });

      return res.status(201).json({ msg: "Event created successfully", event });
    } catch (err) {
      console.error("Create event error:", err);
      return res.status(500).json({ msg: "Failed to create event", err: err.message });
    }
  });
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

exports.updateEvent = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: "File upload error", err: err.message });
    }

    try {
      const { eventId } = req.params;
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ msg: "Event not found" });
      }

      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "Not authorized to edit this event" });
      }

      const { title, description, startDate, endDate, startTime, endTime, type, location, maxParticipants, requirements } = req.body;

      if (title) event.title = title;
      if (description) event.description = description;
      if (startDate) event.startDate = startDate;
      if (endDate) event.endDate = endDate;
      if (startTime) event.startTime = startTime;
      if (endTime) event.endTime = endTime;
      if (type) event.type = type.trim();
      if (location) event.location = location;
      if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;
      if (requirements !== undefined) event.requirements = requirements;

      if (req.file) {
        // Delete old image from Cloudinary if it exists
        if (event.public_id) {
          await cloudinary.uploader.destroy(event.public_id);
        }
        event.imageUrl = req.file.path;
        event.public_id = req.file.filename;
      }

      await event.save();
      return res.status(200).json({ msg: "Event updated successfully", event });
    } catch (err) {
      console.error("Update event error:", err);
      return res.status(500).json({ msg: "Failed to update event", err: err.message });
    }
  });
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
