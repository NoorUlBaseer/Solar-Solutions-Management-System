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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, Gavel } from "@mui/icons-material";
import api from "../../api/axios";

const Security = () => {
  const [escalations, setEscalations] = useState([]);
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch escalations data from the backend
  useEffect(() => {
    const fetchEscalations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/escalations');
        setEscalations(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching escalations:", err);
        setError("Failed to fetch escalations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEscalations();
  }, []);

  // Open dialog for managing escalation
  const handleDialogOpen = (escalation) => {
    setSelectedEscalation(escalation);
    setAdminResponse(escalation.adminResponse);
    setIsDialogOpen(true);
  };

  // Handle admin response and decision
  const handleResolveEscalation = async (decision) => {
    try {
      const response = await api.put(`/admin/escalations/${selectedEscalation._id}`, {
        adminResponse,
        decision
      });

      setEscalations((prev) =>
        prev.map((e) => (e._id === selectedEscalation._id ? response.data : e))
      );

      setIsDialogOpen(false);
      setSelectedEscalation(null);
      setError(null);
    } catch (err) {
      console.error("Error updating escalation:", err);
      setError("Failed to update escalation. Please try again.");
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
        Escalation Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>User Concerns</TableCell>
              <TableCell>Seller Concerns</TableCell>
              <TableCell>Admin Response</TableCell>
              <TableCell>Decision</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {escalations.map((escalation) => (
              <TableRow key={escalation._id}>
                <TableCell>{escalation.user.name}</TableCell>
                <TableCell>{escalation.seller.name}</TableCell>
                <TableCell>{escalation.userConcerns.join(", ")}</TableCell>
                <TableCell>{escalation.sellerConcerns.join(", ")}</TableCell>
                <TableCell>{escalation.adminResponse || "No response yet"}</TableCell>
                <TableCell>{escalation.decision === "none" ? "Pending" : escalation.decision}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleDialogOpen(escalation)}
                  >
                    <Gavel />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Managing Escalation */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Manage Escalation</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            User Concerns:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedEscalation?.userConcerns.join(", ")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Seller Concerns:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedEscalation?.sellerConcerns.join(", ")}
          </Typography>
          <TextField
            fullWidth
            label="Admin Response"
            variant="outlined"
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleResolveEscalation("user")}
          >
            User At Fault
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleResolveEscalation("seller")}
          >
            Seller At Fault
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleResolveEscalation("none")}
          >
            No Action Needed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Security;

