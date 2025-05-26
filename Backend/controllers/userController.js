// controllers/userController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { productIds, quantities, totalAmount } = req.body;

    // Create a new order using the provided data
    const newOrder = new Order({
      user: req.user._id,
      products: productIds.map((id, index) => ({
        product: id,
        quantity: quantities[index],
      })),
      totalAmount: totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

exports.handleUserQuery = async (req, res) => {
  const { query, context } = req.body;

  if (!query || !context) {
    return res
      .status(400)
      .json({ error: "Both 'query' and 'context' are required." });
  }

  const prompt = `
    User Name: ${context.userName}
    Email: ${context.userEmail}
    Number of Orders: ${context.orderCount}
    Purchased Products: ${context.purchasedProductCount}

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

exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};