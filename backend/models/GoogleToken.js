// models/GoogleToken.js
const mongoose = require("mongoose");

const googleTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    accessToken: String,
    refreshToken: String,
    expiryDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoogleToken", googleTokenSchema);