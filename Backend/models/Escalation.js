const mongoose = require("mongoose");

const escalationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  userConcerns: [{ type: String, required: true }], // Array of user's concerns
  sellerConcerns: [{ type: String, required: true }], // Array of seller's concerns
  adminResponse: { type: String, default: "" }, // Admin's response to the concerns
  decision: { type: String, enum: ["none", "user", "seller"], default: "none" }, // Decision made by admin
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Escalation", escalationSchema);
