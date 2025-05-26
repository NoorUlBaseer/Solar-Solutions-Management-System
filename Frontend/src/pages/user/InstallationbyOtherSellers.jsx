import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Snackbar,
  Alert,
  TextField,
  Paper,
} from "@mui/material";

import api from "../../api/axios"; // Adjust path to your axios instance

const InstallationBySellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({}); // State to track validation errors

  // Fetch sellers from the backend
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sellers/get");
        const data = await response.json();
        console.log("Sellers:", data);
        setSellers(data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  const handleSelectSeller = (seller) => {
    setSelectedSeller(seller);
    setSnackbarOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });

    // Clear the error for the field being edited
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!userDetails.address.trim()) {
      newErrors.address = "Address is required.";
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Stop submission if the form is invalid
    }
  
    // Display success message
    setSnackbarOpen(true);
    setSnackbarMessage("Details submitted successfully!");
    setSnackbarSeverity("success");
  
    // Clear form fields and reset state
    setUserDetails({ name: "", email: "", address: "" });
    setSelectedSeller(null); // Reset selected seller
  };  

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Solar System Installation by Other Sellers
      </Typography>
      <Typography variant="body1" gutterBottom>
        Browse through installation services provided by registered sellers and select the one that best fits your needs.
      </Typography>

      {/* Sellers Grid */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {sellers.map((seller) => (
          <Grid item xs={12} sm={6} md={4} key={seller._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{seller.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Company:</strong> {seller.company || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Certifications:</strong>{" "}
                  {seller.certifications.join(", ") || "None"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Services:</strong> {seller.services.join(", ")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Verified:</strong> {seller.verified ? "Yes" : "No"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSelectSeller(seller)}
                >
                  Select Seller
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedSeller && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {selectedSeller.name} selected successfully for installation services!
          </Alert>
        </Snackbar>
      )}

      {/* User Details Form */}
      {selectedSeller && (
        <Paper
          sx={{
            mt: 4,
            p: 3,
            border: "1px solid #ddd",
            boxShadow: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Enter Your Details
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              error={!!errors.name} // Highlight field if there's an error
              helperText={errors.name} // Show error message
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              error={!!errors.address}
              helperText={errors.address}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Submit Details
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default InstallationBySellersPage;
