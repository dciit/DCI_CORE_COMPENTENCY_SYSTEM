import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppSidebar from "../shared/AppSidebar";
import AppNavbar from "../shared/AppNavbar";


function BackendLayout() {
  return (
    <>
   
  
      <CssBaseline />
     
      <AppNavbar />
      <Box sx={styles.container}>
        <AppSidebar />
        <Box component={"main"} sx={styles.mainSection}>         
          <Outlet />
        </Box>
      </Box>
    
      
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    bgcolor: "neutral.light",
  },
  mainSection: {
    mt:1,
    px: 1,
    pt:1,
    width: "100%",
    height: "100%",
    // overflow: "auto",
  },
};

export default BackendLayout;
