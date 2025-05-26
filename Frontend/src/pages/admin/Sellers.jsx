import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Chip } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch sellers data from the backend
  useEffect(() => {
    // Replace with actual API call
    const mockData = [
      { id: 1, name: "ABC Solar", email: "abc@solar.com", status: "Verified", registered: "2021-09-01" },
      { id: 2, name: "XYZ Energy", email: "xyz@energy.com", status: "Pending", registered: "2021-09-02" },
    ];
    setSellers(mockData);
  }, []);

  // Filtered Sellers List
  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Sellers Management
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search Sellers"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>{seller.id}</TableCell>
                <TableCell>{seller.name}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.registered}</TableCell>
                <TableCell>
                  <Chip
                    label={seller.status}
                    color={seller.status === "Verified" ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Sellers;
