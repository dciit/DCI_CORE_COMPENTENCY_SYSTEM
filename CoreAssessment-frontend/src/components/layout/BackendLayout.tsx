import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppSidebar from "../shared/AppSidebar";
import AppNavbar from "../shared/AppNavbar";
import { bg } from "date-fns/locale";


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
    mt:0,
    p: 4,
    pt:4,
    width: "100%",
    height: "screen",
    bgcolor: "#f7f7f7",
    // overflow: "auto",
  },
};

export default BackendLayout;
