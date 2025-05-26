const mongoose = require("mongoose");

const freeFuelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  systemSize: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["on-grid", "off-grid", "hybrid"], 
    required: true 
  },
  netMetering: { type: Boolean, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  warranty: { type: Number, required: true }, // Warranty in years
  panels: { type: String, required: true },
  inverter: { type: String, required: true },
  battery: { type: String, required: true },
  structure: { 
    type: String, 
    enum: ["raised", "roof mounted"], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FreeFuel", freeFuelSchema);
