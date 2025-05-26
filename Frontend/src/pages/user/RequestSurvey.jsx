import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RequestSurvey = () => {
  const navigate = useNavigate();

  // State to manage form inputs and error/success messages
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!fullName || !email || !address || !preferredDate || !phoneNumber) {
      setError("All fields are required.");
      return;
    }

    try {
      // Simulate API call for requesting survey (for now we use a success message)
      setSnackbarMessage("Survey request submitted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // You can replace the below line with actual API call to your backend
      // await api.post("/schedule-survey", { fullName, email, address, preferredDate, phoneNumber });

      // Reset the form after successful submission
      setFullName("");
      setEmail("");
      setAddress("");
      setPreferredDate("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error submitting survey request:", error);
      setSnackbarMessage("There was an error submitting your request. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 3, mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Request House Survey
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Please fill out the form below to request a home inspection for solar suitability.
      </Typography>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Home Address"
          variant="outlined"
          fullWidth
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Preferred Date for Survey"
          type="date"
          variant="outlined"
          fullWidth
          required
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit Request
        </Button>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestSurvey;
