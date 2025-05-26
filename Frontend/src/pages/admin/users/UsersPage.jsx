import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Check,
  Close,
  Search,
  Visibility,
} from '@mui/icons-material';
import UserDetailsDialog from './UserDetailsDialog';
import { formatDate } from '../../../utils/formatters';
import api from '../../../api/axios';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVerify = async (userId, verify) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, { verified: verify });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user verification status:', error);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, mt: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">User Management</Typography>
        <TextField
          size="small"
          label="Search Users"
          variant='outlined'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registered Date</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.verified ? 'Verified' : 'Unverified'}
                      color={user.verified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(user._id)}
                      sx={{ mr: 1 }}
                    >
                      <Visibility />
                    </IconButton>
                    {!user.verified && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleVerify(user._id, true)}
                          sx={{ mr: 1 }}
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleVerify(user._id, false)}
                        >
                          <Close />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalPages * rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UserDetailsDialog
        open={openDialog}
        user={selectedUser}
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default UsersPage;

