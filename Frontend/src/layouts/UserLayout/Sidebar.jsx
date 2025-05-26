import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Typography 
} from '@mui/material';
import {
  Home,
  Calculate,
  ShoppingCart,
  Assignment,
  Build,
  Support
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const DRAWER_WIDTH = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Home />, path: '/user/dashboard' },
  { text: 'Shop', icon: <ShoppingCart />, path: '/user/shop' },
  { text: 'Cart', icon: <ShoppingCart />, path: '/user/cart' },
  { text: 'Checkout', icon: <ShoppingCart />, path: '/user/checkout' },
  { text: 'Request Survey', icon: <Assignment />, path: '/user/RequestSurvey' },
  { text: 'Request Size Estimation', icon: <Calculate />, path: '/user/RequestSizeEstimation' },
  {text: 'My Orders', icon: <Assignment />, path: '/user/orders'},
  {text: 'Installation from FreeFuel', icon: <Build />, path: '/user/installation'},
  {text: 'Installation by Other Sellers', icon: <Build />, path: '/user/installation/sellers'},
  { text: 'Solar Calculator', icon: <Calculate />, path: '/user/calculator' },
  { text: 'Support', icon: <Support />, path: '/user/support' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ p: 2, mt: 8 }}>
        <Logo />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 82, 164, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;