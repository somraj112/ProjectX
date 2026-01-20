const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String, // HH:mm
      required: true,
    },

    endTime: {
      type: String, // HH:mm
      required: true,
    },

    type: {
      type: String,
      enum: ["Cultural", "Sports", "Academic", "Workshop", "Other", "Technical"],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    maxParticipants: {
      type: Number,
      min: 1,
    },

    requirements: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collegeId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
