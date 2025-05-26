import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  Inventory as InventoryIcon,
  Shield as RoleIcon,
} from "@mui/icons-material";
import api from "../../api/axios";

const Settings = () => {
  const [sellerData, setSellerData] = useState({
    _id: "",
    name: "",
    email: "",
    company: "",
    verified: false,
    certifications: [],
    inventory: [],
    services: [],
    orders: [],
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  const fetchSellerProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sellers/profile");
      setSellerData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching seller profile:", err);
      setError("Failed to load seller profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setEditData({
      name: sellerData.name,
      email: sellerData.email,
      company: sellerData.company,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put("/sellers/profile", {
        name: editData.name,
        email: editData.email,
        company: editData.company,
      });

      setSellerData((prevData) => ({
        ...prevData,
        name: response.data.name,
        email: response.data.email,
        company: response.data.company,
      }));

      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating seller profile:", err);
      setSnackbar({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && !sellerData.name) {
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Typography variant="h4" gutterBottom>
            Seller Profile
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenDialog}>
            Edit Profile
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Name
              </Typography>
            </Box>
            <Typography variant="body1">{sellerData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Email
              </Typography>
            </Box>
            <Typography variant="body1">{sellerData.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Company
              </Typography>
            </Box>
            <Typography variant="body1">{sellerData.company}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <VerifiedIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Verification Status
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color={sellerData.verified ? "success.main" : "error.main"}>
              {sellerData.verified ? "Verified" : "Not Verified"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Inventory
              </Typography>
            </Box>
            <Typography variant="body1">
              {sellerData.inventory.length} items
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <RoleIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Role
              </Typography>
            </Box>
            <Typography variant="body1">{sellerData.role}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Seller Profile</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={editData.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editData.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={editData.company || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
