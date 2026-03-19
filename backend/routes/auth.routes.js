const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
} = require("../controller/user.controller");
const { googleCallback } = require("../controller/schedule.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google/callback", googleCallback);

module.exports = router;
