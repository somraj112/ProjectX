const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  myInfo,
  updateProfile,
  searchUser,
} = require("../controller/user.controller");

router.get("/me", authMiddleware, myInfo);
router.patch("/profile", authMiddleware, updateProfile);
router.get("/search/:query", authMiddleware, searchUser);

module.exports = router;
