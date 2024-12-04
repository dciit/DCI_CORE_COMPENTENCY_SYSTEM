import {useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import RateReviewIcon from '@mui/icons-material/RateReview';
// import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { useSelector } from "react-redux";
// import { position } from "../../constant/authen.ts"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Divider } from '@mui/material';

  
  const ColorlibConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
     
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
        'linear-gradient( 95deg,#DAFFDC 0%,#85E78A 50%,#0AC212 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:          
          'linear-gradient( 95deg,#D0E7FA 0%,#59B2F9 50%,#2484D0 100%)',
      },
    },
   

    
  }));
  
  const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 32,
    height: 32,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 95deg,#DAFFDC 0%,#85E78A 50%,#0AC212 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 95deg,#D0E7FA 0%,#59B2F9 50%,#2484D0 100%)',
    }),
  }));
  


function TrackingStatusbar() {
    const user_info:any = Cookies.get("user_info") 
    const position = user_info ? JSON.parse(user_info)[0].Position : ""
    const tracking = useSelector((state:any) => state.trackingStateReducer.trackingState);
    const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState.trackingCount);
    const [statusPositions,setstatusPositions] = useState<string[]>([]);
    const PostionSupervisor:string[] =["SE","SS","ST","SU"]
    const PostionManeger:string[] =["MG","AM"]
    const PositionGM:string[] = ["GM","SGM","AG","AGM"]
    let navigate = useNavigate();

    const step1_dept:string = `CASAPP/backend/core-assessment/`
    const step2_sect:string = `CASAPP/backend/core-assessment/${tracking.trackingDept}/`
    const step3_group:string = `CASAPP/backend/core-assessment/${tracking.trackingDept}/${tracking.trackingSection}/`
    const step4_core:string = `CASAPP/backend/core-assessment/${tracking.trackingDept}/${tracking.trackingSection}/${tracking.trackingGroup}/`
    const step5_emp:string = `CASAPP/backend/core-assessment/${tracking.trackingDept}/${tracking.trackingSection}/${tracking.trackingGroup}/${tracking.trackingLevel}/`


    useEffect(() => {


      if(PostionSupervisor.includes(position)){
        setstatusPositions(['เลือก Core Level','เลือกพนักงาน','ประเมินพนักงาน']);

      }else if(PostionManeger.includes(position)){
        setstatusPositions(['เลือก Group', 'เลือก Core Level','เลือกพนักงาน','ประเมินพนักงาน']);

      }else if(PositionGM.includes(position)){
        setstatusPositions(['เลือก Dept','เลือก Section', 'เลือก Group', 'เลือก Core Level','เลือกพนักงาน','ประเมินพนักงาน']);

      }

    
        
    }, [])

    const selectTracking = (step:number,status:string) =>{
      if(statusPositions.length == 3 && step < trackingStep){
     
        if(status == "เลือก Core Level" ){
          navigate(step4_core);
        }else if(status == "เลือกพนักงาน" ){
          navigate(step5_emp);
        }
      }
           
      else if(statusPositions.length == 4 && step < trackingStep){
  
        if(status == "เลือก Group" ){
          navigate(step3_group);
        }else if(status == "เลือก Core Level"  ){
          navigate(step4_core);
        }else if(status == "เลือกพนักงาน"  ){
          navigate(step5_emp)
        }
      }
      
      else if(statusPositions.length == 6 && step < trackingStep){
        if(status == "เลือก Dept"){
         
          navigate(step1_dept)
        }else if(status == "เลือก Section"){
          navigate(step2_sect)
        }else if(status =="เลือก Group"){
          navigate(step3_group)
        }else if(status == "เลือก Core Level"){
          navigate(step4_core)
        }else if(status == "เลือกพนักงาน"){
          navigate(step5_emp)
        }
      }
        
    }
      
    
function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  if(PostionSupervisor.includes(position)){
    const icons: { [index: string]: React.ReactElement } = {
   
      1: <VideoLabelIcon />,
      2: <PersonSearchOutlinedIcon />,
      3: <AssessmentIcon />,
    
    };
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }else if (PostionManeger.includes(position)){
    const icons: { [index: string]: React.ReactElement } = {
      1: <GroupIcon />,
      2: <VideoLabelIcon />,
      3: <PersonSearchOutlinedIcon />,
      4: <AssessmentIcon />,
    
    };
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }else if(PositionGM.includes(position)){
    const icons: { [index: string]: React.ReactElement } = {
      1: <ReduceCapacityIcon />,
      2: <GroupIcon />,
      3: <VideoLabelIcon />,
      4: <PersonSearchOutlinedIcon />,
      5: <AssessmentIcon />,
      6: <RateReviewIcon/>,
    
    };
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
}

    return (<> 

     <Stack sx={{ width: '100%' }} spacing={2}>
        <Stepper alternativeLabel activeStep={trackingStep} connector={<ColorlibConnector />}>
          {statusPositions.map((label,i) => (
            <Step key={label} >
              <StepLabel className='hover:scale-105 transition-all duration-400 cursor-pointer select-none '  StepIconComponent={ColorlibStepIcon} onClick={() => selectTracking(i,label)}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
      <Divider className='py-2'></Divider>
    </>
       
    );
  }

export default TrackingStatusbar