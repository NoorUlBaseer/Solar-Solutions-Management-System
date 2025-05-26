// config/database.js
const mongoose = require("mongoose");
require("../models/Order");
require("../models/User");
require("../models/Product");
require("../models/Seller");
require("../models/Warehouse");
require("../models/Admin");
const config = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
