import { useEffect, useState } from "react";
import SrvCoreAssessment from "../../../service/coreAssessment.ts";
import { useSelector, useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
// import {position} from "../../../constant/authen.ts"
import Cookies from "js-cookie";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

export interface IGroup {
  dv_name: string;
  grp_cd: string;
}

function CoreAssessment_selectGroup() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const user_info: any = Cookies.get("user_info");
  const POSITION: string = user_info ? JSON.parse(user_info)[0].Position : "";

  // const PositionGM:string[] = ["GM","SGM","AG"]
  const trackingStep = useSelector(
    (state: any) => state.trackingStateReducer.trackingState
  );
  const authenEmpcode = useSelector((state:any) => state.authenStateReducer.userAuthenData.empcode);
  const [groups, setgroups] = useState<IGroup[]>([]);
  //const authenStore = useSelector((state:any) => state.authenReducer.userAuthenData);

  useEffect(() => {
    if (
      POSITION == "GM" ||
      POSITION == "SGM" ||
      POSITION == "AG" ||
      POSITION == "AGM" ||
      POSITION == "PD" ||
      POSITION == "DI"
    ) {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 2,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: "",
        },
      });
    } else {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 0,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: "",
        },
      });
    }

    SrvCoreAssessment.getGroup(authenEmpcode,trackingStep.trackingSection).then((res) => {
      try {
        setgroups(res.data);
      } catch (error) {
        console.log(error);
      }
    });
    // if(POSITION.includes(PositionGM)) {
    //   console.log("GM")
    //   SrvCoreAssessment.getSection(trackingStep.trackingDept).then((res)=>{
    //     try{
    //       setgroups(res.data)

    //     }catch(error){
    //       console.log(error)
    //     }
    //   })
    // }else{
    //   console.log("notGM")
    //   SrvCoreAssessment.getGroup(trackingStep.trackingDept).then((res)=>{
    //     try{
    //       setgroups(res.data)

    //     }catch(error){
    //       console.log(error)
    //     }
    //   })
    // }
  }, []);

  const selectGroup = (group: string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload: { ...trackingStep, trackingGroup: group },
    });
    navigate(
      `/CASAPP/backend/core-assessment/${trackingStep.trackingDept}/${trackingStep.trackingSection}/${group}`
    );
  };

  return (
    <>
      {groups.length > 0 ? (
        <>
          <Box
            sx={{
              "& button": { p: 2, m: 3 },
              overflow: "hidden",
              overflowY: "hidden",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-4">
              {groups.map((groups) => (
                <div>               
                  <button
                    className="w-[80%] h-[60%] shadow-lg rounded-2xl bg-indigo-500 text-lg text-white hover:scale-105 transition-all duration-400 cursor-pointer select-none"
                    onClick={() => selectGroup(groups.grp_cd)}
                  >
                     ({groups.grp_cd}) {groups.dv_name}
                  </button>
                </div>
              ))}
            </div>
          </Box>
        </>
      ) : (
        <>
          <div className="text-3xl text-center mt-10">
            <h1>
              <NoAccountsIcon sx={{ width: 200, height: 250 }} />
            </h1>
            <h1 className="">ไม่พบพนักงานใน Group นี้</h1>
          </div>
        </>
      )}
    </>
  );
}

export default CoreAssessment_selectGroup;
