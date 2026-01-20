const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  createLostFound,
  getLostFound,
  updateLostFoundStatus,
  deleteLostFound,
} = require("../controller/lostFound.controller");

router.post("/", authMiddleware, createLostFound);
router.get("/", authMiddleware, getLostFound);
router.patch("/:id/status", authMiddleware, updateLostFoundStatus);
router.delete("/:id", authMiddleware, deleteLostFound);

module.exports = router;
