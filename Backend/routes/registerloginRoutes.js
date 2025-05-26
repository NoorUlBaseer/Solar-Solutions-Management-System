const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route for registration (user, admin, seller)
router.post("/register", authController.register);

// Route for login (user, admin, seller) — generic login route
router.post("/login", authController.login);

module.exports = router;
