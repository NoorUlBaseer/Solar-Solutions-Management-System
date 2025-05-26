const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Warehouse = require("../models/Warehouse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config(); // Load .env file
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "30d" });
};

// Seller registration
exports.register = async (req, res) => {
  const { name, email, password, company } = req.body;

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      company,
    });

    res.status(201).json({
      message: "Seller registered successfully",
      token: generateToken(seller._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering seller", error });
  }
};

// return sellers list
exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Error fetching sellers", error: error.message });
  }
};

// Seller login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, seller.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Seller logged in successfully",
      token: generateToken(seller._id),

      id: seller._id,
      user: {
        name: seller.name,
        email: seller.email,
        company: seller.company,
      },
      name: seller.name,
      email: seller.email,
      company: seller.company,
      role: "seller",
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Request a survey
exports.requestSurvey = async (req, res) => {
  try {
    // Placeholder logic for requesting a survey
    res.status(200).json({ message: "Survey requested successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error requesting survey", error });
  }
};

// Get verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    res.status(200).json({ verified: req.seller.verified });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching verification status", error });
  }
};

// Add a service
exports.addService = async (req, res) => {
  const { service } = req.body;

  try {
    req.seller.services.push(service);
    await req.seller.save();

    res.status(201).json({ message: "Service added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding service", error });
  }
};

// Add a product
exports.addProduct = async (req, res) => {
  const { name, price, description, stock, warranty } = req.body;

  try {
    // Handle image uploads
    const imagePaths = req.files
      ? req.files.map((file) => `/uploads/products/${file.filename}`)
      : [];

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      warranty,
      seller: req.seller._id,
      images: imagePaths,
    });

    await Seller.findByIdAndUpdate(req.seller._id, {
      $push: { inventory: product._id },
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    // Find the existing product first
    const existingProduct = await Product.findOne({
      _id: id,
      seller: req.seller._id,
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Remove old images from filesystem if they exist
      if (existingProduct.images && existingProduct.images.length > 0) {
        await Promise.all(
          existingProduct.images.map(async (imagePath) => {
            try {
              await fs.unlink(path.join("." + imagePath));
            } catch (unlinkError) {
              console.log(`Could not delete image: ${imagePath}`, unlinkError);
            }
          })
        );
      }

      // Add new image paths
      updates.images = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    // Update the product
    const product = await Product.findOneAndUpdate(
      { _id: id, seller: req.seller._id },
      updates,
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// Remove a product
exports.removeProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product first to access its images before deleting
    const product = await Product.findOneAndDelete({
      _id: id,
      seller: req.seller._id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    // Remove associated images from filesystem
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (imagePath) => {
          try {
            await fs.unlink(path.join("." + imagePath));
          } catch (unlinkError) {
            console.log(`Could not delete image: ${imagePath}`, unlinkError);
          }
        })
      );
    }

    // Remove product from seller's inventory
    await Seller.findByIdAndUpdate(req.seller._id, {
      $pull: { inventory: product._id },
    });

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing product", error: error.message });
  }
};

//get all products
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.seller._id });
    res.json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
