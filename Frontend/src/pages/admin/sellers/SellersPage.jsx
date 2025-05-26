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
  Check,
  Close,
  Search,
  Visibility,
  Engineering,
} from '@mui/icons-material';
import SellerDetailsDialog from './SellerDetailsDialog';
import SurveySelectorDialog from './SurveySelectorDialog';
import { formatDate } from '../../../utils/formatters';
import api from '../../../api/axios';

const SellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, [searchQuery]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sellers', {
        params: { search: searchQuery },
      });
      setSellers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError('Failed to fetch sellers. Please try again later.');
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

  const handleVerify = async (sellerId, approve) => {
    try {
      await api.put(`/admin/sellers/${sellerId}/verify`, { verified: approve });
      fetchSellers();
    } catch (error) {
      console.error('Error updating seller status:', error);
      setError('Failed to update seller status. Please try again.');
    }
  };

  const handleScheduleSurvey = (seller) => {
    setSelectedSeller(seller);
    setOpenSurveyDialog(true);
  };

  const handleViewDetails = async (sellerId) => {
    try {
      const response = await api.get(`/admin/sellers/${sellerId}`);
      setSelectedSeller(response.data);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching seller details:', error);
      setError('Failed to fetch seller details. Please try again.');
    }
  };

  const getStatusColor = (verified) => {
    return verified ? 'success' : 'warning';
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
        <Typography variant="h4">Seller Management</Typography>
        <TextField
          size="small"
          label="Search Sellers"
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
                <TableCell>Company Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registered Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((seller) => (
                  <TableRow key={seller._id}>
                    <TableCell>{seller.name}</TableCell>
                    <TableCell>{seller.email}</TableCell>
                    <TableCell>{formatDate(seller.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={seller.verified ? 'Verified' : 'Pending'}
                        color={getStatusColor(seller.verified)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(seller._id)}
                        sx={{ mr: 1 }}
                      >
                        <Visibility />
                      </IconButton>
                      {!seller.verified && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleScheduleSurvey(seller)}
                          sx={{ mr: 1 }}
                        >
                          <Engineering />
                        </IconButton>
                      )}
                      {!seller.verified && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleVerify(seller._id, true)}
                            sx={{ mr: 1 }}
                          >
                            <Check />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleVerify(seller._id, false)}
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
          count={sellers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <SellerDetailsDialog
        open={openDetailsDialog}
        seller={selectedSeller}
        onClose={() => setOpenDetailsDialog(false)}
      />

      <SurveySelectorDialog
        open={openSurveyDialog}
        seller={selectedSeller}
        onClose={() => setOpenSurveyDialog(false)}
        onSchedule={async (surveyData) => {
          try {
            await api.post(`/admin/sellers/${selectedSeller._id}/schedule-survey`, surveyData);
            setOpenSurveyDialog(false);
            fetchSellers();
          } catch (error) {
            console.error('Error scheduling survey:', error);
            setError('Failed to schedule survey. Please try again.');
          }
        }}
      />
    </Box>
  );
};

export default SellersPage;

