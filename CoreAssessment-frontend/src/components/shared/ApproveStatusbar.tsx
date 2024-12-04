import {useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import SettingsIcon from '@mui/icons-material/Settings';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import GroupIcon from '@mui/icons-material/Group';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { useSelector } from "react-redux";
// import { position } from "../../constant/authen.ts"
import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
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
  


function ApproveStatusbar() {
    // const user_info:any = Cookies.get("user_info") 
    // const position = user_info ? JSON.parse(user_info)[0].Position : ""
    const [statusPositions,setstatusPositions] = useState<string[]>([]);
    const approveTrackingStep = useSelector((state:any) => state.approveTrackingStateReducer.approveTrackingState);



    let navigate = useNavigate();

    const step1_dept:string = `CASAPP/backend/core-assessmentListApprove-gm/`
    const step2_sect:string = `CASAPP/backend/core-assessmentListApprove-gm/${approveTrackingStep.approveTrackingDept}/`
    const step3_group:string = `CASAPP/backend/core-assessmentListApprove-gm/${approveTrackingStep.approveTrackingDept}/${approveTrackingStep.approveTrackingSection}/`
    const step4_approve:string = `CASAPP/backend/core-assessmentListApprove-gm/${approveTrackingStep.approveTrackingDept}/${approveTrackingStep.approveTrackingSection}/${approveTrackingStep.approveTrackingGroup}/`
    



    useEffect(() => {


      
        setstatusPositions(['เลือก Dept','เลือก Section','เลือก Group','Approve พนักงาน','ดูผลการประเมิน']);

     
    
        
    }, [])

    const selectTracking = (step:number,status:string) =>{
       
      if(step <= approveTrackingStep.approveTrackingCount){
        if(status == "เลือก Dept"){
          navigate(step1_dept);
        }
        else if(status == "เลือก Section" ){
          navigate(step2_sect);
        }else if(status == "เลือก Group" ){
          navigate(step3_group);
        }else if(status == "Approve พนักงาน" ){
          navigate(step4_approve);
        }
      }
           
   
        
    }
      
    
function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;


    const icons: { [index: string]: React.ReactElement } = {
      1: <GroupIcon />,
      2: <VideoLabelIcon />,
      3: <GroupIcon />,
      4: <CheckCircleIcon />,
      5: <PersonSearchOutlinedIcon />,
    
    };
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  
}

    return (<> 
     <Stack sx={{ width: '100%' }} spacing={2}>
        <Stepper alternativeLabel activeStep={approveTrackingStep.approveTrackingCount} connector={<ColorlibConnector />}>
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

export default ApproveStatusbar