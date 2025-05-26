const bcrypt = require("bcryptjs"); // Change this line
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Seller = require("../models/Seller");

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register user, admin, or seller
exports.register = async (req, res) => {
  const { name, email, password, role, company } = req.body;

  try {
    let model;
    if (role === "admin") {
      model = Admin;
    } else if (role === "seller") {
      model = Seller;
    } else if (role === "user") {
      model = User;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if the user already exists
    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } already exists`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the respective collection
    const newUser = await model.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "seller" && { company }), // Add company only if it's a seller
    });

    res.status(201).json({
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } registered successfully`,
      token: generateToken(newUser._id),
      id: newUser._id,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        ...(role === "seller" && { company: newUser.company }), // Add company info for sellers
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Generic login for user, admin, or seller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in all possible models
    let user;
    user = await User.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email });
    }
    if (!user) {
      user = await Seller.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: `${
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      } logged in successfully`,
      token: generateToken(user._id),
      id: user._id,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === "seller" && { company: user.company }), // Add company info for sellers
      },
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
