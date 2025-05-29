import {useEffect, useState} from 'react'
import { Avatar, Badge, Box, List, ListItemButton, ListItemIcon, Typography } from "@mui/material"
import { Menu, MenuItem, Sidebar, SubMenu, useProSidebar } from "react-pro-sidebar"
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import coreAssessment from '../../service/coreAssessment';
import counterBadge from '../../service/counterBadge';
import { Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MailIcon from '@mui/icons-material/Mail';
import AlarmIcon from '@mui/icons-material/Alarm';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
function AppSidebar() {

const { collapsed, toggleSidebar } = useProSidebar()

 const user_info:any = Cookies.get("user_info") 
 const empcode = user_info ? JSON.parse(user_info)[0].EmpCode : ""
 const name = user_info ? JSON.parse(user_info)[0].ShortName : ""
 const position_long = user_info ? JSON.parse(user_info)[0].SECT_Long : ""
 const position = user_info ? JSON.parse(user_info)[0].Position : ""
 const empPic = user_info ? JSON.parse(user_info)[0].EmpPic : ""
//  const position:string = "GM"
//  const empcode:string = "13257" 
 //13257
 //14766



//   const navigate = useNavigate();
  const [activeMenuItem,setActiveMenuItem] = useState("")
  const [collapsedMenu,setcollapsedMenu] = useState<boolean>(true)
//   const [depts,setdept] = useState<string>(dept)
//   const [sects,setsect] = useState<string>(sect)
//   const [groups,setgroup] = useState<string>(group)

  const [dept,setdept] = useState<string>("")
  const [sect,setsect] = useState<string>("")
  const [group,setgroup] = useState<string>("")
  const [postitonStatus,setpositionStatus] = useState<string>("")
//   const [position_number,setposition_number] = useState<string>("")
  const PostionSupervisor:string[] =["SE","SS","ST","SU"]
  const PostionManeger:string[] =["MG","AM","AMG"]
  const PositionGM:string[] = ["GM","SGM","AG","AGM","PD","DI"]


  const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState);
  const counterBadgeStep = useSelector((state:any) => state.counterBagdeStateReducer.counterBadgeState);


  const dispatch = useDispatch();

  async function getCounterBadge(empcode:string) {

    const res:any = await counterBadge.getBadgeDev(empcode)
        try{
            dispatch({
                type: "GET_COUNTER",
                payload:{...counterBadgeStep,counterBadge_EVALUTED:res[0],counterBadge_APPROVE:res[1] } 
                
             })

        }catch (error) {
            console.log(error);
        }
        
           
  }


  async function checkDvcdEmployeeFlowLogin(empcode:string) {
    const res: any = await coreAssessment.getEmployeeFlowLogin(empcode)
    try {
        if(PostionSupervisor.includes(position)){

            setdept(res.employeeLoginDept)   
            setsect(res.employeeLoginSect)
            setgroup(res.employeeLoginGroup)
            setpositionStatus("SS")

    

        }else if(PostionManeger.includes(position)){

            setdept(res.employeeLoginDept)   
            setsect(res.employeeLoginSect)
            setpositionStatus("MG")
         
    

        }else if(PositionGM.includes(position)){
            setdept(res.employeeLoginDept)      
            setpositionStatus("GM")
    
        }else{
            setpositionStatus("ADMIN")
      
        }

    } catch (error) {
      console.log(error);
    }
  }

    useEffect(() => {
        

        checkDvcdEmployeeFlowLogin(empcode)
        getCounterBadge(empcode)
        setActiveMenuItem(window.location.pathname)

      
        //navigate("/backend/dashboard");
    }, [])
 


   const handleMenuClick = (menu:string) =>{
        setActiveMenuItem(menu)
        toggleSidebar()

        dispatch({
            type: "FIRST_TRACKING_STEP",
            payload:{...trackingStep,trackingDeptFirstStep:dept,trackingDept:dept,trackingSection:sect,trackingGroup:group} 
        
       })

    
     
    }


   

  return (
    <Sidebar
        
            // style={{ height: trackingStep.trackingCount == "4" && position == "GM" ? "90dvh" : (
            // trackingStep.trackingCount == "3" && position == "MG" ? "120dvh": 
            // ( trackingStep.trackingCount == "2" && position == "SS" ? "175dvh": "100dvh")
            // ) }}
   
            style ={{ height:"auto"
             , top: 'auto',color:'black' }}
            breakPoint="md"
            backgroundColor={'#FFFF'}
            //#F6F7FF
            
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
                            background: active ? '#1877F214' : 'transparent',
                            color:active? '#1877F2' :'#637381'
                        }
                    }
                }}>

                 {position == "ADMIN" ? <>
                    <MenuItem active={activeMenuItem === "/CASAPP/backend/admin/DashBoard" } component={<Link to="/CASAPP/backend/admin/DashBoard" />} onClick={()=>handleMenuClick("/CASAPP/backend/admin/DashBoard")} icon={<DashboardIcon />}> <Typography variant="body1">Dash board</Typography></MenuItem>
                    <MenuItem active={activeMenuItem === "/CASAPP/backend/admin/setAssessmentRound" } component={<Link to="/CASAPP/backend/admin/setAssessmentRound" />} onClick={()=>handleMenuClick("/CASAPP/backend/admin/setAssessmentRound")} icon={<AlarmIcon />}> <Typography variant="body1">รอบการประเมิน</Typography></MenuItem>
                    <MenuItem active={activeMenuItem === "/CASAPP/backend/admin/ManageRoleAssessment" } component={<Link to="/CASAPP/backend/admin/ManageRoleAssessment" />} onClick={()=>handleMenuClick("/CASAPP/backend/admin/ManageRoleAssessment")} icon={<GroupIcon />}> <Typography variant="body1">Organization</Typography></MenuItem>
                    <MenuItem active={activeMenuItem === "/CASAPP/backend/admin/employeeTrainingRecord" } component={<Link to="/CASAPP/backend/admin/employeeTrainingRecord" />} onClick={()=>handleMenuClick("/CASAPP/backend/admin/employeeTrainingRecord")} icon={<SchoolIcon />}> <Typography variant="body1">สรุปผลการอบรม</Typography></MenuItem>

                    <Menu  
                    
                           menuItemStyles={{
                            
                            button: ({active}) =>{
                                return {
                                    background: active ? '#1877F214' : 'transparent',
                                    color:active? '#1877F2' :'#637381'
                                }
                            }
                        }}>
                                   
                        <SubMenu icon={<AssessmentRoundedIcon />} label="สรุปผลการประเมิน">
              
                                <Link
                                    to={"/CASAPP/backend/admin/AssessmentRoundReport"}
                                    className="menu-bars text-center"
                                >
                                    <MenuItem
                                    active={
                                        activeMenuItem ===
                                        "/CASAPP/backend/admin/AssessmentRoundReport"
                                    }
                                    onClick={() =>
                                        handleMenuClick(
                                        "/CASAPP/backend/admin/AssessmentRoundReport"
                                        )
                                    }
                                   
                                    >
                                    <Typography variant="body2">&nbsp;&nbsp; ระดับพนักงาน (LV 1-4)</Typography>
                                      
                                    </MenuItem>
                                </Link>
                            

                                <Link
                                to={"/CASAPP/backend/admin/AssessmentRoundReportManager"}
                                className="menu-bars text-center"
                                >
                                <MenuItem
                                    active={
                                    activeMenuItem ===
                                    "/CASAPP/backend/admin/AssessmentRoundReportManager"
                                    }
                                    onClick={() =>
                                    handleMenuClick("/CASAPP/backend/admin/AssessmentRoundReportManager")
                                    }
                           
                                >
                                  <Typography variant="body2">ระดับผู้จัดการ (LV 5)</Typography>
                                   
                                
                                </MenuItem>
                                </Link>
                        </SubMenu>
            
                    </Menu>


                     
                    </>

                  : 
                    <>
                     <MenuItem active={activeMenuItem === "/CASAPP/backend/dashboard" } component={<Link to="/CASAPP/backend/dashboard" />} onClick={()=>handleMenuClick("/CASAPP/backend/dashboard")} icon={<DashboardOutlinedIcon />}> <Typography variant="body1">Dashboard</Typography></MenuItem>
                
                            {postitonStatus == "SS" ?
                                    
                                <MenuItem active={activeMenuItem === `/CASAPP/backend/core-assessment/${dept}/${sect}/${group}` } component={<Link to={`/CASAPP/backend/core-assessment/${dept}/${sect}/${group}`}  />} onClick={()=>handleMenuClick(`/CASAPP/backend/core-assessment/${dept}/${sect}/${group}`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body2">ประเมินสมรรถนะ<br/>ความสามารถบุคคล</Typography></MenuItem> 
                                : postitonStatus == "MG" ? 
                                    
                                <MenuItem active={activeMenuItem === `/CASAPP/backend/core-assessment/${dept}/${sect}` } component={<Link to={`/CASAPP/backend/core-assessment/${dept}/${sect}`}  />} onClick={()=>handleMenuClick(`/CASAPP/backend/core-assessment/${dept}/${sect}`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body2">ประเมินสมรรถนะ<br/>ความสามารถบุคคล</Typography></MenuItem> 
                                :
                                
                                <MenuItem  active={activeMenuItem === `/CASAPP/backend/core-assessment/` } component={<Link to={`/CASAPP/backend/core-assessment/`}  />} onClick={()=>handleMenuClick(`/CASAPP/backend/core-assessment/`)} icon={<AssessmentOutlinedIcon />}> <Typography variant="body1">ประเมินความสามารถ</Typography></MenuItem> 
                                                
                            }

                    <MenuItem  onClick={() => (setcollapsedMenu(!collapsedMenu))} icon={<AssignmentIndOutlinedIcon />}> 
                            
                        <Typography display="inline" variant="body1">ประเมินและอนุมัติ</Typography>
                        
                        <Typography display="inline" variant="body1" >  &nbsp;   {collapsedMenu ? <ExpandLessIcon style={{margin:-7}}/> : <ExpandMoreIcon style={{margin:-7}}/>}</Typography>
                    </MenuItem>
                            
                    <Collapse in={collapsedMenu} timeout="auto" unmountOnExit>
                        <List >
                            <ListItemButton >
                                <ListItemIcon style={{marginLeft:-10,paddingLeft:2}}>

                                        <MenuItem   active={activeMenuItem === `/CASAPP/backend/core-assessmentList` } component={<Link to={`/CASAPP/backend/core-assessmentList`}  />} onClick={()=>handleMenuClick(`/CASAPP/backend/core-assessmentList`)}>  
                                        {!collapsed ?  <Typography display="inline" variant="body2"> รายการที่ประเมินแล้ว (Evaluted)</Typography>: <MailIcon/>}

                                        </MenuItem> 
                                        <Badge badgeContent={counterBadgeStep.counterBadge_EVALUTED} color="error" ></Badge>

                                </ListItemIcon>
                            </ListItemButton>

                            <ListItemButton >
                                <ListItemIcon style={{marginLeft:-10,paddingLeft:2}}>
                                    {postitonStatus == "GM" ? <>
                                    
                                        <MenuItem active={activeMenuItem === `/CASAPP/backend/core-assessmentListApprove-gm` } component={<Link to={`/CASAPP/backend/core-assessmentListApprove-gm`}  />} 
                                            onClick={()=>handleMenuClick(`/CASAPP/backend/core-assessmentListApprove-gm`)} > 
                                            {!collapsed ?  <Typography display="inline" variant="body2"> รายการอนุมัติ (Approve)</Typography>: <MailIcon/>}
                                        
                                        </MenuItem> 
                                    </> : <>
                                    
                                        <MenuItem active={activeMenuItem === `/CASAPP/backend/core-assessmentListApprove/` } component={<Link to={`/CASAPP/backend/core-assessmentListApprove/`}  />} 
                                            onClick={()=>handleMenuClick(`/CASAPP/backend/core-assessmentListApprove/`)} > 
                                            {!collapsed ?  <Typography display="inline" variant="body2"> รายการอนุมัติ (Approve)</Typography>: <MailIcon/>}
                                        
                                    </MenuItem> 
                                    
                                    </>}
                                    
                                    <Badge badgeContent={counterBadgeStep.counterBadge_APPROVE} color="error" ></Badge>
                                </ListItemIcon>
                            </ListItemButton>         
                        </List>
                                
                    </Collapse>
                    </>
                }

               

             
             
                
            

                {/* <MenuItem active={activeMenuItem === `/backend/core-assessmentList` } component={<Link to={`/backend/core-assessmentList`} />} onClick={()=>handleMenuClick(`/backend/core-assessmentList`)} icon={<AssignmentIndOutlinedIcon />}> <Typography variant="body2">รายการผู้รับการประเมิน  {collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Typography> </MenuItem> */}


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
        width: '45%',
        height: 'auto',
        marginBottom: 2
    },
    yourChannel: {
    
        color:'black'
        
    }
}

export default AppSidebar