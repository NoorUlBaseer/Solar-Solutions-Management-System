const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Seller = require("./models/Seller");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Warehouse = require("./models/Warehouse");
const Admin = require("./models/Admin");
const Survey = require("./models/Survey");
const Escalation = require("./models/Escalation"); 
const Consultation = require("./models/Consultation");
const FreeFuel = require("./models/FreeFuel");
const Installation = require("./models/Installation");
const config = require("./config/config");

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Seller.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Warehouse.deleteMany({});
    await Survey.deleteMany({}); // Clear existing surveys
    await Escalation.deleteMany({}); // Clear existing escalations
    await Consultation.deleteMany({});
    await FreeFuel.deleteMany({});
    await Installation.deleteMany({});

    // Create Sellers
    const hashedPassword = await bcrypt.hash("sellerpassword", 10);
    const sellers = await Seller.create([
      {
        name: "Tech Supplies Inc.",
        email: "seller1@example.com",
        password: hashedPassword,
        company: "Tech Supplies",
        verified: true,
      },
      {
        name: "Solar Solutions Ltd.",
        email: "seller2@example.com",
        password: hashedPassword,
        company: "Solar Solutions",
        verified: true,
      },
    ]);

    // Create Admins
    const adminHashedPassword = await bcrypt.hash("adminpassword", 10);
    const admins = await Admin.create([
      {
        name: "Admin User1",
        email: "admin1@example.com",
        password: adminHashedPassword,
        discounts: [
          { range: "0-10000", discount: 5 },
          { range: "10001-30000", discount: 10 },
          { range: "30000+", discount: 15 },
        ],
        warrantyDiscount: 10,
      },
      {
        name: "Admin User2",
        email: "admin2@example.com",
        password: adminHashedPassword,
        discounts: [
          { range: "0-10000", discount: 5 },
          { range: "10001-30000", discount: 10 },
          { range: "30000+", discount: 15 },
        ],
        warrantyDiscount: 10,
      },
    ]);

    // Create Users
    const userHashedPassword = await bcrypt.hash("userpassword", 10);
    const users = await User.create([
      {
        name: "John Doe",
        email: "user1@example.com",
        password: userHashedPassword,
        address: "123 Main St, Anytown, USA",
        phone: "555-1234",
        verified: false,
      },
      {
        name: "Jane Smith",
        email: "user2@example.com",
        password: userHashedPassword,
        address: "456 Oak Rd, Another City, USA",
        phone: "555-5678",
        verified: true,
      },
    ]);

    // Create Products
    const products = await Product.create([
      // Seller 1 Products
      {
        name: "Solar Panel 250W",
        description: "High-efficiency solar panel",
        price: 299.99,
        stock: 100,
        seller: sellers[0]._id,
        warranty: "10 years",
      },
      {
        name: "Inverter 5kW",
        description: "Grid-tie solar inverter",
        price: 799.99,
        stock: 50,
        seller: sellers[0]._id,
        warranty: "5 years",
      },
      {
        name: "Battery Storage 10kWh",
        description: "Home battery storage system",
        price: 5999.99,
        stock: 25,
        seller: sellers[0]._id,
        warranty: "7 years",
      },
      // Seller 2 Products
      {
        name: "Solar Panel 300W Premium",
        description: "Ultra-high efficiency solar panel",
        price: 399.99,
        stock: 75,
        seller: sellers[1]._id,
        warranty: "12 years",
      },
      {
        name: "Smart Inverter 7kW",
        description: "Advanced grid-tie inverter with monitoring",
        price: 1099.99,
        stock: 40,
        seller: sellers[1]._id,
        warranty: "8 years",
      },
    ]);

    // Create Orders
    const orders = await Order.create([
      {
        user: users[0]._id,
        seller: sellers[0]._id,
        products: [
          { product: products[0]._id, quantity: 2 },
          { product: products[1]._id, quantity: 1 },
        ],
        status: "pending",
        totalAmount: 1399.97,
      },
      {
        user: users[1]._id,
        seller: sellers[1]._id,
        products: [
          { product: products[3]._id, quantity: 3 },
          { product: products[4]._id, quantity: 1 },
        ],
        status: "completed",
        totalAmount: 1599.96,
      },
    ]);

    // Create Warehouses
    await Warehouse.create([
      {
        name: "Tech Supplies Warehouse",
        location: {
          address: "123 Storage Lane",
          city: "Logistics City",
          state: "Inventory State",
          zipCode: "12345",
          country: "Seller Land",
          coordinates: {
            lat: 40.7128,
            lng: -74.006,
          },
        },
        capacity: {
          total: 10000,
          available: 7500,
        },
        inventory: products
          .filter((p) => p.seller.equals(sellers[0]._id))
          .map((product) => ({
            product: product._id,
            quantity: product.stock,
          })),
        seller: sellers[0]._id,
      },
      {
        name: "Solar Solutions Warehouse",
        location: {
          address: "456 Distribution Road",
          city: "Supply Town",
          state: "Logistics State",
          zipCode: "54321",
          country: "Seller Land",
          coordinates: {
            lat: 41.8781,
            lng: -87.6298,
          },
        },
        capacity: {
          total: 8000,
          available: 6000,
        },
        inventory: products
          .filter((p) => p.seller.equals(sellers[1]._id))
          .map((product) => ({
            product: product._id,
            quantity: product.stock,
          })),
        seller: sellers[1]._id,
      },
    ]);

    // Create Surveys
    const surveys = await Survey.create([
      {
        user: users[0]._id,
        type: "house",
        surveyDate: new Date("2021-11-15"),
        //surveyTime: "9:00 AM",
        address: "123 Main St, Anytown, USA",
        status: "requested",
        Notes: "Survey for residential installation",
      },
      {
        user: users[1]._id,
        type: "house",
        surveyDate: new Date("2021-12-01"),
        //surveyTime: "10:00 AM",
        address: users[1].address,
        status: "completed",
        Notes: "Survey for commercial solar setup",
      },
    ]);

    const escalations = await Escalation.create([
      {
        user: users[0]._id,
        seller: sellers[0]._id,
        userConcerns: [
          "Delay in delivery",
          "Incorrect product received",
        ],
        sellerConcerns: [
          "Customer's address was unclear",
        ],
        adminResponse: "Investigating the issue",
        decision: "none",
      },
      {
        user: users[1]._id,
        seller: sellers[1]._id,
        userConcerns: ["Product damaged on arrival"],
        sellerConcerns: ["Issue caused during shipping, not our responsibility"],
        adminResponse: "Replacement product sent",
        decision: "none",
      },
    ]);

    // Create Consultations
    const consultations = await Consultation.create([
      {
        user: users[0]._id,
        questions: [
          {
            question: "What is the best solar panel for my house?",
            replies: ["We recommend a 250W panel for residential use."],
          },
          {
            question: "How much does installation cost?",
            replies: ["Installation costs depend on system size but start at $500."],
          },
        ],
      },
      {
        user: users[1]._id,
        questions: [
          {
            question: "Can I integrate batteries with my system?",
            replies: [
              "Yes, batteries can be integrated for energy storage.",
              "We recommend the 10kWh battery storage system.",
            ],
          },
        ],
      },
    ]);

    // Create FreeFuel Systems
    const freeFuels = await FreeFuel.create([
      {
        name: "Basic Solar System",
        systemSize: "5kW",
        type: "on-grid",
        netMetering: true,
        description: "A basic 5kW solar system for residential use.",
        price: 10000,
        warranty: 10,
        panels: "250W Monocrystalline",
        inverter: "5kW Grid-Tie Inverter",
        battery: "None",
        structure: "roof mounted",
      },
      {
        name: "Advanced Solar System",
        systemSize: "10kW",
        type: "off-grid",
        netMetering: false,
        description: "An off-grid 10kW solar system for large homes.",
        price: 20000,
        warranty: 15,
        panels: "350W Polycrystalline",
        inverter: "10kW Off-Grid Inverter",
        battery: "10kWh Lithium-Ion Battery",
        structure: "raised",
      },
    ]);

    // Create Installations
    const installations = await Installation.create([
      {
        userId: users[0]._id,
        freeFuelId: freeFuels[0]._id,
        status: "completed",
        date: new Date("2023-06-15"),
        technician: "Qasim",
      },
      {
        userId: users[1]._id,
        freeFuelId: freeFuels[1]._id,
        status: "ongoing",
        date: new Date("2023-12-09"),
        technician: "Talha",
      },
    ]);

    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
