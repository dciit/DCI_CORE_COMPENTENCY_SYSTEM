import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { position } from "../../../constant/authen.ts";
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
function CoreAssessment_selectCore() {
  const trackingStep = useSelector(
    (state: any) => state.trackingStateReducer.trackingState
  );
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [statusCoreLevel, setstatusCoreLevel] = useState<string>("");
  const corePositionLevel4: string[] = ["SE", "SS", "ST", "SU"];
  const corePositionLevel5_MG: string[] = ["MG", "AM"];
  const corePositionLevel5_GM: string[] = ["GM", "SGM", "AG"];
  // const authenStore = useSelector((state:any) => state.authenReducer.userAuthenData);

  // const coreLevels = [
  //   { LV: "LEVEL1", POSIT: "Operator, Operator.S,Leader 1-2, Leader.S" },
  //   {
  //     LV: "LEVEL2",
  //     POSIT: "Foreman 1-3,Technician 2-3,Technician.S,Staff 1-4, Leader.S",
  //   },
  //   { LV: "LEVEL3", POSIT: "Engineer 2-4,Engineer.S" },
  //   {
  //     LV: "LEVEL4",
  //     POSIT: "Supervisor 1-2, Supervisor.TeSupervisor.SF, Supervisor.EN",
  //   },
  //   { LV: "LEVEL5", POSIT: "Assistant Manager,Manager" },
  // ];

  const coreLevels = [
    { LV: "LEVEL1", POSIT_1: "Operator , Operator.S" , POSIT_2:"Leader 1-2 , Leader.S" },
    {
      LV: "LEVEL2",
      POSIT_1: "Foreman 1-3 , Staff 1-4",
      POSIT_2: "Technician 2-3 , Technician.S"
    },
    { LV: "LEVEL3", POSIT_1: "Engineer 2-4 , Engineer.S" },
    {
      LV: "LEVEL4",
      POSIT_1 : "Supervisor LV 1-2",
      POSIT_2 : "Supervisor.Tecnichain",
      POSIT_3 : "Supervisor.Staff",
      POSIT_4 : "Supervisor.Engineer"
    },
    { LV: "LEVEL5", POSIT_1: "Assistant Manager , Manager" },
  ];
  const POSITION: string = position;

  useEffect(() => {
    if (POSITION == "SS") {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 0,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: "",
        },
      });
    } else if (POSITION == "MG") {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 1,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: "",
        },
      });
    } else {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 2,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: "",
        },
      });
    }

    //const position:String = JSON.parse(user_info)[0].Position

    if (corePositionLevel4.includes(position)) {
      setstatusCoreLevel("LV4");
    } else if (corePositionLevel5_MG.includes(position)) {
      setstatusCoreLevel("LV5_MG");
    } else if (corePositionLevel5_GM.includes(position)) {
      setstatusCoreLevel("LV5_GM");
    }
  }, []);

  //const user_info:any = Cookies.get("user_info")
  //const code:string = JSON.parse(user_info)[0].EmpCode
  //const name:string = JSON.parse(user_info)[0].ShortName

  const selectCore = (coreLevel: string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload: { ...trackingStep, trackingLevel: coreLevel },
    });

    navigate(
      `/backend/core-assessment/${trackingStep.trackingDept}/${trackingStep.trackingSection}/${trackingStep.trackingGroup}/${coreLevel}`
    );
  };

  return (
    <>
     
      {statusCoreLevel == "LV4" ? (
        <>
          <Box
            sx={{
              "& button": { p: 4, m: 5 },
              overflow: "hidden",
              overflowY: "hidden",
            }}
          >
          
            <Grid container spacing={5}>
              {coreLevels.slice(0, 3).map((core, index) => (
                <Grid item xs={4} key={index}>
                  <Button
                    variant="contained"
                    startIcon={ index == 0 ? <LooksOneIcon sx={button_coreLevel} /> : 
                    (index == 1 ? <LooksTwoRoundedIcon sx={button_coreLevel} /> : <Looks3RoundedIcon sx={button_coreLevel}/>)}
                    sx={{
                      width: "80%",
                      height: "60%",
                      borderRadius: 5,
                      background: "tomato"
                      
                    }}
                    onClick={() =>
                      selectCore(core.LV.slice(core.LV.length - 1))
                    }
                  >
                    <Typography variant="body1">
                      {core.POSIT_1} <br /> {core.POSIT_2}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : statusCoreLevel == "LV5_MG" ? (
        <>
          {" "}
          <Box
            sx={{
              "& button": { p: 4, m: 5 },
              overflow: "hidden",
              overflowY: "hidden",
            }}
          >
            <Grid container spacing={5}>
              {coreLevels.slice(3, 4).map((core, index) => (
                // `../assets/img/supplier/${driverCard.driverPicture}`
                <Grid item xs={4} key={index}>
                  <Button
                    variant="contained"
                    startIcon={<Looks4RoundedIcon sx={button_coreLevel}/>}
                    sx={{
                      width: "70%",
                      height: "50%",
                      borderRadius: 5,
                      background: "tomato",
                    }}
                    onClick={() =>
                      selectCore(core.LV.slice(core.LV.length - 1))
                    }
                  >
                    <Typography variant="body1">
                      {core.POSIT_1} <br /> {core.POSIT_2} <br /> {core.POSIT_3} <br />{core.POSIT_4}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <>
          {" "}
          <Box
            sx={{
              "& button": { p: 4, m: 3 },
              overflow: "hidden",
              overflowY: "hidden",
            }}
          >
            <Grid container spacing={2}>
              {coreLevels.slice(4, 5).map((core, index) => (
                // `../assets/img/supplier/${driverCard.driverPicture}`
                <Grid item xs={4} key={index}>
                  <Button
                    variant="contained"
                    sx={{
                      width: "80%",
                      height: "50%",
                      borderRadius: 5,
                      background: "tomato",
                    }}
                    startIcon={<Looks5RoundedIcon sx={button_coreLevel} />}
                    onClick={() =>
                      selectCore(core.LV.slice(core.LV.length - 1))
                    }
                  >
                    <Typography variant="body1">
                     {core.POSIT_1}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}

const button_coreLevel = {
  height:100,
  width:100
}

export default CoreAssessment_selectCore;
