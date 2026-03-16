const { oauth2Client } = require("../config/google");
const GoogleToken = require("../models/GoogleToken");

exports.getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent",
  });
};

exports.saveTokens = async (userId, tokens) => {
  return GoogleToken.findOneAndUpdate(
    { userId },
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    },
    { upsert: true, new: true }
  );
};

exports.getAuthorizedClient = async (userId) => {
  const token = await GoogleToken.findOne({ userId });
  if (!token) throw new Error("Google not connected");

  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expiry_date: token.expiryDate,
  });

  return oauth2Client;
};