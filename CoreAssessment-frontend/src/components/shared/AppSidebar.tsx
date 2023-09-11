import {useEffect, useState} from 'react'
import { Avatar, Box, Typography } from "@mui/material"
import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar"
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

//import {empPic,name,position_long,position,dept,sect,group} from "../../constant/authen.ts"

function AppSidebar() {
 const user_info:any = Cookies.get("user_info") 
 const name = user_info ? JSON.parse(user_info)[0].ShortName : ""
 const position_long = user_info ? JSON.parse(user_info)[0].SECT_Long : ""
 //const position_short = user_info ? JSON.parse(user_info)[0].SECT_Short : ""
//  const position = user_info ? JSON.parse(user_info)[0].Position : ""
 const dept = user_info ? JSON.parse(user_info)[0].DEPT_CD : ""
 const sect = user_info ?JSON.parse(user_info)[0].SECT_CD  : ""
 const group = user_info ? JSON.parse(user_info)[0].DVCD : ""
 const empPic = user_info ? JSON.parse(user_info)[0].EmpPic : ""
 const position:string = "SS"
//   const dept = "40000"
//  const sect = "40100"
//  const group = "40110"




  const navigate = useNavigate();
  const { collapsed, toggleSidebar } = useProSidebar()
  const [activeMenuItem,setActiveMenuItem] = useState("")
  const [depts,setdept] = useState<string>(dept)
  const [sects,setsect] = useState<string>(sect)
  const [groups,setgroup] = useState<string>(group)
  const [postitonStatus,setpositionStatus] = useState<string>("")
  const [position_number,setposition_number] = useState<string>("")
  const PostionSupervisor:string[] =["SE","SS","ST","SU"]
  const PostionManeger:string[] =["MG","AM"]
  const PositionGM:string[] = ["GM","SGM","AG"]

  //const adminPosition:string = "HRDS"

    

  //const image:string = "http://dcidmc.dci.daikin.co.jp/PICTURE/" + empcode + ".JPG"
  const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState);

  const dispatch = useDispatch();


    useEffect(() => {
        // if(position_short == adminPosition){
        //     setpositionStatus("SS")

        // }
    
        if(PostionSupervisor.includes(position)){
            setdept(depts)   
            setsect(sects)
            setgroup(groups)
            setpositionStatus("SS")
            setposition_number(groups)

        }else if(PostionManeger.includes(position)){
            setdept(depts)   
            setsect(sects)
            setpositionStatus("MG")
            setposition_number(sect)

        }else if(PositionGM.includes(position)){
         
            setdept(depts)      
            setpositionStatus("GM")
            setposition_number(depts)
        }
        navigate("/backend/dashboard");
    }, [])
 

   const handleMenuClick = (menu:string) =>{
        dispatch({
            type: "FIRST_TRACKING_STEP",
            payload:{...trackingStep,trackingDept:dept,trackingSection:sect,trackingGroup:group} 
        
       })

         dispatch({
            type: "GET_POSITION_NUMBER",
            payload:{position:position,position_number:position_number} 
    
         })
        setActiveMenuItem(menu)
        toggleSidebar()
    }


   

  return (
  
    <Sidebar
          
            // style={{ height: trackingStep.trackingCount == "4" && position == "GM" ? "175dvh" : (
            // trackingStep.trackingCount == "3" && position == "MG" ? "175dvh": 
            // ( trackingStep.trackingCount == "2" && position == "SS" ? "175dvh": "100dvh")
            // )
   
            style ={{ height:"100%"
             , top: 'auto',color:'#6E6E6ECC' }}
            breakPoint="md"
            backgroundColor={'#F6F7FF'}
            
        >
            <Box sx={styles.avatarContainer}>
                <Avatar sx={styles.avatar} alt="Masoud" src={empPic} />            
                {!collapsed ?  <Typography  variant="body2" sx={styles.yourChannel}>{name}</Typography> : null}
                {!collapsed ?  <Typography variant="body2" sx={{color:'black'}}>{position_long}</Typography>: null}
                {!collapsed ?  <Typography variant="body2" sx={{color:'black'}}>ตำแหน่ง : {position}</Typography>: null}
            
            </Box>
            <Menu
                menuItemStyles={{
                    button: ({active}) =>{
                        return {
                            background: active ? '#EEEEEE' : 'transparent',
                            color:active? 'black' :''
                        }
                    }
                }}>
                <MenuItem active={activeMenuItem === "/backend/dashboard" } component={<Link to="/backend/dashboard" />} onClick={()=>handleMenuClick("/backend/dashboard")} icon={<DashboardOutlinedIcon />}> <Typography variant="body2">Dashboard</Typography></MenuItem>
                
                {postitonStatus == "SS" ?
                        
                    <MenuItem active={activeMenuItem === `/backend/core-assessment/${dept}/${sect}/${group}` } component={<Link to={`/backend/core-assessment/${dept}/${sect}/${group}`}  />} onClick={()=>handleMenuClick(`/backend/core-assessment/${dept}/${sect}/${group}`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body2">ประเมินสมรรถนะ<br/>ความสามารถบุคคล</Typography></MenuItem> 
                    : postitonStatus == "MG" ? 
                        
                    <MenuItem active={activeMenuItem === `/backend/core-assessment/${dept}/${sect}` } component={<Link to={`/backend/core-assessment/${dept}/${sect}`}  />} onClick={()=>handleMenuClick(`/backend/core-assessment/${dept}/${sect}`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body2">ประเมินสมรรถนะ<br/>ความสามารถบุคคล</Typography></MenuItem> 
                    :
                       
                    <MenuItem  active={activeMenuItem === `/backend/core-assessment/${dept}` } component={<Link to={`/backend/core-assessment/${dept}`}  />} onClick={()=>handleMenuClick(`/backend/core-assessment/${dept}`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body2">ประเมินสมรรถนะ<br/>ความสามารถบุคคล</Typography></MenuItem> 
                                     
                }

                {/* <MenuItem active={activeMenuItem === `/backend/core-assessment/${dept}` } component={<Link to={`/backend/core-assessment/${dept}`}  />} onClick={()=>handleMenuClick(`/backend/core-assessment/${dept}`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body2">ประเมินสมรรถนะ<br/>ความสามารถบุคคล</Typography></MenuItem> */}
                <MenuItem active={activeMenuItem === `/backend/core-assessmentList` } component={<Link to={`/backend/core-assessmentList`} />} onClick={()=>handleMenuClick(`/backend/core-assessmentList`)} icon={<AssignmentIndOutlinedIcon />}> <Typography variant="body2">รายการผู้รับการประเมิน </Typography></MenuItem>
            </Menu >
        </Sidebar >
  )
}
const styles = {
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: 'column',
        my: 5
    },
    avatar: {
        width: '40%',
        height: 'auto'
    },
    yourChannel: {
        mt: 2,
        
        color:'black'
        
    }
}

export default AppSidebar