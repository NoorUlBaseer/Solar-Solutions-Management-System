import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch users data from the backend
  useEffect(() => {
    // Replace with actual API call
    const fetchUsers = async () => {
      const mockData = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "User", registered: "2021-09-01", type: "Residential" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", registered: "2021-09-02", type: "Commercial" },
      ];
      setUsers(mockData);
    };
    fetchUsers();
  }, []);

  // Filtered Users List
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Users Management
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="primary">
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.registered}</TableCell>
                <TableCell>{user.type}</TableCell>
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

export default Users;
