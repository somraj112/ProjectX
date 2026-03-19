const {
  createScheduleEvent,
  getScheduleEvents,
  updateScheduleEvent,
  deleteScheduleEvent,
} = require("../services/schedule.service");
const { oauth2Client } = require("../config/google");
const { saveTokens } = require("../services/googleAuth.service");

exports.connectGoogle = async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.events"],
      prompt: "consent",
      state: req.user._id.toString()
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error("connectGoogle Error:", error);
    res.status(500).json({ msg: "Failed to generate Google auth URL" });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!state) {
        throw new Error("Missing state parameter");
    }

    const { tokens } = await oauth2Client.getToken(code);
    await saveTokens(state, tokens);

    res.redirect(process.env.FRONTEND_URL + "/schedule");
  } catch (error) {
    console.error("googleCallback Error:", error);
    res.redirect(process.env.FRONTEND_URL + "/schedule?error=google_auth_failed");
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const event = await createScheduleEvent(req.user._id, req.body);
    res.status(201).json({ msg: "Scheduled", event });
  } catch (error) {
    console.error("createSchedule Error:", error);
    if (error.message === "Google not connected") {
      return res.status(403).json({ msg: "Google Calendar not connected" });
    }
    res.status(500).json({ msg: "Failed to create schedule event" });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const events = await getScheduleEvents(req.user._id);
    res.status(200).json(events);
  } catch (error) {
    console.error("getSchedule Error:", error);
    if (error.message === "Google not connected") {
      return res.status(403).json({ msg: "Google Calendar not connected" });
    }
    res.status(500).json({ msg: "Failed to fetch schedule events" });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We already validate required fields conceptually in the UI, 
    // but the service maps them directly to Google Calendar's payload.
    const event = await updateScheduleEvent(req.user._id, id, req.body);
    res.status(200).json({ msg: "Schedule updated", event });
  } catch (error) {
    console.error("updateSchedule Error:", error);
    if (error.message === "Google not connected") {
      return res.status(403).json({ msg: "Google Calendar not connected" });
    }
    res.status(500).json({ msg: "Failed to update schedule event" });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteScheduleEvent(req.user._id, id);
    res.status(200).json({ msg: "Schedule deleted" });
  } catch (error) {
    console.error("deleteSchedule Error:", error);
    if (error.message === "Google not connected") {
      return res.status(403).json({ msg: "Google Calendar not connected" });
    }
    res.status(500).json({ msg: "Failed to delete schedule event" });
  }
};