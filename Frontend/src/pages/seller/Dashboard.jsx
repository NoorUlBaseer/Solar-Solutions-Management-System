import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Inventory, LocalShipping, AttachMoney } from "@mui/icons-material";
import api from "../../api/axios";

const DashboardCard = ({ title, value, icon }) => (
  <Paper
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
    <Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
    {icon}
  </Paper>
);

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardResponse = await api.get("/sellers/dashboard");
        setDashboardData(dashboardResponse.data);
        const ordersResponse = await api.get("/sellers/orders");
        setOrders(ordersResponse.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Welcome, {user?.name || "Seller"}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Products"
            value={dashboardData.totalProducts}
            icon={<Inventory sx={{ fontSize: 40, color: "primary.main" }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            icon={
              <LocalShipping sx={{ fontSize: 40, color: "primary.main" }} />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Revenue"
            value={`$${dashboardData.totalRevenue.toFixed(2)}`}
            icon={<AttachMoney sx={{ fontSize: 40, color: "primary.main" }} />}
          />
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Recent Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SellerDashboard;
