const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  createItem,
  getItems,
  updateItemStatus,
  deleteItem,
} = require("../controller/market.controller");

router.post("/", authMiddleware, createItem);
router.get("/", authMiddleware, getItems);
router.patch("/:itemId/status", authMiddleware, updateItemStatus);
router.delete("/:itemId", authMiddleware, deleteItem);

module.exports = router;
