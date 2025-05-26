import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { formatDate } from '../../../utils/formatters';

const UserDetailsDialog = ({ open, user, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Registration Date
              </Typography>
              <Typography variant="body1">
                {formatDate(user.createdAt)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Verified
              </Typography>
              <Typography variant="body1">
                {user.verified ? 'Yes' : 'No'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {user.address || 'Not provided'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {user.phone || 'Not provided'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Solar Requests
          </Typography>
          <List>
            {user.solarRequests && user.solarRequests.length > 0 ? (
              user.solarRequests.map((request) => (
                <ListItem key={request._id}>
                  <ListItemText primary={`Request ID: ${request._id}`} secondary={formatDate(request.createdAt)} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No solar requests" />
              </ListItem>
            )}
          </List>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Orders
          </Typography>
          <List>
            {user.orders && user.orders.length > 0 ? (
              user.orders.map((order) => (
                <ListItem key={order._id}>
                  <ListItemText primary={`Order ID: ${order._id}`} secondary={formatDate(order.createdAt)} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No orders" />
              </ListItem>
            )}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;

