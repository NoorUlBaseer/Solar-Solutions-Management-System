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
import { Check, Close, Visibility } from '@mui/icons-material';
import ProductDetailsDialog from './ProductDetailsDialog';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import api from '../../../api/axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVerify = async (productId, verify) => {
    try {
      await api.put(`/admin/products/${productId}/verify`, { verified: verify });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product verification status:', error);
    }
  };

  const handleViewDetails = async (productId) => {
    try {
      const response = await api.get(`/admin/products/${productId}`);
      setSelectedProduct(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const getStatusColor = (verified) => {
    return verified ? 'success' : 'warning';
  };

  return (
    <Box>
      <Box sx={{ mb: 3, mt: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Products Verification</Typography>
        <TextField
          size="small"
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Warranty</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.warranty}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.verified ? 'Verified' : 'Pending'}
                      color={getStatusColor(product.verified)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(product._id)}
                      sx={{ mr: 1 }}
                    >
                      <Visibility />
                    </IconButton>
                    {!product.verified && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleVerify(product._id, true)}
                          sx={{ mr: 1 }}
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleVerify(product._id, false)}
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

      <ProductDetailsDialog
        open={openDialog}
        product={selectedProduct}
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default ProductPage;

