const { google } = require("../config/google");
const { getAuthorizedClient } = require("./googleAuth.service");

exports.createScheduleEvent = async (userId, data) => {
  const auth = await getAuthorizedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: data.title,
    description: data.description,
    location: data.location,
    start: {
      dateTime: data.startDateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: data.endDateTime,
      timeZone: "Asia/Kolkata",
    },
  };

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return res.data;
};

exports.getScheduleEvents = async (userId) => {
  const auth = await getAuthorizedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: "startTime",
  });

  return res.data.items;
};

exports.updateScheduleEvent = async (userId, eventId, data) => {
  const auth = await getAuthorizedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: data.title,
    description: data.description,
    location: data.location,
    start: {
      dateTime: data.startDateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: data.endDateTime,
      timeZone: "Asia/Kolkata",
    },
  };

  const res = await calendar.events.patch({
    calendarId: "primary",
    eventId: eventId,
    requestBody: event,
  });

  return res.data;
};

exports.deleteScheduleEvent = async (userId, eventId) => {
  const auth = await getAuthorizedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });

  return true;
};