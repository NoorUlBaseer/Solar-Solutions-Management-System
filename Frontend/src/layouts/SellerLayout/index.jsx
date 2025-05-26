import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from '../../components/common/Header';
import { Outlet } from 'react-router-dom';

const SellerLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SellerLayout;