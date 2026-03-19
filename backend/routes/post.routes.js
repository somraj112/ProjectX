const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  createPost,
  getPosts,
  toggleLikePost,
  deletePost,
  updatePost,
} = require("../controller/post.controller");

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.patch("/:postId/like", authMiddleware, toggleLikePost);
router.delete("/:postId", authMiddleware, deletePost);
router.put("/:postId", authMiddleware, updatePost);

module.exports = router;
