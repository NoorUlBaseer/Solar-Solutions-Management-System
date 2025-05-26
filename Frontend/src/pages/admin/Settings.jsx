import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import api from "../../api/axios";

const Settings = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
  });
  const [discounts, setDiscounts] = useState([
    { id: 1, range: "0-10000", discount: 0 },
    { id: 2, range: "10001-25000", discount: 0 },
    { id: 3, range: "25001+", discount: 0 },
  ]);
  const [warrantyDiscount, setWarrantyDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, discountsResponse] = await Promise.all([
          api.get('/admin/profile'),
          api.get('/admin/discounts')
        ]);
        setAdminProfile(profileResponse.data);
        setDiscounts(discountsResponse.data.discounts);
        setWarrantyDiscount(discountsResponse.data.warrantyDiscount);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update Discount
  const handleDiscountChange = (id, value) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, discount: Number(value) } : d))
    );
  };

  // Submit Discounts
  const handleSaveDiscounts = async () => {
    try {
      await api.put('/admin/discounts', { discounts, warrantyDiscount });
      setError(null);
      alert("Discounts updated successfully!");
    } catch (err) {
      console.error("Error updating discounts:", err);
      setError("Failed to update discounts. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      {/* Admin Profile */}
      <Box sx={{ mb: 5 }} >
        <Typography variant="h6">Admin Profile</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={adminProfile.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={adminProfile.email}
              disabled
            />
          </Grid>
        </Grid>
      </Box>

      {/* Discounts Management */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Discounts Management
        </Typography>

        {/* Price Range Discounts */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Discounts by Price Range:
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Price Range</TableCell>
                <TableCell>Discount (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.range}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={discount.discount}
                      onChange={(e) =>
                        handleDiscountChange(discount.id, e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Warranty Discounts */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Discounts by Warranty:
        </Typography>
        <TextField
          fullWidth
          label="Warranty Discount (%)"
          type="number"
          value={warrantyDiscount}
          onChange={(e) => setWarrantyDiscount(Number(e.target.value))}
          size="small"
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDiscounts}
        >
          Save Discounts
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;

