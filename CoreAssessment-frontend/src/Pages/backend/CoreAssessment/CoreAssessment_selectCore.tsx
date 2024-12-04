import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { position } from "../../../constant/authen.ts";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoRoundedIcon from "@mui/icons-material/LooksTwoRounded";
import Looks3RoundedIcon from "@mui/icons-material/Looks3Rounded";
import Looks4RoundedIcon from "@mui/icons-material/Looks4Rounded";
import Looks5RoundedIcon from "@mui/icons-material/Looks5Rounded";
import coreAssessment from "../../../service/coreAssessment.ts";
import Cookies from "js-cookie";

function CoreAssessment_selectCore() {
  const trackingStep = useSelector(
    (state: any) => state.trackingStateReducer.trackingState
  );
  const dispatch = useDispatch();
  let navigate = useNavigate();

  // const [statusCoreLevel, setstatusCoreLevel] = useState<string>("");
  const [arrycoreLevel, setarrycoreLevel] = useState<number[]>([]);
  const corePositionLevel4: string[] = ["SE", "SS", "ST", "SU"];
  const corePositionLevel5_MG: string[] = ["MG", "AM"];
  // const corePositionLevel5_GM: string[] = ["GM", "SGM", "AG"];
  const positionData = useSelector( (state: any) => state.authenStateReducer.userAuthenData);

  const coreLevels = [
    {
      LV: "LEVEL1",
      POSIT_1: "Operator , Operator.S",
      POSIT_2: "Leader, Leader.S",
      icon: <LooksOneIcon sx={button_coreLevel} />,
    },
    {
      LV: "LEVEL2",
      POSIT_1: "Foreman , Staff",
      POSIT_2: "Technician , Technician.S",
      icon: <LooksTwoRoundedIcon sx={button_coreLevel} />,
    },
    {
      LV: "LEVEL3",
      POSIT_1: "Engineer , Engineer.S",
      icon: <Looks3RoundedIcon sx={button_coreLevel} />,
    },
    {
      LV: "LEVEL4",
      POSIT_1: "Supervisor",
      POSIT_2: "Supervisor.Tecnichain",
      POSIT_3: "Supervisor.Staff",
      POSIT_4: "Supervisor.Engineer",
      icon: <Looks4RoundedIcon sx={button_coreLevel} />,
    },
    {
      LV: "LEVEL5",
      POSIT_1: "Assistant Manager , Manager",
      icon: <Looks5RoundedIcon sx={button_coreLevel} />,
    },
  ];
  const user_info: any = Cookies.get("user_info");
  const POSITION: string = user_info ? JSON.parse(user_info)[0].Position : "";
  // const POSITION: string = position;

  useEffect(() => {
    getCoreLevel(trackingStep.trackingGroup, POSITION);

    if (corePositionLevel4.includes(POSITION)) {
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
    } else if (corePositionLevel5_MG.includes(POSITION)) {
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
          trackingCount: 3,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: "",
        },
      });
    }

    // if (corePositionLevel4.includes(position)) {
    //   setstatusCoreLevel("LV4");
    // } else if (corePositionLevel5_MG.includes(position)) {
    //   setstatusCoreLevel("LV5_MG");
    // } else if (corePositionLevel5_GM.includes(position)) {
    //   setstatusCoreLevel("LV5_GM");
    // }
  }, []);

  async function getCoreLevel(dvcd: string, posit: string) {
    const res: any = await coreAssessment.getCoreLevel(positionData.empcode,dvcd, posit);
    try {
      setarrycoreLevel(res);

      //   res[0] == 1  ? <LooksOneIcon sx={button_coreLevel} /> :
      //   (arrycoreLevel[index]  == 1 ? <LooksTwoRoundedIcon sx={button_coreLevel} /> :
      //   ( arrycoreLevel[index]  == 2 ? <Looks3RoundedIcon sx={button_coreLevel}/> :
      //   ( arrycoreLevel[index]  == 3 ? <Looks4RoundedIcon sx={button_coreLevel}/> :
      //  <Looks5RoundedIcon sx={button_coreLevel}/>)))

      // setfirstIndex(res[0]) // 2
      // setlastIndex(res.length == 1 ? res.length + 2 : res.length + 1) //3
    } catch (error) {
      console.log(error);
    }
  }
  const selectCore = (coreLevel: string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload: { ...trackingStep, trackingLevel: coreLevel },
    });

    navigate(
      `/CASAPP/backend/core-assessment/${trackingStep.trackingDept}/${trackingStep.trackingSection}/${trackingStep.trackingGroup}/${coreLevel}`
    );
  };

  return (
    <>
      <Box
        sx={{
          "& button": { p: 2, m: 3 },
          overflow: "hidden",
          overflowY: "hidden",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-4">

          {coreLevels.map(
            (core, index) =>
              arrycoreLevel.includes(index) && (
                <div>
                  <button className="w-[80%] h-[60%] shadow-lg rounded-2xl bg-indigo-500 text-lg text-white hover:scale-105    transition-all duration-400 cursor-pointer select-none py-2 px-4  inline-flex items-center"
                   onClick={() =>
                    selectCore(core.LV.slice(core.LV.length - 1))
                  }>
                    {core?.icon}
                    <div className="text-start">
                      <span>{core.POSIT_1}</span> {core.POSIT_2} {core.POSIT_3}{" "}
                      <br /> {core.POSIT_4} <h1 />
                    </div>
                  </button>
                </div>
              )
          )}
        </div>
      </Box>
    </>
  );
}

const button_coreLevel = {
  height: 100,
  width: 100,
};

export default CoreAssessment_selectCore;
