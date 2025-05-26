# ☀️ Solar Solutions Management System – FreeFuel

An end-to-end MERN (MongoDB, Express.js, React, Node.js) application built to streamline solar energy product browsing, ordering, and installation with integrated support for users, sellers, and administrators.

---

## 🌐 Overview

FreeFuel is a web platform that connects solar system consumers with certified solar equipment sellers and installers. It includes advanced features like dynamic dashboards, chatbots, solar calculators, warehouse and inventory management, seller verification, and multi-role access control.

---

## 🧹 Modules

### 🟩 User Panel

* Create account and login
* Browse and purchase solar products
* Request house survey and size estimation
* Use solar calculator
* Place and track orders
* Choose installation from FreeFuel or third-party sellers
* Chatbot assistant for order and product queries (powered by Gemini API)
* View order history and generate invoice

### 🟨 Seller Panel

* Register and get verified by admin
* Manage products and inventory
* Handle orders and warehouse info
* Monitor performance via dashboard
* Chatbot support for sellers with product/order context
* View survey requests and quotes
* Analytics and invoice generation

### 🔵 Admin Panel

* Verify seller and user accounts
* Manage all orders, transactions, and surveys
* View platform analytics
* Manage chatbot query logs
* Assign roles and handle escalations
* Configure product approval pipeline

---

## 💠 Tech Stack

| Area        | Technologies                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Frontend    | React.js, Vite, Material-UI, Tailwind CSS                                                           |
| Backend     | Node.js, Express.js                                                                                 |
| Database    | MongoDB + Mongoose                                                                                  |
| Auth        | JWT (JSON Web Tokens)                                                                               |
| File Upload | Multer                                                                                              |
| AI Support  | Gemini API (for chatbot)                                                                            |

---

## ⚙️ Features

* Full Role-Based Dashboard Access (User, Seller, Admin)
* Order, Survey, and Product CRUD operations
* Secure authentication and protected routes
* Solar system size estimation based on energy consumption
* In-browser chatbots (context-aware and LLM-powered)
* Real-time seller verification by admin
* Visual product inventory with dynamic cart & checkout
* Survey and installation request forms
* Responsive and mobile-friendly design

---

## 🚀 Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/NoorUlBaseer/Solar-Solutions-Management-System.git
   ```

2. Install dependencies:

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Configure your environment variables:

   * Create .env files in both frontend and backend directories (see sample.env)
   * Set up MongoDB connection string, JWT secret, and other necessary variables.
   * Ensure you have the Google Gemini API key for chatbot functionality.

4. Run the application:

   ```bash
   # Backend
   npm start

   # Frontend
   npm run dev
   ```

---

## 📦 Folder Structure

* frontend/ – React app with routes and role-specific pages
* backend/  – Express API, MongoDB models, controllers, routes

---

## 📜 License

This project is for academic use only by the MIT License. Reach out if you'd like to collaborate or fork it commercially.
