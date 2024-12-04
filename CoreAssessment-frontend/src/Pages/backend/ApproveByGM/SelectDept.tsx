import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton } from "@mui/material";
// import {position} from "../../../constant/authen.ts"

import { IGetDept } from "../../../Model/Approve/ApproveList";
import { useDispatch, useSelector } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";
import { getDept } from "../../../service/employeeList";

function SelectDept() {
  let navigate = useNavigate();
  const positionData = useSelector((state: any) => state.authenStateReducer.userAuthenData);
  const [Dept, setDept] = useState<IGetDept[]>([]);

  const approveTrackingStep = useSelector((state:any) => state.approveTrackingStateReducer.approveTrackingState);

  const dispatch = useDispatch();



  useEffect(() => {
    dispatch({
      type: "PREVIOUS_TRACKING_STEP",
      payload:{...approveTrackingStep,
        approveTrackingCount:0,
        approveTrackingDept: '',
        approveTrackingSection: '',
        approveTrackingGroup:'',
        approveTrackingEmpcode:''} 
    
     })
    getData();
  }, []);

  const getData = async () => {
    const result = await getDept(positionData.empcode,positionData.position_number);
    setDept(result);
  };
  const SelectDept = (dept:string) => {

    dispatch({
   
        type: "NEXT_TRACKING_STEP",
        payload:{...approveTrackingStep,approveTrackingDept:dept} 
      
       })
    navigate(`/CASAPP/backend/core-assessmentListApprove-gm/${dept}`);
  }
  return (
    <>
        <div className="flex flex-row justify-center mt-8">
          <table className="tbApprove w-[70%] ">
            <thead>
              <tr>
                <th>Dept</th>
                <th>Dept name</th>
                <th>จำนวนพนักงานที่ประเมินแล้ว</th>
                <th>พนักงานที่ผ่านการประเมินแล้ว</th>
              </tr>
            </thead>
            <tbody>
              {Dept.map((row, index) => (
                <tr className={index % 2 === 0 ? "bg-blue-100" : "bg-white"} key={index}>
                  <td className="w-[5%]">{row.dept_cd}</td>
                  <td className="w-[25%]">{row.dept_name}</td>
                  <td className="w-[10%]"> {row.total_Employee_is_assessment}/{row.total_Employee} คน</td>
                  <td className="text-center w-[15%]">
                     
                      <IconButton aria-label="delete"  color="primary" onClick={()=>SelectDept(row.dept_cd)} className="hover:scale-105 transition-all duration-400 cursor-pointer select-none">
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

export default SelectDept;
