import { useEffect, useState } from "react";
import SrvCoreAssessment from "../../../service/coreAssessment.ts";
import { useSelector, useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export interface IDept {
  dept_name: string;
  dvcd: string;
}

function CoreAssessment_selectDept() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const trackingStep = useSelector(
    (state: any) => state.trackingStateReducer.trackingState
  );
  const [dept, setdept] = useState<IDept[]>([]);

  useEffect(() => {
    dispatch({
      type: "PREVIOUS_TRACKING_STEP",
      payload: {
        ...trackingStep,
        trackingCount: 0,
        trackingDeptFirstStep: trackingStep.trackingDeptFirstStep,
        trackingDept: trackingStep.trackingDept,
        trackingSection: "",
      },
    });

    SrvCoreAssessment.getDept(trackingStep.trackingDeptFirstStep).then(
      (res) => {
        try {
          setdept(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, []);

  const selectSecetion = (dept: string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload: {
        ...trackingStep,
        trackingDeptFirstStep: trackingStep.trackingDeptFirstStep,
        trackingDept: dept,
      },
    });
    navigate(`/CASAPP/backend/core-assessment/${dept}`);
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
          {dept.map((depts) => (
            <div>

              <button
                className="w-[80%] h-[60%] md:w-[80%]  md:h-[60%] shadow-lg rounded-2xl bg-indigo-500 text-lg text-white hover:scale-105 transition-all duration-400 cursor-pointer select-none"
                onClick={() => selectSecetion(depts.dvcd)}
              >
                 ({depts.dvcd}) {depts.dept_name}
              </button>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
}

export default CoreAssessment_selectDept;
