import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import api from "../../api/axios";

const Installations = () => {
  const [installations, setInstallations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstallations();
  }, [filter, search]);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/installations', {
        params: { status: filter, search },
      });
      setInstallations(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching installations:", err);
      setError("Failed to fetch installations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (installationId) => {
    try {
      const response = await api.get(`/admin/installations/${installationId}`);
      setSelectedInstallation(response.data);
      setDialogOpen(true);
    } catch (err) {
      console.error("Error fetching installation details:", err);
      setError("Failed to fetch installation details. Please try again.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/installations/${id}/status`, { status: newStatus });
      fetchInstallations();
    } catch (err) {
      console.error("Error updating installation status:", err);
      setError("Failed to update installation status. Please try again.");
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
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Installations Management
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search Installations"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="scheduled">Scheduled</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Technician</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {installations.map((installation) => (
              <TableRow key={installation._id}>
                <TableCell>{installation._id}</TableCell>
                <TableCell>{installation.userId.name}</TableCell>
                <TableCell>{new Date(installation.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select
                    value={installation.status}
                    onChange={(e) =>
                      handleStatusChange(installation._id, e.target.value)
                    }
                    size="small"
                  >
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{installation.technician}</TableCell>
                <TableCell>{installation.company}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(installation._id)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedInstallation && (
          <>
            <DialogTitle>Installation Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Customer Info</Typography>
              <Typography>Name: {selectedInstallation.userId.name}</Typography>
              <Typography>Email: {selectedInstallation.userId.email}</Typography>
              <Typography>Phone: {selectedInstallation.userId.phone}</Typography>

              <Box sx={{ my: 2 }}>
                <Typography variant="h6">Solution Info</Typography>
                <Typography>Name: {selectedInstallation.freeFuelId.name}</Typography>
                <Typography>System Size: {selectedInstallation.freeFuelId.systemSize}</Typography>
                <Typography>Type: {selectedInstallation.freeFuelId.type}</Typography>
                <Typography>Net Metering: {selectedInstallation.freeFuelId.netMetering ? 'Yes' : 'No'}</Typography>
                <Typography>Price: ${selectedInstallation.freeFuelId.price}</Typography>
                <Typography>Description: {selectedInstallation.freeFuelId.description}</Typography>
                <Typography>Warranty: {selectedInstallation.freeFuelId.warranty} years</Typography>
                <Typography>Panels: {selectedInstallation.freeFuelId.panels}</Typography>
                <Typography>Inverter: {selectedInstallation.freeFuelId.inverter}</Typography>
                <Typography>Battery: {selectedInstallation.freeFuelId.battery}</Typography>
                <Typography>Structure: {selectedInstallation.freeFuelId.structure}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Installations;

