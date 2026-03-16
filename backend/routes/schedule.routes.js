const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  connectGoogle,
  googleCallback,
  createSchedule,
  getSchedule,
} = require("../controller/schedule.controller");

router.get("/connect", auth, connectGoogle);
router.get("/callback", auth, googleCallback);
router.post("/", auth, createSchedule);
router.get("/", auth, getSchedule);

module.exports = router;