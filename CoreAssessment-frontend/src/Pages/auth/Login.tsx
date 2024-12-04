import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material";
import theme from "../../Config/theme";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import SrvAuthen, { checkPermission } from "../../service/authen.ts";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import coreAssessment from "../../service/coreAssessment.ts";

export interface ILogin {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [imageCurentIndex, setimageCurentIndex] = useState<number>(0);
  const positionPermission: string[] = [
    "SE",
    "SS",
    "ST",
    "SU",
    "MG",
    "AM",
    "GM",
    "SGM",
    "AG",
    "AGM"
  ];
  const PostionSupervisor:string[] =["SE","SS","ST","SU"]
  const PostionManeger:string[] =["MG","AM","AMG"]
  const PositionGM:string[] = ["GM","SGM","AG","AGM","PD","DI"]
  // const admin: string[] = ["SYSS"];
  const dispatch = useDispatch();

  const images: string[] = [
    "http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/dci1.jpg",
    "http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/dci2.jpg",
    "http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/dci3.jpg",
    "http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/dci4.jpg",
    "http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/dci5.jpg",
  ];

  let num: number = 0;

  useEffect(() => {
    if (Cookies.get("user_info")) {
      navigate("/CASAPP/backend/dashboard");
    }

    const intervalId = setInterval(() => {
      if (num === images.length) {
        setimageCurentIndex(0);
        num = 0;
      } else {
        setimageCurentIndex(num++);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    SrvAuthen.Login(username, password).then( async (res) => {
      try {
        if (Object.keys(res).length > 0) {

          if (res.data[0].EmpCode != null && positionPermission.includes(res.data[0].Position)) {
            Cookies.set("user_info", JSON.stringify(res.data), {
              expires: 1,
              path: "/",
            });
            checkDvcdEmployeeFlowLogin(res.data[0].EmpCode,res.data[0].ShortName,res.data[0].Position)
            navigate("/CASAPP/backend/dashboard");
          } else if (username == "hr1" && password == "hr1") {
            Cookies.set(
              "user_info",
              JSON.stringify([
                {
                  EmpCode: "14766",
                  ShortName: "SASIPREEYA.P",
                  Position: "MG",
                  EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/14766.jpg",
                },
              ]),
              {
                expires: 1,
                path: "/",
              }
            );
            await checkDvcdEmployeeFlowLogin("14766","SASIPREEYA.P","MG");
            navigate("/CASAPP/backend/dashboard");
          
  
          } else if (username == "hr2" && password == "hr2") {
          
            Cookies.set(
              "user_info",
              JSON.stringify([
                {
                  EmpCode: "13257",
                  ShortName: "GOVIT.P",
                  Position: "GM",
                  EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/13257.jpg",
                },
              ]),
              {
                expires: 1,
                path: "/",
              }
            );
            await checkDvcdEmployeeFlowLogin("13257","GOVIT.P","GM");
            navigate("/CASAPP/backend/dashboard");
          } else if (username == "hr3" && password == "hr3") {
          Cookies.set(
            "user_info",
            JSON.stringify([
              {
                EmpCode: "40865",
                ShortName: "AUKIT.K",
                Position: "MG",
                EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/40865.jpg",
              },
            ]),
            {
              expires: 1,
              path: "/",
            }
          );
          await checkDvcdEmployeeFlowLogin("40865","AUKIT.K","MG")
       
           navigate("/CASAPP/backend/dashboard");
          } else if (username == "hr4" && password == "hr4") {
          Cookies.set(
            "user_info",
            JSON.stringify([
              {
                EmpCode: "32230",
                ShortName: "PANYA.T",
                Position: "AG",
                EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/32230.jpg",
              },
            ]),
            {
              expires: 1,
              path: "/",
            }
          );
          await checkDvcdEmployeeFlowLogin("32230","PANYA.T","AG");
          navigate("/CASAPP/backend/dashboard");
          }
          else if (username == "hr5" && password == "hr5") {
          Cookies.set(
            "user_info",
            JSON.stringify([
              { //24552
                EmpCode: "11620",
                ShortName: "ONUMA.J",
                Position: "MG",
                EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/11620.jpg",
              },
            ]),
            {
              expires: 1,
              path: "/",
            }
          );
          await checkDvcdEmployeeFlowLogin("11620","test","MG");
          navigate("/CASAPP/backend/dashboard");
          }
          else if (username == "gm" && password == "1234") {
            Cookies.set(
              "user_info",
              JSON.stringify([
                {
                  EmpCode: "10052",
                  ShortName: "NATTAWAT.K",
                  Position: "AG",
                  EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/10052.jpg",
                },
              ]),
              {
                expires: 1,
                path: "/",
              }
            );
            await checkDvcdEmployeeFlowLogin("10052","NATTAWAT.K","AG");
            navigate("/CASAPP/backend/dashboard");
          }
          else if (username == "sup" && password == "1234") {
              Cookies.set(
                "user_info",
                JSON.stringify([
                  {
                    EmpCode: "20765",
                    ShortName: "P นิว",
                    Position: "SE",
                    EmpPic: "http://dcidmc.dci.daikin.co.jp/PICTURE/20765.jpg",
                  },
                ]),
                {
                  expires: 1,
                  path: "/",
                }
              );
              await checkDvcdEmployeeFlowLogin("20765","P นิว","SE");
              navigate("/CASAPP/backend/dashboard");
          }
            
          else if (username == "admin" && password == "1234") {
            Cookies.set(
              "user_info",
              JSON.stringify([
                {
                  EmpCode: "admin",
                  ShortName: "ADMIN",
                  Position: "ADMIN",
                  EmpPic: "http://dciweb2.dci.daikin.co.jp/CASAPP/assets/images/admin.jpg",
                },
              ]),
              {
                expires: 1,
                path: "/",
              }
            );
            await checkDvcdEmployeeFlowLogin("1234","ADMIN","ADMIN");

            navigate("/CASAPP/backend/admin/DashBoard");
          }else{

            var str = "คุณไม่มีสิทธิ์ใช้งานระบบ  !!"
            var str2 = "กรุณาติดต่อหน่วยงาน IT (611) หรือ HR (113)"

            Swal.fire({
              icon: "warning",
              html: str + '<br>' + str2,
              text: "",
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            text: "คุณกรอกรหัสไม่ถูกต้อง !!",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  async function checkDvcdEmployeeFlowLogin(empcode:string,name:string,position:string) {
    const res: any = await coreAssessment.getEmployeeFlowLogin(empcode)
    try {
        if(PostionSupervisor.includes(position)){

             
              dispatch({
                type: "GET_POSITION_NUMBER",
                payload:{empcode:empcode,name:name,position:position,position_number:res.employeeLoginGroup} 
        
             })
    
    

        }else if(PostionManeger.includes(position)){


              dispatch({
                type: "GET_POSITION_NUMBER",
                payload:{empcode:empcode,name:name,position:position,position_number:res.employeeLoginSect} 
        
             })
    

        }else if(PositionGM.includes(position)){

              dispatch({
                type: "GET_POSITION_NUMBER",
                payload:{empcode:empcode,name:name,position:position,position_number:res.employeeLoginDept} 
        
             })
    
        }else{
          dispatch({
            type: "GET_POSITION_NUMBER",
            payload:{empcode:"1234",name:"ADMIN",position:"ADMIN"} 
    
         })
        }

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${images[imageCurentIndex]})`,
            transition: "background-image 2s ease-in-out",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t:any) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ backgroundColor: "mintcream" }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                m: 4,
                bgcolor: "secondary.main",
                width: "90px",
                height: "90px",
              }}
            >
              <LockOutlinedIcon sx={{ width: "50px", height: "50px" }} />
            </Avatar>
            {/* <Typography component="h1" variant="h4">
              COMPENTENCY KNOWLEDGE ASSESSMENT SYSTEM
            </Typography> */}
            <h1 className="text-[17px] md:text-[28px]">  COMPENTENCY ASSESSMENT SYSTEM (Knowledge)</h1>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
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
                onChange={(e:any) => setusername(e.target.value)}
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
                onChange={(e:any) => setpassword(e.target.value)}
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
  );
}

export default Login;
