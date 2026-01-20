const Comment = require("../models/Comment");
const Post = require("../models/Post");
const formidable = require("formidable");
const { IncomingForm } = formidable;
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createPost = async (req, res) => {
  try {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.status(400).json({
            msg: "Error parsing form data",
            err: err.message,
          });
        }

        const content = Array.isArray(fields.content)
          ? fields.content[0]
          : fields.content;

        if (!content || !content.trim()) {
          return res.status(400).json({
            msg: "Post content is required",
          });
        }

        let imageUrl = "";
        let public_id = "";

        if (files.image) {
          const imageFile = Array.isArray(files.image)
            ? files.image[0]
            : files.image;

          const uploadedImage = await cloudinary.uploader.upload(
            imageFile.filepath,
            { folder: "Unify/Posts" }
          );

          imageUrl = uploadedImage.secure_url;
          public_id = uploadedImage.public_id;

          fs.unlinkSync(imageFile.filepath);
        }

        const post = await Post.create({
          content,
          imageUrl,
          public_id,
          authorId: req.user._id,
          collegeId: req.user.collegeId,
        });

        return res.status(201).json({
          msg: "Post created successfully",
          post,
        });
      } catch (innerErr) {
        console.error("CreatePost error:", innerErr);
        return res.status(500).json({
          msg: "Failed to create post",
          err: innerErr.message,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      err: err.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      collegeId: req.user.collegeId,
    })
      .populate("authorId", "name avatarUrl department year")
      .sort({ createdAt: -1 });

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({
          postId: post._id,
        });

        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.status(200).json(postsWithCounts);
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching posts",
      err: err.message,
    });
  }
};

exports.toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.collegeId !== req.user.collegeId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      msg: isLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error liking post",
      err: err.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this post" });
    }

    if (post.public_id) {
      await cloudinary.uploader.destroy(post.public_id);
    }

    await Comment.deleteMany({ postId });

    await post.deleteOne();

    res.status(200).json({
      msg: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error deleting post",
      err: err.message,
    });
  }
};
