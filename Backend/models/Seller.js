// models/Seller.js
const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: String,
  certifications: [String],
  inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  services: [{ type: String }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  role: { type: String, enum: ["seller"], default: "seller" },
  verified: { type: Boolean, default: false }, // Verification status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seller", sellerSchema);
