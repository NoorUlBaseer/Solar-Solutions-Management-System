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
  Button,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";

const Verifications = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Replace with an actual API call
    const mockData = [
      { id: 1, type: "User", name: "John Doe", status: "Pending", date: "2024-12-01" },
      { id: 2, type: "Seller", name: "Green Solar", status: "Approved", date: "2024-11-30" },
      { id: 3, type: "Product", name: "Solar Inverter", status: "Pending", date: "2024-12-02" },
    ];
    setVerificationRequests(mockData);
  }, []);

  const handleAction = (id, action) => {
    // Implement approve/reject logic here
    console.log(`Request ID ${id} ${action}d`);
  };

  const filteredRequests =
    filter === "All"
      ? verificationRequests
      : verificationRequests.filter((request) => request.type === filter);

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Verifications Management
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Seller">Seller</MenuItem>
          <MenuItem value="Product">Product</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Chip label={request.status} color={request.status === "Pending" ? "warning" : "success"} />
                </TableCell>
                <TableCell>
                  {request.status === "Pending" && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleAction(request.id, "approve")}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleAction(request.id, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Verifications;
