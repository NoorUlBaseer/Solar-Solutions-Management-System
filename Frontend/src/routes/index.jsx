import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import SellerLayout from "../layouts/SellerLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminRoutes from './admin.routes';
import SellerDashboard from "../pages/seller/Dashboard";
import Inventory from "../pages/seller/Inventory";
import AddProduct from "../pages/seller/AddProduct";
import Orders from "../pages/seller/Orders";
import Analytics from "../pages/seller/Analytics";
import Warehouses from "../pages/seller/Warehouses";
import Settings from "../pages/seller/Settings";
import MyStore from "../pages/seller/MyStore";
import Support from "../pages/seller/Support";
import Promotions from "../pages/seller/Promotions";
import ProtectedRoute from "./ProtectedRoute";
import UserDashboard from "../pages/user/Dashboard";
import UserShop from "../pages/user/shop";
import RequestSurvey from "../pages/user/RequestSurvey";
import RequestSizeEstimation from "../pages/user/RequestSizeEstimation";
import CartPage from "../pages/user/CartPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import OrdersPage from "../pages/user/OrdersPage";
import InstallationPage from "../pages/user/InstallationFromFreeFuel";
import InstallationBySellersPage from "../pages/user/InstallationbyOtherSellers";
import SolarCalculatorPage from "../pages/user/SolarCalculator";
import UserSupport from "../pages/user/Support";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute role="user">
            <UserLayout />
          </ProtectedRoute>
        }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="shop" element={<UserShop />} />
        <Route path="RequestSurvey" element={<RequestSurvey />} />
        <Route path="RequestSizeEstimation" element={<RequestSizeEstimation />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="installation" element={<InstallationPage />} />
        <Route path="installation/sellers" element={<InstallationBySellersPage />} />
        <Route path="calculator" element={<SolarCalculatorPage />} />
        <Route path="support" element={<UserSupport />} />
      </Route>

      {/* Seller Routes */}
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute role="seller">
            <SellerLayout />
          </ProtectedRoute>
        }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/add" element={<AddProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="settings" element={<Settings />} />
        <Route path="store" element={<MyStore />} />
        <Route path="support" element={<Support />} />
        <Route path="promotions" element={<Promotions />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="*" element={<AdminRoutes />} />
        {/* <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
