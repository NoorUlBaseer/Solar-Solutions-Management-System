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
  Dashboard,
  People,
  Store,
  Assignment,
  Build,
  Assessment,
  Settings,
  Security,
  Support,
  VerifiedUser,
  BusinessCenter,
  MonetizationOn,
  Engineering,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const DRAWER_WIDTH = 280;

const menuItems = [
  { 
    category: 'Overview',
    items: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
      { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
    ]
  },
  {
    category: 'Management',
    items: [
      { text: 'Users', icon: <People />, path: '/admin/users' },
      { text: 'Sellers', icon: <Store />, path: '/admin/sellers' },
      { text: 'Orders', icon: <Assignment />, path: '/admin/orders' },
      { text: 'Installations', icon: <Build />, path: '/admin/installations' },
    ]
  },
  {
    category: 'Operations',
    items: [
      { text: 'Verify Product', icon: <VerifiedUser />, path: '/admin/verifyProduct' },
      //House/Office Survey
      { text: 'Survey', icon: <Engineering />, path: '/admin/survey' },
      { text: 'Services', icon: <BusinessCenter />, path: '/admin/services' },
      { text: 'Customer Support', icon: <Support />, path: '/admin/support' },
    ]
  },
  {
    category: 'System',
    items: [
      { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
      { text: 'Security', icon: <Security />, path: '/admin/security' },
    ]
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, mt: 8 }}>
        <Logo />
      </Box>
      {menuItems.map((section) => (
        <Box key={section.category}>
          <Typography
            variant="overline"
            sx={{
              px: 3,
              py: 1.5,
              display: 'block',
              color: 'text.secondary'
            }}
          >
            {section.category}
          </Typography>
          <List>
            {section.items.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 82, 164, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? 'inherit' : 'primary.main',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Drawer>
  );
};

export default Sidebar;