import { useEffect, useState } from "react";
import SrvCoreAssessment from "../../../service/coreAssessment.ts";
import { useSelector, useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export interface IGroup {
  dv_name: string;
  grp_cd: string;
}

function CoreAssessment_selectSetion() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  // const PositionGM:string[] = ["GM","SGM","AG"]
  const trackingStep = useSelector(
    (state: any) => state.trackingStateReducer.trackingState
  );
  const authenStep = useSelector(
    (state: any) => state.authenStateReducer.userAuthenData.empcode
  );
  const [section, setsection] = useState<IGroup[]>([]);

  useEffect(() => {
    dispatch({
      type: "PREVIOUS_TRACKING_STEP",
      payload: {
        ...trackingStep,
        trackingCount: 1,
        trackingDeptFirstStep: trackingStep.trackingDeptFirstStep,
        trackingDept: trackingStep.trackingDept,
        trackingSection: "",
      },
    });

    // if(authenStep.position.includes(PositionGM)) {
    //   SrvCoreAssessment.getSection(trackingStep.trackingDept).then((res)=>{
    //     try{
    //         setsection(res.data)

    //     }catch(error){
    //       console.log(error)
    //     }
    //   })
    // }else{
    //   SrvCoreAssessment.getGroup(trackingStep.trackingDept).then((res)=>{
    //     try{
    //         setsection(res.data)

    //     }catch(error){
    //       console.log(error)
    //     }
    //   })
    // }

    SrvCoreAssessment.getSection(authenStep, trackingStep.trackingDept).then(
      (res) => {
        try {
          setsection(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, []);

  const selectSecetion = (section: string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload: { ...trackingStep, trackingSection: section },
    });
    navigate(
      `/CASAPP/backend/core-assessment/${trackingStep.trackingDept}/${section}`
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-4">
          {section.map((sections) => (
            <div>
              <button
                className="w-[80%] h-[60%] rounded-2xl bg-indigo-500 text-lg text-white hover:scale-105 transition-all duration-400 cursor-pointer select-none shadow-lg"
                onClick={() => selectSecetion(sections.grp_cd)}
              >
                 ({sections.grp_cd}) {sections.dv_name}
              </button>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
}

export default CoreAssessment_selectSetion;
