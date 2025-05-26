import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
} from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import api from "../../api/axios"; // Adjust path to your axios instance

const mockProducts = [
    {
      _id: "1",
      name: "Solar Panel A",
      price: 199.99,
      stock: 25,
      description: "High-efficiency solar panel.",
      images: ["https://via.placeholder.com/150"]
    },
    {
      _id: "2",
      name: "Solar Panel B",
      price: 249.99,
      stock: 10,
      description: "Durable and long-lasting solar panel.",
      images: ["https://via.placeholder.com/150"]
    },
    {
      _id: "3",
      name: "Solar Panel C",
      price: 299.99,
      stock: 0,
      description: "Best solar panel for residential use.",
      images: ["https://via.placeholder.com/150"]
    },
];

const UserShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/products"); // Adjust API endpoint
      console.log(response.data); // Log the response to see if products are returned
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
      handleSnackbarOpen("error", "Failed to load products.");
    } finally {
      setLoading(false);
    }

    // try {
    //     setLoading(true);
    //     // Simulate a delay like an API call
    //     setTimeout(() => {
    //       setProducts(mockProducts);
    //       setError(null);
    //       setLoading(false);
    //     }, 1000);
    // }   catch (error) {
    //     console.error("Error fetching products:", error);
    //     setError("Failed to load products. Please try again later.");
    //     setLoading(false);
    // }
  };  

  // In UserShop.jsx
  const handleAddToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    storedCart.push(product);
    localStorage.setItem("cart", JSON.stringify(storedCart));
    handleSnackbarOpen("success", `${product.name} added to cart.`);
  };


  // Handle Snackbar
  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

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
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shop
      </Typography>
      {products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.images?.[0] || "/default-product.jpg"}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    <strong>Stock:</strong>{" "}
                    {product.stock > 0 ? product.stock : "Out of Stock"}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ m: 2 }}
                  disabled={product.stock === 0}
                  onClick={() =>
                    handleSnackbarOpen(
                      "success",
                      product.stock > 0
                        ? `Added ${product.name} to cart.`
                        : `Product is out of stock.`
                    )
                  }>
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No products available at the moment.</Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserShop;
