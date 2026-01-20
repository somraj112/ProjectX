const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
} = require("../controller/event.controller");

router.post("/", authMiddleware, createEvent);
router.get("/", authMiddleware, getEvents);
router.get("/:eventId", authMiddleware, getEventById);
router.delete("/:eventId", authMiddleware, deleteEvent);

module.exports = router;
