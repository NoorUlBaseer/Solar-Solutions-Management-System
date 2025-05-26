const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountedPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  verified: { type: Boolean, default: true }, // Verification status of the product
  warranty: { type: String },
  images: [
    {
      type: String,
      required: false,
    },
  ], // Array to store image paths
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Product", productSchema);
