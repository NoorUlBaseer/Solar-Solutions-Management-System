import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../../api/axios";

const Services = () => {
  const [solutions, setSolutions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    systemSize: "",
    type: "on-grid",
    netMetering: true,
    description: "",
    price: "",
    warranty: "",
    panels: "",
    inverter: "",
    battery: "",
    structure: "raised",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await api.get('/admin/solutions');
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleOfferSolution = async () => {
    try {
      if (isEditing) {
        await api.put(`/admin/solutions/${editId}`, formData);
      } else {
        await api.post('/admin/solutions', formData);
      }
      fetchSolutions();
      resetForm();
    } catch (error) {
      console.error('Error saving solution:', error);
    }
  };

  const handleEdit = (solution) => {
    setFormData(solution);
    setIsEditing(true);
    setEditId(solution._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/solutions/${id}`);
      fetchSolutions();
    } catch (error) {
      console.error('Error deleting solution:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      systemSize: "",
      type: "on-grid",
      netMetering: true,
      description: "",
      price: "",
      warranty: "",
      panels: "",
      inverter: "",
      battery: "",
      structure: "raised",
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Solar Solutions Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3, width: '70vw' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEditing ? "Edit Solar Solution" : "Add Solar Solution"}
        </Typography>
        <Box
          component="form"
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <TextField
            name="name"
            label="Solution Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="systemSize"
            label="System Size (kW)"
            value={formData.systemSize}
            onChange={handleInputChange}
            required
          />
          <Select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="on-grid">On-Grid</MenuItem>
            <MenuItem value="off-grid">Off-Grid</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </Select>
          <Select
            name="netMetering"
            value={formData.netMetering}
            onChange={handleInputChange}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
          <TextField
            name="price"
            label="Price ($)"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="warranty"
            label="Warranty (years)"
            value={formData.warranty}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="panels"
            label="Panels"
            value={formData.panels}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="inverter"
            label="Inverter"
            value={formData.inverter}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="battery"
            label="Battery"
            value={formData.battery}
            onChange={handleInputChange}
            required
          />
          <Select
            name="structure"
            value={formData.structure}
            onChange={handleInputChange}
          >
            <MenuItem value="raised">Raised</MenuItem>
            <MenuItem value="roof mounted">Roof Mounted</MenuItem>
          </Select>
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
        </Box>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          onClick={handleOfferSolution}
        >
          {isEditing ? "Update Solution" : "Offer Solution"}
        </Button>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Offered Solar Solutions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>System Size</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solutions.map((solution) => (
              <TableRow key={solution._id}>
                <TableCell>{solution.name}</TableCell>
                <TableCell>{solution.systemSize} kW</TableCell>
                <TableCell>{solution.type}</TableCell>
                <TableCell>${solution.price}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(solution)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(solution._id)}
                  >
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

export default Services;

