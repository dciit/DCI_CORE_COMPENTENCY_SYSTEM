import  { useState } from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import { useProSidebar } from "react-pro-sidebar";
import { Logout, Money, Settings, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AppNavbar() {
  const navigate = useNavigate();
  const { collapseSidebar, toggleSidebar, broken } = useProSidebar();


  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
      Cookies.remove('user_info')
      navigate("/");
  };
  return (
    <AppBar position="sticky" sx={styles.AppBar}>
      <Toolbar>
        <IconButton
          onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
          color="secondary"
        >
          <MenuIcon />
        </IconButton>
      
        <Box sx={{ ml: "20px", fontSize: "20px" }}>Compentency Assessment</Box>

        <Box sx={{ flexGrow: 1 }} />


        <IconButton title="Notifications" color="secondary">
          <NotificationsOutlined />
        </IconButton>
        <IconButton title="Language" color="secondary">
          <LanguageOutlined />
        </IconButton>
        <IconButton
          size="large"
          aria-controls="menu"
          aria-haspopup="true"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <Avatar
            src="/public/assets/41210.jpg"
            alt="Avatar"
            sx={{ width: 28, height: 28 }}
          />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} sx={{ px: "30px" }}>
            <Person sx={{ fontSize: "16px", mr: "20px" }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ px: "30px" }}>
            <Settings sx={{ fontSize: "16px", mr: "20px" }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ px: "30px" }}>
            <Money sx={{ fontSize: "16px", mr: "20px" }} /> Billing
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ px: "30px" }}>
            <Logout sx={{ fontSize: "16px", mr: "20px" }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

const styles = {
  AppBar: {
    bgcolor: "teal",
  },
  appLogo: {
    borderRadius: 2,
    width: 40,
    marginLeft: 2,
    cursor: "pointer",
  },
};

export default AppNavbar;
