
import React, { useState,useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from "@mui/material";
import theme from "../../Config/theme"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SrvAuthen from "../../service/authen.ts"
import Cookies from "js-cookie";
// import { useDispatch } from "react-redux";

export interface ILogin {
  username : string;
  password : string;
}


function Login() {
  const navigate = useNavigate();
  //const dispatch = useDispatch();
  const [username,setusername] = useState<string>("");
  const [password,setpassword] = useState<string>("");


  useEffect(() => {
    if (Cookies.get("user_info")) {
      navigate("/backend/dashboard");
    }
  }, [])
  


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   
      SrvAuthen.Login(username,password).then((res)=>{
        try{
          if (res.data[0].EmpCode != null){
            Cookies.set("user_info", JSON.stringify(res.data), {
              expires: 1,
              path: "/",
            });
            navigate("/backend/dashboard");
          }
          else{
            Swal.fire({
              icon: 'warning',
              text: 'คุณกรอกรหัสไม่ถูกต้อง!',
            })
          }
        }catch(error){
          console.log(error)
        }
      })
      
   
       
        
  }
  return (
    <ThemeProvider theme={theme}>
    <Grid container component="main" sx={{ height: '100vh' }}>
    <CssBaseline />
    <Grid
      item
      xs={false}
      sm={4}
      md={7}
      sx={{
        backgroundImage: 'url(/public/assets/images/daikin3.jpg)',
        //backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
    />
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
             <Avatar
                sx={{
                  m: 4,
                  bgcolor: "secondary.main",
                  width: "70px",
                  height: "70px",
                }}
              >
                <LockOutlinedIcon sx={{ width: "50px", height: "50px" }} />
              </Avatar>
        <Typography component="h1" variant="h5">
          COMPENTENCY ASSESSMENT SYSTEM        
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="email"
            autoFocus
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
       
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 100 }}
          >
            Sign In
          </Button>
        
        </Box>
      </Box>
    </Grid>
  </Grid>
  </ThemeProvider>
  )
}

export default Login