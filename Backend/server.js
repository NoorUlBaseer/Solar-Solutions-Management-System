// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const sellerRoutes = require("./routes/sellerRoutes");
const userRoutes = require("./routes/userRoutes");
const loginroutes = require("./routes/registerloginRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sellers", sellerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", loginroutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
