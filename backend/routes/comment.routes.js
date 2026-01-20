const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  addComment,
  getCommentsByPost,
  toggleLikeComment,
  deleteComment,
} = require("../controller/comment.controller");

router.post("/posts/:postId/comments", authMiddleware, addComment);
router.get("/posts/:postId/comments", authMiddleware, getCommentsByPost);

router.patch("/:commentId/like", authMiddleware, toggleLikeComment);
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
