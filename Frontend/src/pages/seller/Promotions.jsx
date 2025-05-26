import React, { useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Grid,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: "promo1",
      code: "SOLAR20",
      description: "20% off solar panel installations",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      status: "active",
    },
    {
      id: "promo2",
      code: "FREESHIP",
      description: "Free shipping on orders over $500",
      discountType: "shipping",
      discountValue: 0,
      startDate: "2024-02-01",
      endDate: "2024-04-30",
      status: "active",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (promotion = null) => {
    setCurrentPromotion(promotion);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPromotion(null);
  };

  const handleSubmitPromotion = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const promotionData = {
      id: currentPromotion
        ? currentPromotion.id
        : `promo${promotions.length + 1}`,
      code: formData.get("code"),
      description: formData.get("description"),
      discountType: formData.get("discountType"),
      discountValue: parseFloat(formData.get("discountValue")),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
    };

    if (currentPromotion) {
      // Update existing promotion
      setPromotions(
        promotions.map((promo) =>
          promo.id === currentPromotion.id ? promotionData : promo
        )
      );
      setSnackbar({
        open: true,
        message: "Promotion updated successfully",
        severity: "success",
      });
    } else {
      // Add new promotion
      setPromotions([...promotions, promotionData]);
      setSnackbar({
        open: true,
        message: "Promotion added successfully",
        severity: "success",
      });
    }

    handleCloseDialog();
  };

  const handleDeletePromotion = (promotionId) => {
    setPromotions(promotions.filter((promo) => promo.id !== promotionId));
    setSnackbar({
      open: true,
      message: "Promotion deleted successfully",
      severity: "success",
    });
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}>
        <Typography variant="h4" gutterBottom>
          Promotions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}>
          Create Promotion
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="promotions table">
          <TableHead>
            <TableRow>
              <TableCell>Promo Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow
                key={promotion.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {promotion.code}
                </TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell>
                  {promotion.discountType === "percentage"
                    ? `${promotion.discountValue}%`
                    : promotion.discountType === "shipping"
                    ? "Free Shipping"
                    : `$${promotion.discountValue}`}
                </TableCell>
                <TableCell>{promotion.startDate}</TableCell>
                <TableCell>{promotion.endDate}</TableCell>
                <TableCell>
                  <Chip
                    label={promotion.status}
                    color={
                      promotion.status === "active"
                        ? "success"
                        : promotion.status === "upcoming"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="primary"
                    onClick={() => handleOpenDialog(promotion)}
                    startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeletePromotion(promotion.id)}
                    startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentPromotion ? "Edit Promotion" : "Create New Promotion"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitPromotion}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Promo Code"
                  name="code"
                  defaultValue={currentPromotion?.code || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  defaultValue={currentPromotion?.description || ""}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Discount Type"
                  name="discountType"
                  defaultValue={currentPromotion?.discountType || "percentage"}
                  SelectProps={{ native: true }}
                  required>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="shipping">Free Shipping</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Discount Value"
                  name="discountValue"
                  type="number"
                  defaultValue={currentPromotion?.discountValue || ""}
                  required
                  disabled={currentPromotion?.discountType === "shipping"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={currentPromotion?.startDate || ""}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={currentPromotion?.endDate || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  defaultValue={currentPromotion?.status || "active"}
                  SelectProps={{ native: true }}
                  required>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                </TextField>
              </Grid>
            </Grid>
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" color="primary">
                {currentPromotion ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}>
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

export default Promotions;
