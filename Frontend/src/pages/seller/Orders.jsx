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
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sellers/orders");
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenStatusDialog(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setOpenDeleteDialog(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/sellers/orders/${selectedOrder._id}`, {
        status: newStatus,
      });
      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setSnackbar({
        open: true,
        message: "Order status updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update order status",
        severity: "error",
      });
    } finally {
      setOpenStatusDialog(false);
    }
  };

  const handleOrderDelete = async () => {
    try {
      await api.delete(`/sellers/orders/${selectedOrder._id}`);
      setOrders(orders.filter((order) => order._id !== selectedOrder._id));
      setSnackbar({
        open: true,
        message: "Order deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete order",
        severity: "error",
      });
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleGenerateInvoice = async (orderId) => {
    try {
      const response = await api.post(
        "/sellers/invoices",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is passed in headers
          },
        }
      );
      setInvoiceData(response.data.invoice);
      setOpenInvoiceDialog(true);
      setSnackbar({
        open: true,
        message: "Invoice generated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      setSnackbar({
        open: true,
        message: "Failed to generate invoice",
        severity: "error",
      });
    }
  };

  // Function to request survey
  const handleRequestSurvey = async (orderId) => {
    try {
      const response = await api.post(
        "/sellers/request-survey",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: response.data.message || "Survey requested successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error requesting survey:", error);
      setSnackbar({
        open: true,
        message: "Failed to request survey",
        severity: "error",
      });
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
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {order._id}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleStatusChange(order)}>
                    Update Status
                  </Button>
                  <Button
                    onClick={() => handleDeleteOrder(order)}
                    color="error">
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleGenerateInvoice(order._id)}
                    color="primary">
                    Generate Invoice
                  </Button>
                  {/* Add Request Survey Button */}
                  <Button
                    onClick={() => handleRequestSurvey(order._id)}
                    color="secondary">
                    Request Survey
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status">
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleOrderDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}>
        <DialogTitle>Invoice</DialogTitle>
        <DialogContent>
          {invoiceData && (
            <Box>
              <Typography variant="h6">
                Order ID: {invoiceData.orderId}
              </Typography>
              <Typography variant="body1">
                Seller: {invoiceData.seller}
              </Typography>
              <Typography variant="body1">
                Total Amount: ${invoiceData.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Products:
                <ul>
                  {invoiceData.products.map((product, index) => (
                    <li key={index}>
                      {product.name} (x{product.quantity}): $$
                      {(product.price * product.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvoiceDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;
