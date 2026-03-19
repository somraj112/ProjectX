const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  uploadNote,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controller/note.controller");

router.post("/", authMiddleware, uploadNote);
router.get("/", authMiddleware, getNotes);
router.patch("/:noteId", authMiddleware, updateNote);
router.delete("/:noteId", authMiddleware, deleteNote);

module.exports = router;
