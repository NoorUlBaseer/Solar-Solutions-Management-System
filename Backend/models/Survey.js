const mongoose = require("mongoose");
const surveySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:
    true },
    type: { type: String, enum: ['house', 'warehouse'], required: true
    },
    address: String,
    surveyDate: { type: Date},
    surveyTime: { type: String},
    surveyor: { type: String, enum: ['Qasim', 'SherMohammad', 'Aqib']}, 
    status: { type: String, enum: ['requested', 'completed'], default:
    'requested' },
    Notes: String,
    createdAt: { type: Date, default: Date.now },
    });
    module.exports = mongoose.model('Survey', surveySchema);