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
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Visibility,
  Engineering,
} from '@mui/icons-material';
import UserDetailsDialog from './UserDetailsDialog';
import SurveySelectorDialog from './SurveySelectorDialog';
import { formatDate } from '../../../utils/formatters';
import api from '../../../api/axios';

const SurveyPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/userSurveys', {
        params: { search: searchQuery },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleScheduleSurvey = (user) => {
    setSelectedUser(user);
    setOpenSurveyDialog(true);
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/userSurveys/${userId}`);
      setSelectedUser(response.data);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details. Please try again.');
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
    <Box>
      <Box sx={{ mb: 3, mt: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">User House Survey</Typography>
        <TextField
          size="small"
          label="Search Users"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Registered Date</TableCell>
                <TableCell>Survey</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(users) ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [])
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.solarRequests.length > 0 ? 'Scheduled' : 'Not Scheduled'}
                        color={user.solarRequests.length > 0 ? 'success' : 'warning'}
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
                      {user.solarRequests.length === 0 && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleScheduleSurvey(user)}
                          sx={{ mr: 1 }}
                        >
                          <Engineering />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={Array.isArray(users) ? users.length : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UserDetailsDialog
        open={openDetailsDialog}
        user={selectedUser}
        onClose={() => setOpenDetailsDialog(false)}
      />

      <SurveySelectorDialog
        open={openSurveyDialog}
        user={selectedUser}
        onClose={() => setOpenSurveyDialog(false)}
        onSchedule={async (surveyData) => {
          try {
            await api.post(`/admin/userSurveys/${selectedUser._id}/schedule-survey`, surveyData);
            fetchUsers();
            setOpenSurveyDialog(false);
          } catch (error) {
            console.error('Error scheduling survey:', error);
            setError('Failed to schedule survey. Please try again.');
          }
        }}
      />
    </Box>
  );
};

export default SurveyPage;

