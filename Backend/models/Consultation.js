const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      question: { type: String, required: true },
      replies: [{ type: String }], // Array of replies to the question
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Consultation", consultationSchema);
