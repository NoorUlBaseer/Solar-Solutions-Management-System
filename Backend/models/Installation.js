const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  freeFuelId: { type: mongoose.Schema.Types.ObjectId, ref: "FreeFuel", required: true },
  company: { type: String, default: "FreeFuel" },
  status: {
    type: String,
    enum: ["completed", "ongoing", "scheduled"],
    required: true
  },
  date: { type: Date, required: true },
  technician: {
    type: String,
    enum: ["Qasim", "Talha", "Shehroze", "Aqib"],
    required: true
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Installation", installationSchema);
