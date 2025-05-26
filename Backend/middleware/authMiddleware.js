// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Seller = require("../models/Seller");
const Admin = require("../models/Admin");
const User = require("../models/User");

exports.protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin; // Attach admin to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
};

exports.verifyAdminRole = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admin role required" });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.seller = await Seller.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

exports.verifySeller = (req, res, next) => {
  if (req.seller && req.seller.verified) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "This route is only accessible to verified sellers" });
  }
};

exports.verifyUser = (req, res, next) => {
  // Check if the user is verified or has a certain condition
  if (req.user && req.user.verified) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "This route is only accessible to verified users" });
  }
};
