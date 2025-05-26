import React, { useState } from "react";
import { Typography, Box, TextField, Button, Snackbar, Alert } from "@mui/material";

const SolarCalculatorPage = () => {
  const [monthlyConsumption, setMonthlyConsumption] = useState(Array(12).fill(0)); // To store the 12 months data
  const [solarSize, setSolarSize] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleInputChange = (event, index) => {
    const value = event.target.value;
    const updatedConsumption = [...monthlyConsumption];
    updatedConsumption[index] = value;
    setMonthlyConsumption(updatedConsumption);
  };

  const handleCalculateSolarSize = () => {
    const totalConsumption = monthlyConsumption.reduce((total, value) => total + parseFloat(value || 0), 0);
    const avgMonthlyConsumption = totalConsumption / 12; // Average monthly consumption
    const dailyConsumption = avgMonthlyConsumption / 30; // Divide by 30 to get daily consumption
    const solarRequired = dailyConsumption / 3.8; // Divide by 3.8 to get solar size needed

    if (isNaN(solarRequired)) {
      setSnackbarMessage("Please enter valid consumption values for all 12 months.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setSolarSize(solarRequired.toFixed(2)); // Display the result with 2 decimal places
    setSnackbarMessage("Solar panel size calculated successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Solar Panel Size Calculator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your electricity consumption (in kWh) for each month below:
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mt: 2 }}>
        {monthlyConsumption.map((consumption, index) => (
          <TextField
            key={index}
            label={`Month ${index + 1}`}
            variant="outlined"
            value={consumption}
            onChange={(e) => handleInputChange(e, index)}
            type="number"
            fullWidth
          />
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculateSolarSize}
          sx={{ width: "100%" }}
        >
          Calculate Solar Panel Size
        </Button>
      </Box>

      {solarSize && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">
            Required Solar Panel Size: {solarSize} kW
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SolarCalculatorPage;
