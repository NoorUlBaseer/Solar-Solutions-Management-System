const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  phone: String,
  role: { type: String, enum: ["user"], default: "user" },
  solarRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Survey" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  verified: { type: Boolean, default: false }, // Verification status
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userSchema);
