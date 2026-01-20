const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ msg: "Comment content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Campus isolation check
    if (post.collegeId !== req.user.collegeId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const comment = await Comment.create({
      content,
      postId,
      authorId: req.user._id,
      collegeId: req.user.collegeId,
    });

    res.status(201).json({
      msg: "Comment added successfully",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error adding comment",
      err: err.message,
    });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      postId,
      collegeId: req.user.collegeId,
    })
      .populate("authorId", "name avatarUrl department year")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching comments",
      err: err.message,
    });
  }
};

exports.toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.collegeId !== req.user.collegeId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      msg: isLiked ? "Comment unliked" : "Comment liked",
      likesCount: comment.likes.length,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error liking comment",
      err: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Only comment author can delete
    if (comment.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({
      msg: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error deleting comment",
      err: err.message,
    });
  }
};
