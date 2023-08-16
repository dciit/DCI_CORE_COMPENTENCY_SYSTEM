import {useEffect, useState} from 'react'
import SrvCoreAssessment from "../../../service/coreAssessment.ts"
import { useSelector, useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from "@mui/material"
import { useNavigate  } from "react-router-dom";


export interface IGroup {
    dv_name : string;
    grp_cd : string;
  }

function CoreAssessment_selectSetion() {
    let navigate = useNavigate(); 
    const dispatch = useDispatch();
  
  
    
    const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState);
    const [section,setsection] = useState<IGroup[]>([]);
  
    useEffect(() => {
      
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload:{...trackingStep,
          trackingCount:0,
          trackingDept:trackingStep.trackingDept,
          trackingSection:''} 
      
       })


      SrvCoreAssessment.getSection(trackingStep.trackingDept).then((res)=>{
        try{
            setsection(res.data)
         
        }catch(error){
          console.log(error)
        }
      })
    }, [])
  
  
    const selectSecetion = (section:string) => {
      dispatch({
        type: "NEXT_TRACKING_STEP",
        payload:{...trackingStep,trackingSection:section} 
      
       })
      navigate(`/backend/core-assessment/${trackingStep.trackingDept}/${section}`)
      
    }
    
  
    return (
      <>
           <Box sx={{ '& button': { p: 4 , m:5 },
               overflow: "hidden",
               overflowY: "hidden" }}>
          <Grid container spacing={5} >
              {section.map((sections,index) =>(
                   
                    <Grid item xs={6} key={index}>
                      <Button variant="contained" 
                       sx={{width:"80%",height:"80%",borderRadius:5,background:"tomato"}}
                      onClick={() => selectSecetion(sections.grp_cd)}
                      >
                      <Typography variant="body1">{sections.dv_name} ({sections.grp_cd}) </Typography>
                        </Button>
                    </Grid>
                  
              
              ))}
          </Grid>
          </Box>
      </>
    )
}

export default CoreAssessment_selectSetion