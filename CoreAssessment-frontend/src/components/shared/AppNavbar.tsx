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
import { useProSidebar } from "react-pro-sidebar";
import { Logout, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { persistor } from "../../redux/store";

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
      persistor.purge()
      Cookies.remove('user_info')
      navigate("CASAPP/");
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
      
        <Box sx={{ ml: "20px"}}><h1 className="text-xl">Compentency Assessment (Knowledge)  <span className="bg-gray-100 rounded m-2 p-[2px] text-[12px] text-gray-600">V1.0.5</span></h1></Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          size="large"
          aria-controls="menu"
          aria-haspopup="true"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <Avatar
             src="http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/config.png"
            //src="http://127.0.0.1:5173/CASAPP/assets/images/config.png"
            alt="Avatar"
            sx={{ width: 50, height: 50 }}
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
    bgcolor: "#536DFE",
  },
  appLogo: {
    borderRadius: 2,
    width: 40,
    marginLeft: 2,
    cursor: "pointer",
  },
};

export default AppNavbar;
