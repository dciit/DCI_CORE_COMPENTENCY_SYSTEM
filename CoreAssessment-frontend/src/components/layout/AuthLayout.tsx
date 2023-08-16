import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}

export default AuthLayout;
