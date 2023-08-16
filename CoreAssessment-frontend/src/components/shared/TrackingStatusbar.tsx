import {useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
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
import { position } from "../../constant/authen.ts"

  
  const ColorlibConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
     
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
   

    
  }));
  
  const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));
  


function TrackingStatusbar() {

    const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState.trackingCount);
    const [statusPositions,setstatusPositions] = useState<string[]>([]);
    const PostionSupervisor:string[] =["SE","SS","ST","SU"]
    const PostionManeger:string[] =["MG","AM"]
    const PositionGM:string[] = ["GM","SGM","AG"]

    useEffect(() => {


      if(PostionSupervisor.includes(position)){
        setstatusPositions(['เลือก Core Level','เลือกพนักงาน','ประเมินพนักงาน']);

      }else if(PostionManeger.includes(position)){
        setstatusPositions(['เลือก Group', 'เลือก Core Level','เลือกพนักงาน','ประเมินพนักงาน']);

      }else if(PositionGM.includes(position)){
        setstatusPositions(['เลือก Section', 'เลือก Group', 'เลือก Core Level','เลือกพนักงาน','ประเมินพนักงาน']);

      }

    
        
    }, [])
      
    
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
    
    };
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
 


}

    return (<> 
      {/* {position}
      {JSON.stringify(statusPositions)} */}
     <Stack sx={{ width: '100%' }} spacing={4}>
        <Stepper alternativeLabel activeStep={trackingStep} connector={<ColorlibConnector />}>
          {statusPositions.map((label) => (
            <Step key={label} >
              <StepLabel  StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </>
       
    );
  }

export default TrackingStatusbar