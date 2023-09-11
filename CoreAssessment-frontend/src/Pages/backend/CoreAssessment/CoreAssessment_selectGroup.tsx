import {useEffect, useState} from 'react'
import SrvCoreAssessment from "../../../service/coreAssessment.ts"
import { useSelector, useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from "@mui/material"
import { useNavigate  } from "react-router-dom";
import {position} from "../../../constant/authen.ts"


export interface IGroup {
  dv_name : string;
  grp_cd : string;
}



function CoreAssessment_selectGroup() {
  let navigate = useNavigate(); 
  const dispatch = useDispatch();
  const POSITION : string = position


  
  const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState);
  const [groups,setgroups] = useState<IGroup[]>([]);
  //const authenStore = useSelector((state:any) => state.authenReducer.userAuthenData);


  useEffect(() => {
    if(POSITION == "GM"){
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload:{...trackingStep,
          trackingCount:1,
          trackingDept:trackingStep.trackingDept,
          trackingSection:trackingStep.trackingSection,
          trackingGroup:''} 
      
       })
  
    }else{
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload:{...trackingStep,
          trackingCount:0,
          trackingDept:trackingStep.trackingDept,
          trackingSection:trackingStep.trackingSection,
          trackingGroup:''} 
      
       })

    }
    

    SrvCoreAssessment.getSection(trackingStep.trackingSection).then((res)=>{
      try{
        setgroups(res.data)
       
      }catch(error){
        console.log(error)
      }
    })
  }, [])


  const selectGroup = (group:string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload:{...trackingStep,trackingGroup:group} 
    
     })
    navigate(`/backend/core-assessment/${trackingStep.trackingDept}/${trackingStep.trackingSection}/${group}`)
    
  }
  

  return (
    <>
         <Box sx={{ '& button': { p: 4 , m:5 },
             overflow: "hidden",
             overflowY: "hidden" }}>
        <Grid container spacing={5} >
            {groups.map((groups,index) =>(
                 
                  <Grid item xs={4} key={index}>
                    <Button variant="contained" 
                     sx={{width:"80%",height:"60%",borderRadius:5,background:"tomato"}}
                    onClick={() => selectGroup(groups.grp_cd)}
                    >
                    <Typography variant="body1">{groups.dv_name} ({groups.grp_cd})</Typography>
                      </Button>
                  </Grid>
                
            
            ))}
        </Grid>
        </Box>
    </>
  )
}

export default CoreAssessment_selectGroup