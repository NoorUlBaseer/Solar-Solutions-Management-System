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
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sellers/products");
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
      handleSnackbarOpen("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      stock: parseInt(formData.get("stock")),
      description: formData.get("description"),
    };

    try {
      if (currentProduct) {
        await api.put(`/sellers/products/${currentProduct._id}`, productData);
        handleSnackbarOpen("success", "Product updated successfully");
      } else {
        await api.post("/sellers/products", productData);
        handleSnackbarOpen("success", "Product added successfully");
      }

      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
      handleSnackbarOpen("error", "Failed to save product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/sellers/products/${productId}`);
      handleSnackbarOpen("success", "Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      handleSnackbarOpen("error", "Failed to delete product");
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
          Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/seller/inventory/add">
          Add Product
        </Button>
      </Box>
      {products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="right">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{product.stock}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="primary"
                      onClick={() => handleOpenDialog(product)}
                      startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDeleteProduct(product._id)}
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
          No products found. Add a product to get started.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitProduct}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Product Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.name || ""}
              required
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.price || ""}
              required
            />
            <TextField
              margin="dense"
              name="stock"
              label="Stock"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.stock || ""}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              defaultValue={currentProduct?.description || ""}
              required
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" color="primary">
                {currentProduct ? "Update" : "Add"}
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

export default Inventory;
