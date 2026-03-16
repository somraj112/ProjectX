const {
  createScheduleEvent,
  getScheduleEvents,
} = require("../services/schedule.service");
const { oauth2Client } = require("../config/google");
const { saveTokens } = require("../services/googleAuth.service");

exports.connectGoogle = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent",
  });

  res.status(200).json({ url });
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  await saveTokens(req.user._id, tokens);

  res.redirect(process.env.FRONTEND_URL + "/schedule");
};

exports.createSchedule = async (req, res) => {
  const event = await createScheduleEvent(req.user._id, req.body);
  res.status(201).json({ msg: "Scheduled", event });
};

exports.getSchedule = async (req, res) => {
  const events = await getScheduleEvents(req.user._id);
  res.status(200).json(events);
};