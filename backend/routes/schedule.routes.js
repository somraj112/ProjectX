const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  connectGoogle,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controller/schedule.controller");

router.get("/connect", auth, connectGoogle);
router.post("/", auth, createSchedule);
router.get("/", auth, getSchedule);
router.put("/:id", auth, updateSchedule);
router.delete("/:id", auth, deleteSchedule);

module.exports = router;