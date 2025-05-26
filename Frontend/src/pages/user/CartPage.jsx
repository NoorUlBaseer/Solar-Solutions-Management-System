import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { RemoveShoppingCart as RemoveShoppingCartIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CartPage = () => {
  const [cart, setCart] = useState([
    {
      _id: "1",
      name: "Sample Product 1",
      description: "This is a sample product description.",
      price: 29.99,
      stock: 10,
      images: ["https://via.placeholder.com/150"],
    },
    {
      _id: "2",
      name: "Sample Product 2",
      description: "Another sample product for testing.",
      price: 49.99,
      stock: 5,
      images: ["https://via.placeholder.com/150"],
    },
    {
      _id: "3",
      name: "Sample Product 3",
      description: "Yet another sample product for testing purposes.",
      price: 19.99,
      stock: 0,
      images: ["https://via.placeholder.com/150"],
    },
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Retrieve cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Handle adding product to the cart
  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Handle removing product from the cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    setSnackbarMessage("Product removed from cart.");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    navigate("checkout"); // Navigate to checkout page
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h6">Your cart is empty</Typography>
          <Button href="/shop" variant="contained" sx={{ mt: 2 }}>
            Go to Shop
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
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
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                  <IconButton
                    onClick={() => handleRemoveFromCart(product._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {product.stock > 0 ? `In Stock` : `Out of Stock`}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      {cart.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Typography variant="h6">
            Total: ${calculateTotal()}
          </Typography>
          <Box>
          <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleProceedToCheckout} // Use the function here
            >
              Proceed to Checkout
            </Button>
            <Button variant="outlined" color="secondary" href="/user/shop">
              Continue Shopping
            </Button>
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
