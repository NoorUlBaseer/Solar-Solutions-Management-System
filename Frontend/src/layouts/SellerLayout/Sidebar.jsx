//src/layouts/SellerLayout/Sidebar.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  LocalShipping,
  Assessment,
  Store,
  Settings,
  Support,
  AddCircle,
  Warehouse,
  LocalOffer,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../components/common/Logo";

const DRAWER_WIDTH = 280;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/seller/dashboard" },
  { text: "Inventory", icon: <Inventory />, path: "/seller/inventory" },
  { text: "Add Product", icon: <AddCircle />, path: "/seller/inventory/add" },
  { text: "Orders", icon: <LocalShipping />, path: "/seller/orders" },
  { text: "Analytics", icon: <Assessment />, path: "/seller/analytics" },
  { text: "My Store", icon: <Store />, path: "/seller/store" },
  { text: "Warehouses", icon: <Warehouse />, path: "/seller/warehouses" },
  { text: "Promotions", icon: <LocalOffer />, path: "/seller/promotions" },
  { text: "Settings", icon: <Settings />, path: "/seller/settings" },
  { text: "Support", icon: <Support />, path: "/seller/support" },
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
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "background.paper",
        },
      }}>
      <Box sx={{ p: 2, mt: 8 }}>
        <Logo />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 1,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(0, 82, 164, 0.08)",
              },
            }}>
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path ? "inherit" : "primary.main",
                minWidth: 40,
              }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
