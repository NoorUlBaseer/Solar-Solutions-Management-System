import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Store, ShoppingBag, TrendingUp, WbSunny } from "@mui/icons-material";
import api from "../../api/axios";

const StoreCard = ({ title, value, icon }) => (
  <Paper
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 140, // Ensures all boxes are the same height
    }}>
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
    <Box sx={{ mt: 2 }}>{icon}</Box>
  </Paper>
);

const MyStore = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [profileResponse, productsResponse, ordersResponse] =
          await Promise.all([
            api.get("/sellers/profile"),
            api.get("/sellers/products"),
            api.get("/sellers/orders"),
          ]);

        const monthlySales = ordersResponse.data.reduce(
          (acc, order) => acc + order.totalAmount,
          0
        );

        setStoreData({
          storeName: profileResponse.data.company,
          totalProducts: productsResponse.data.length,
          monthlySales: monthlySales,
          topProducts: productsResponse.data.slice(0, 5),
          description: profileResponse.data.description,
        });

        setError(null);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError("Failed to load store data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
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
    <Box sx={{ flexGrow: 1, p: 3, mt: "64px" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Solar Solutions Store
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StoreCard
            title="Store Name"
            value={storeData.storeName}
            icon={<Store sx={{ fontSize: 40, color: "primary.main" }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StoreCard
            title="Total Products"
            value={storeData.totalProducts}
            icon={<ShoppingBag sx={{ fontSize: 40, color: "primary.main" }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StoreCard
            title="Monthly Sales"
            value={`$${storeData.monthlySales.toFixed(2)}`}
            icon={<TrendingUp sx={{ fontSize: 40, color: "primary.main" }} />}
          />
        </Grid>
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Store Description
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography>
          Welcome to <strong>{storeData.storeName}</strong>, your trusted
          partner in solar solutions. Our mission is to provide high-quality,
          sustainable, and affordable solar products to meet all your energy
          needs. Explore our vast inventory and take a step towards a greener
          future!
        </Typography>
      </Paper>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Top Solar Products
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {storeData.topProducts.map((product) => (
            <ListItem key={product._id}>
              <WbSunny sx={{ marginRight: 2, color: "primary.main" }} />
              <ListItemText
                primary={product.name}
                secondary={`Price: $${product.price.toFixed(2)} | Stock: ${
                  product.stock
                }`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MyStore;
