import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

const OrdersDetailDialog = ({ open, order, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Order ID:</strong> {order._id}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Status:</strong> {order.status}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Total Amount:</strong> ${order.totalAmount}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}
        </Typography>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {order.user.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {order.user.email}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Seller Information
          </Typography>
          <Typography variant="body1">
            <strong>Seller Name:</strong> {order.seller.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {order.seller.email}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Products
          </Typography>
          <List>
            {order.products.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${item.product.name} (x${item.quantity})`}
                  secondary={`Price: $${item.product.price}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrdersDetailDialog;

