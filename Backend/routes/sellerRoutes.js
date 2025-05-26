// routes/sellerRoutes.js
const express = require("express");
const Seller = require("../models/Seller");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, verifySeller } = require("../middleware/authMiddleware");
const {
  getSellers,
  register,
  login,
  requestSurvey,
  getVerificationStatus,
  addProduct,
  updateProduct,
  removeProduct,
  getSellerProducts,
  getInventory,
  getAnalytics,
  createPromotion,
  addWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getWarehousesBySeller,
  generateInvoice,
  getSellerDashboard,
  getSellerProfile,
  updateSellerProfile,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  handleSellerQuery,
} = require("../controllers/sellerController");
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to accept only image files
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

// Seller routes
router.get("/get", getSellers);

// Existing public routes remain the same
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/request-survey", protect, requestSurvey);
router.get("/verification-status", protect, getVerificationStatus);

router.get("/profile", protect, verifySeller, getSellerProfile);
router.put("/profile", protect, verifySeller, updateSellerProfile);

// Product management with file upload support
router.post(
  "/products",
  protect,
  verifySeller,
  upload.array("images", 5), // Allow up to 5 image uploads
  addProduct
);

router.put(
  "/products/:id",
  protect,
  verifySeller,
  upload.array("images", 5), // Allow up to 5 image uploads
  updateProduct
);

router.delete("/products/:id", protect, verifySeller, removeProduct);

router.get("/products", protect, verifySeller, getSellerProducts);

router.get("/inventory", protect, verifySeller, getInventory);

// Remaining routes stay the same...
router.get("/analytics", protect, verifySeller, getAnalytics);
router.post("/promotions", protect, verifySeller, createPromotion);

// Warehouse management
router.post("/warehouses", protect, verifySeller, addWarehouse);
router.get("/warehouses", protect, verifySeller, getAllWarehouses);
router.get("/warehouses/:id", protect, verifySeller, getWarehouseById);
router.put("/warehouses/:id", protect, verifySeller, updateWarehouse);
router.delete("/warehouses/:id", protect, verifySeller, deleteWarehouse);
router.get(
  "/warehouses/seller/:sellerId",
  protect,
  verifySeller,
  getWarehousesBySeller
);

// Order management and invoices
router.post("/invoices", protect, verifySeller, generateInvoice);
// Order management routes
router.get("/orders", protect, verifySeller, getSellerOrders);
router.get("/orders/:id", protect, verifySeller, getOrderById);
router.put("/orders/:id", protect, verifySeller, updateOrderStatus);
router.delete("/orders/:id", protect, verifySeller, deleteOrder);

//get dash
router.get("/dashboard", protect, verifySeller, getSellerDashboard);

// Seller verification route
router.put("/verify/:id", async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Find seller by ID
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update the verified status
    seller.verified = true;
    await seller.save();

    res.status(200).json({ message: "Seller verified successfully", seller });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//gemni query route
router.post("/support/query", protect, verifySeller, handleSellerQuery);

module.exports = router;
