import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Chip,
} from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      date: "2024-12-01",
      status: "Shipped",
      items: [
        { name: "Sample Product 1", quantity: 2, price: 29.99 },
        { name: "Sample Product 2", quantity: 1, price: 49.99 },
      ],
      total: 109.97,
    },
    {
      id: "ORD002",
      date: "2024-12-25",
      status: "Delivered",
      items: [
        { name: "Sample Product 3", quantity: 1, price: 19.99 },
        { name: "Sample Product 4", quantity: 3, price: 39.99 },
      ],
      total: 139.96,
    },
    {
      id: "ORD003",
      date: "2024-11-20",
      status: "Cancelled",
      items: [{ name: "Sample Product 5", quantity: 1, price: 59.99 }],
      total: 59.99,
    },
  ]);

  return (
    <Box sx={{ flexGrow: 1, mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h6">No orders found</Typography>
          <Button href="/shop" variant="contained" sx={{ mt: 2 }}>
            Go to Shop
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    Order ID: <strong>{order.id}</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                        ? "primary"
                        : "error"
                    }
                    sx={{ mt: 1 }}
                  />
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    Items:
                  </Typography>
                  {order.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {item.name} (x{item.quantity})
                      </Typography>
                      <Typography variant="body2">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ textAlign: "right" }}>
                    Total: ${order.total.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrdersPage;
