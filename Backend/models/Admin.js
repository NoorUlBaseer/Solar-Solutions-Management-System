const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
  discounts: [
    {
      range: { type: String, required: true },
      discount: { type: Number, required: true },
    },
  ],
  warrantyDiscount: { type: Number, required: true },
});
module.exports = mongoose.model("Admin", adminSchema);
