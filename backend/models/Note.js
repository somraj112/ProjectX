const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String, // pdf, ppt, docx, image
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    attachments: {
      type: [attachmentSchema],
      validate: [
        {
          validator: function (val) {
            return val.length > 0 || this.externalLink;
          },
          message: "Either an attachment or an external link is required",
        },
        {
          validator: (val) => val.length <= 5,
          message: "Max 5 attachments allowed",
        },
      ],
    },

    externalLink: {
      type: String,
      trim: true,
      default: "",
    },

    tags: {
      type: [String],
      index: true,
    },

    uploadedBy: {
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

module.exports = mongoose.model("Note", noteSchema);
