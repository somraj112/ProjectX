const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        msg: "Not authorized, token missing",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        msg: "Not authorized, user not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Not authorized, token invalid",
      err: err.message,
    });
  }
};

module.exports = authMiddleware;
