import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

const RequestSizeEstimation = () => {
  const [energyConsumption, setEnergyConsumption] = useState('');
  const [roofArea, setRoofArea] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with actual API call for estimation
      const response = await fetch('/api/estimate-solar-size', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          energyConsumption,
          roofArea,
          location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEstimate(data.estimatedSystemSize); // Estimate returned from API
        setSnackbarMessage('Solar system size estimation successful!');
        setSnackbarSeverity('success');
      } else {
        throw new Error('Failed to get estimation');
      }
    } catch (err) {
      setError('Error fetching estimation');
      setSnackbarMessage('Error fetching estimation. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ margin: "auto", p: 3, mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Request Solar System Size Estimation
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Average Monthly Energy Consumption (kWh)"
              fullWidth
              value={energyConsumption}
              onChange={(e) => setEnergyConsumption(e.target.value)}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Roof Area (sq ft)"
              fullWidth
              value={roofArea}
              onChange={(e) => setRoofArea(e.target.value)}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location (City/State)"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Request Estimate'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {estimate && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Estimated Solar System Size: {estimate} kW
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestSizeEstimation;
