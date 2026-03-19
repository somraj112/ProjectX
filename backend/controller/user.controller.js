const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Unify/Profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage }).single("avatar");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, collegeId, department, year } = req.body;

    if (!name || !email || !password || !collegeId || !department || !year) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ msg: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      collegeId,
      department,
      year,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      msg: "Signup successful",
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error in signup",
      err: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required!" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error in login",
      err: err.message,
    });
  }
};

exports.myInfo = async (req, res) => {
  try {
    res.status(200).json({
      me: req.user,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error fetching user info",
    });
  }
};

exports.updateProfile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: "File upload error", err: err.message });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      if (req.body.bio !== undefined) {
        user.bio = req.body.bio;
      }

      if (req.file) {
        // Remove old avatar from Cloudinary if it exists
        if (user.public_id) {
          await cloudinary.uploader.destroy(user.public_id);
        }
        user.avatarUrl = req.file.path;
        user.public_id = req.file.filename;
      }

      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      res.status(200).json({
        msg: "Profile updated successfully",
        user: userObj,
      });
    } catch (err) {
      res.status(400).json({
        msg: "Error updating profile",
        err: err.message,
      });
    }
  });
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({
      collegeId: req.user.collegeId,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error searching users",
      err: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      msg: "Logged out successfully",
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error logging out",
    });
  }
};
