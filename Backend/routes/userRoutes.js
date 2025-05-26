// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, verifyUser } = require("../middleware/authMiddleware"); // Protect and verify middlewares
const {
  getAllProducts,
  getProductById,
  placeOrder,
  getUserOrders,
  handleUserQuery,
  getUserProfile,
} = require("../controllers/userController");

// Multer configuration for file uploads (if needed for user-related uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/userFiles/"); // Ensure this directory exists for uploads
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to accept only image files (if required)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Public Routes
router.get("/products", getAllProducts); // Get all products
router.get("/products/:id", getProductById); // Get product by ID

// Protected Routes (Requires user authentication)
router.post("/orders", protect, placeOrder); // Place an order
router.get("/orders", protect, getUserOrders); // Get all orders for the user

//gemni query route
router.post("/support/query", handleUserQuery);
//users/profile
router.get("/profiles", getUserProfile);

module.exports = router;
