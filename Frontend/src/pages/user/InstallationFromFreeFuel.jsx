import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
} from "@mui/material";

const InstallationPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    contact: "",
    installationDate: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const packages = [
    {
      id: 1,
      name: "Basic Installation",
      description: "Includes standard solar panel installation for small homes.",
      price: 499.99,
    },
    {
      id: 2,
      name: "Premium Installation",
      description: "Customized solar installation for larger homes or offices.",
      price: 999.99,
    },
    {
      id: 3,
      name: "Enterprise Installation",
      description: "Complete solar solutions for businesses and enterprises.",
      price: 1999.99,
    },
  ];

  const handlePackageSelection = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      userDetails.name &&
      userDetails.address &&
      userDetails.contact &&
      userDetails.installationDate &&
      selectedPackage
    ) {
      console.log("Installation Request Submitted", { ...userDetails, selectedPackage });
      setSnackbarOpen(true);
    } else {
      alert("Please fill in all the details and select a package.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Solar System Installation by FreeFuel
      </Typography>
      <Typography variant="body1" gutterBottom>
        Choose from our packages and provide your details to schedule an installation.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card
              sx={{
                border:
                  selectedPackage?.id === pkg.id ? "2px solid green" : "1px solid gray",
              }}
            >
              <CardContent>
                <Typography variant="h6">{pkg.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {pkg.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  <strong>Price:</strong> ${pkg.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePackageSelection(pkg)}
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Provide Your Details
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={userDetails.address}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contact Number"
          name="contact"
          value={userDetails.contact}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Preferred Installation Date"
          name="installationDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={userDetails.installationDate}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!selectedPackage}
        >
          Submit Installation Request
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Installation request submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstallationPage;