// Get inventory
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Product.find({ seller: req.seller._id });
    res.status(200).json({ inventory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

// Create a quote (Placeholder)
exports.createQuote = async (req, res) => {
  const { details, price } = req.body;

  try {
    // Implement logic here if needed
    res.status(201).json({ message: "Quote created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating quote", error: error.message });
  }
};

// Get analytics (Placeholder)
// ... other imports and code ...

exports.getAnalytics = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Get total products
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Get total orders and revenue
    const orders = await Order.find({ seller: sellerId });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Get daily sales data for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailySales = await Order.aggregate([
      { $match: { seller: sellerId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top 5 selling products
    const topProducts = await Order.aggregate([
      { $match: { seller: sellerId } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      { $project: { name: "$productInfo.name", totalSold: 1 } },
    ]);

    // Get order status distribution
    const orderStatusDistribution = await Order.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      analytics: {
        totalProducts,
        totalOrders,
        totalRevenue,
        dailySales,
        topProducts,
        orderStatusDistribution,
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res
      .status(500)
      .json({ message: "Error fetching analytics data", error: error.message });
  }
};

// ... other code ...

// Create a promotion (Placeholder)
exports.createPromotion = async (req, res) => {
  const { promotionDetails } = req.body;

  try {
    // Implement logic for promotions
    res.status(201).json({ message: "Promotion created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating promotion", error: error.message });
  }
};

// Add a new warehouse
exports.addWarehouse = async (req, res) => {
  const { name, location, capacity, inventory } = req.body;

  try {
    const warehouse = new Warehouse({
      name,
      location,
      capacity,
      inventory,
      seller: req.seller._id, // Assuming sellerId is passed in the request body
    });

    await warehouse.save();
    res
      .status(201)
      .json({ message: "Warehouse added successfully", warehouse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding warehouse", error: error.message });
  }
};

// Get all warehouses
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().populate("seller");
    res.status(200).json({ warehouses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching warehouses", error: error.message });
  }
};

// Get a specific warehouse by ID
exports.getWarehouseById = async (req, res) => {
  const { id } = req.params;

  try {
    const warehouse = await Warehouse.findById(id).populate("seller");

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json({ warehouse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching warehouse", error: error.message });
  }
};

// Update a warehouse's details
exports.updateWarehouse = async (req, res) => {
  const { id } = req.params;
  const { name, location, capacity, inventory } = req.body;

  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { name, location, capacity, inventory },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res
      .status(200)
      .json({ message: "Warehouse updated successfully", warehouse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating warehouse", error: error.message });
  }
};

// Delete a warehouse
exports.deleteWarehouse = async (req, res) => {
  const { id } = req.params;

  try {
    const warehouse = await Warehouse.findByIdAndDelete(id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting warehouse", error: error.message });
  }
};

// Get warehouses by seller
exports.getWarehousesBySeller = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const warehouses = await Warehouse.find({ seller: sellerId }).populate(
      "seller"
    );

    res.status(200).json({ warehouses });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching seller's warehouses",
      error: error.message,
    });
  }
};

// Generate an invoice (Placeholder)
exports.generateInvoice = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findOne({
      _id: orderId,
      seller: req.seller._id,
    }).populate("products.product");

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    const invoice = {
      orderId: order._id,
      seller: req.seller.name,
      products: order.products.map((p) => ({
        name: p.product.name,
        quantity: p.quantity,
        price: p.product.price,
      })),
      totalAmount: order.totalAmount,
      createdAt: new Date(),
    };

    res
      .status(200)
      .json({ message: "Invoice generated successfully", invoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating invoice", error: error.message });
  }
};

// backend/controllers/sellerController.js

exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.seller._id; // Use _id instead of id

    // Fetch total products
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Fetch total orders and revenue
    const orders = await Order.find({ seller: sellerId });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error in getSellerDashboard:", error);
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};

// New function to get seller profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching seller profile", error: error.message });
  }
};

// New function to update seller profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const { name, email, company } = req.body;
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.name = name || seller.name;
    seller.email = email || seller.email;
    seller.company = company || seller.company;

    const updatedSeller = await seller.save();
    res.json({
      _id: updatedSeller._id,
      name: updatedSeller.name,
      email: updatedSeller.email,
      company: updatedSeller.company,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating seller profile", error: error.message });
  }
};

// Get all orders for a seller
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.seller._id })
      .populate("user", "name email")
      .populate("products.product", "name price");
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      seller: req.seller._id,
    })
      .populate("user", "name email")
      .populate("products.product", "name price");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      seller: req.seller._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      seller: req.seller._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

//gemni api query handeler
exports.handleSellerQuery = async (req, res) => {
  const { query, context } = req.body;

  if (!query || !context) {
    return res
      .status(400)
      .json({ error: "Both 'query' and 'context' are required." });
  }

  const prompt = `
    Seller Name: ${context.sellerName}
    Company Name: ${context.companyName}
    Number of Products: ${context.productCount}
    Number of Orders: ${context.orderCount}
    
    Question: ${query}
  `;

  try {
    const result = await model.generateContent(prompt);
    // console.log("Generated response:", result); // Log the result to check what is returned

    // Call the 'text' function to get the actual response
    if (
      result &&
      result.response &&
      typeof result.response.text === "function"
    ) {
      const responseText = result.response.text(); // Execute the function to get the text
      return res.json({ answer: responseText });
    } else {
      console.error("Unexpected response format:", result);
      return res.status(500).json({
        error: "Unexpected response format from Gemini API.",
      });
    }
  } catch (error) {
    console.error("Error interacting with Gemini API:", error);
    res.status(500).json({
      error: "Failed to process the query. Please try again later.",
    });
  }
};
