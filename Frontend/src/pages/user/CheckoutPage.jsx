import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Retrieve cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  // Handle checkout submission
  const handleCheckout = () => {
    if (Object.values(shippingInfo).some((value) => value === "")) {
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Simulate successful checkout (you can replace this with actual backend logic)
    setSnackbarMessage("Order placed successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Clear cart after successful checkout
    localStorage.removeItem("cart");
    setCart([]);
  };

  // Calculate the total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
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
          <Grid item xs={12} sm={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">Shipping Information</Typography>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={shippingInfo.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Total: ${calculateTotal()}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{ width: "100%" }}
            >
              Complete Purchase
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ backgroundColor: "#f9f9f9", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Cart
              </Typography>
              {cart.map((product) => (
                <Box key={product._id} sx={{ display: "flex", mb: 2 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {product.name} - ${product.price.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total: ${calculateTotal()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
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

export default CheckoutPage;
