import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../../api/axios";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sellers/warehouses");
      if (response.data && Array.isArray(response.data.warehouses)) {
        setWarehouses(response.data.warehouses);
      } else {
        setWarehouses([]);
        console.error("Unexpected API response structure:", response.data);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      setError("Failed to load warehouses. Please try again later.");
      handleSnackbarOpen("error", "Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (warehouse = null) => {
    setCurrentWarehouse(warehouse);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWarehouse(null);
  };

  const handleSubmitWarehouse = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const warehouseData = {
      name: formData.get("name"),
      location: formData.get("location"),
      capacity: formData.get("capacity"),
    };

    try {
      if (currentWarehouse) {
        await api.put(
          `/sellers/warehouses/${currentWarehouse._id}`,
          warehouseData
        );
        handleSnackbarOpen("success", "Warehouse updated successfully");
      } else {
        await api.post("/sellers/warehouses", warehouseData);
        handleSnackbarOpen("success", "Warehouse added successfully");
      }

      fetchWarehouses();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving warehouse:", error);
      handleSnackbarOpen("error", "Failed to save warehouse");
    }
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    try {
      await api.delete(`/sellers/warehouses/${warehouseId}`);
      handleSnackbarOpen("success", "Warehouse deleted successfully");
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      handleSnackbarOpen("error", "Failed to delete warehouse");
    }
  };

  if (loading) {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}>
        <Typography variant="h4" gutterBottom>
          Warehouses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}>
          Add Warehouse
        </Button>
      </Box>
      {warehouses.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="warehouses table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Capacity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouses.map((warehouse) => (
                <TableRow
                  key={warehouse._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {warehouse.name}
                  </TableCell>
                  <TableCell>
                    {typeof warehouse.location === "object"
                      ? `${warehouse.location.address}, ${warehouse.location.city}, ${warehouse.location.state} ${warehouse.location.zipCode}, ${warehouse.location.country}`
                      : warehouse.location}
                  </TableCell>
                  <TableCell align="right">
                    {typeof warehouse.capacity === "object"
                      ? `Total: ${warehouse.capacity.total}, Available: ${warehouse.capacity.available}`
                      : warehouse.capacity}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      color="primary"
                      onClick={() => handleOpenDialog(warehouse)}
                      startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDeleteWarehouse(warehouse._id)}
                      startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>
          No warehouses found. Add a warehouse to get started.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitWarehouse}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Warehouse Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentWarehouse?.name || ""}
              required
            />
            <TextField
              margin="dense"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={
                currentWarehouse?.location
                  ? typeof currentWarehouse.location === "object"
                    ? `${currentWarehouse.location.address}, ${currentWarehouse.location.city}, ${currentWarehouse.location.state} ${currentWarehouse.location.zipCode}, ${currentWarehouse.location.country}`
                    : currentWarehouse.location
                  : ""
              }
              required
            />
            <TextField
              margin="dense"
              name="capacity"
              label="Capacity"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={
                currentWarehouse?.capacity
                  ? typeof currentWarehouse.capacity === "object"
                    ? `Total: ${currentWarehouse.capacity.total}, Available: ${currentWarehouse.capacity.available}`
                    : currentWarehouse.capacity
                  : ""
              }
              required
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" color="primary">
                {currentWarehouse ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Warehouses;
