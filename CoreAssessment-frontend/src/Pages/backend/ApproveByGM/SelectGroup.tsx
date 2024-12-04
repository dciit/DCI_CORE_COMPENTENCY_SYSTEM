import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Badge, IconButton } from "@mui/material";
// import {position} from "../../../constant/authen.ts"

import { IGetGroup } from "../../../Model/Approve/ApproveList";
import { getGrpBySection } from "../../../service/employeeList";
import { useDispatch, useSelector } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";

function SelectGroup() {
  let navigate = useNavigate();
  const positionData = useSelector((state: any) => state.authenStateReducer.userAuthenData);
  const [group, setgroup] = useState<IGetGroup[]>([]);
  const approveTrackingStep = useSelector((state:any) => state.approveTrackingStateReducer.approveTrackingState);

  const dispatch = useDispatch();



  useEffect(() => {
    dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload:{...approveTrackingStep,
          approveTrackingCount:2,
          approveTrackingSection: approveTrackingStep.approveTrackingSection,
          approveTrackingGroup:'',
          approveTrackingEmpcode:''} 
      
       })
    getData();
  }, []);

  const getData = async () => {
    const result = await getGrpBySection(positionData.empcode,approveTrackingStep.approveTrackingSection);
    setgroup(result);
  };
  const SelectGroup = (group:string) => {
    dispatch({
   
        type: "NEXT_TRACKING_STEP",
        payload:{...approveTrackingStep,approveTrackingGroup:group} 
      
       })
    navigate(`/CASAPP/backend/core-assessmentListApprove-gm/${approveTrackingStep.approveTrackingDept}/${approveTrackingStep.approveTrackingSection}/${group}`);
  }
  return (
    <> 
        <div className="flex flex-row justify-center mt-8">
          <table className="tbApprove w-[70%] ">
            <thead>
              <tr>
                <th>Group</th>
                <th>Group name</th>
                <th>พนักงานทั้งหมดในแผนก</th>
                <th>พนักงานที่ผ่านการประเมินแล้ว</th>
              </tr>
            </thead>
            <tbody>
              {group.map((row, index) => (
                <tr className={index % 2 === 0 ? "bg-blue-100" : "bg-white"} key={index}>
                  <td className="w-[5%]">{row.group_cd}</td>
                  <td className="w-[30%]">{row.group_name}</td>
                  <td className="w-[10%]"> {row.total_Employee_is_assessment}/{row.total_Employee} คน</td>
                  <td className="text-center w-[15%]">
                     
                      <IconButton aria-label="delete"  color="primary" onClick={()=>SelectGroup(row.group_cd)} className="hover:scale-105 transition-all duration-400 cursor-pointer select-none">
                            <Badge badgeContent={row.total_Employee_wait_assessment} color="error" >
                                <EmailIcon color="action" sx={{ fontSize: 60 }}  />
                            </Badge>              
                        </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </>
  );
}

export default SelectGroup;
