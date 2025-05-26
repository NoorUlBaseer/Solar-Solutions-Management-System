//src/components/common/Header.jsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Notifications,
  Settings,
  ExitToApp,
  Person,
} from "@mui/icons-material";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="primary" onClick={handleNotificationsMenu}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="primary">
            <Settings />
          </IconButton>
          <IconButton onClick={handleMenu}>
            <Avatar
              alt={user?.name}
              src={user?.avatar}
              sx={{ bgcolor: "primary.main" }}>
              {user?.name?.[0] || "U"}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/profile");
            }}>
            <Person sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
          <MenuItem onClick={handleNotificationsClose}>
            New order received
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose}>
            Installation completed
          </MenuItem>
          <MenuItem onClick={handleNotificationsClose}>
            System update available
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
