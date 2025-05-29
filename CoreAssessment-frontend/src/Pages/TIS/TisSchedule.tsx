import React, { useEffect } from "react";
import { getTisCalendar } from "../../service/Tis";
import { TISSchedule } from "../../Model/TIS/TIS";
import moment from "moment";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function TisSchedule() {
  const dispatch = useDispatch();
  const [data, setData] = React.useState<TISSchedule[]>([]);
  const [loadAPI,setloadAPI] = React.useState<boolean>(false);
  const [month] = React.useState<string[]>([
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",]);
  useEffect(() => {
    initCalendar();
  }, []);

  const initCalendar = async () => {
    setloadAPI(true);
    let tempDept: TISSchedule[] = await getTisCalendar();
    const position = tempDept.map((item,index) => dayjs(item.scen_date).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD") ? index : -1).filter((item) => item != -1)
    console.log(position)
    
    position.map((position) => {

      tempDept.unshift(tempDept[position])
      tempDept.splice(((position + 1)), 1);
    })

    // tempDept.unshift(tempDept[position])
    // tempDept.splice((position + 1), 1);
    setData(tempDept);
    setloadAPI(false);

    console.log(tempDept)
  
  };

  function isFirstWordNumber(str:any) {
    // Regular expression to match the first word in the string
    const regex = /^\s*(\d+)/;
  
    // Test if the first word is a number
    const match = str.match(regex);
  
    // If match is found, it means the first word is a number
    return match !== null;
  }

  const traineeSchedule = useSelector((state:any) => state.trainingScheduleStateReducer.trainingScheduleState);
  

  const openPageTraneeList = (stDate:string,enDate:string, courseCode:string | undefined)=>{
    dispatch({
      type: "VIEW_TRAINEE",
      payload:{...traineeSchedule,stDate:stDate,enDate:enDate,cc:courseCode } 
      
   })

    const url = `DailyTrainingSchedule/viewTrainee`;
    window.open(url, '_blank'); // Open a new window with URL parameters


  }

  return (
    <>
    
      <div className="flex flex-col justify-center items-center p-10 gap-6">
        <div className="text-5xl"> <p>ตารางการอบรมประจำเดือน {month[moment().month()]} {moment().year()}</p></div>
        {loadAPI ? <div className="flex flex-col gap-8 items-center justify-center align-middle mt-20"><CircularProgress size="5rem" />กำลังโหลดข้อมูล...</div> : (
        <div className="md:w-[80%]">  <table className="tbScheduleTIS w-full">
            <thead className="bg-[#D7F2FB] text-lg">

                  <th>วันที่เริ่มอบรม</th>
                  <th>เวลาอบรม</th>
                  <th>รหัสหลักสูตร</th>
                  <th>ชื่อหลักสูตร</th>
                  <th>สถานที่อบรม</th>
                  <th>ผู้จัดการอบรม</th>
                  <th >รายชื่อผู้เข้าอบรม</th>

          
            </thead>
            {data.map((item: TISSchedule,index:number) => (
                <>
                  <tr className={`${dayjs(item.scst_date).format("D") == dayjs().format("D") ? "bg-yellow-200" :  index % 2 == 0 ? "bg-gray-100" : "bg-white"}`}>
                    
                    <td >{dayjs(item.scst_date).format("DD/MM/YYYY")}</td>
                    <td className="text-left">{dayjs(item.scst_date).format("HH:mm")} - {dayjs(item.scen_date).format("HH:mm")}</td>
                    <td >{item.course_code}</td>
                    <td >{item.course_name}</td>
                    <td >{item.location}</td>
                    <td >{isFirstWordNumber(item.trainer) ? item.trainer?.split(":")[1] : item.trainer}</td>
                    <td className="text-center">
                    <button 
                              type="button" onClick={() => openPageTraneeList(dayjs(item.scst_date).format("YYYY-MM-DD"),
                                dayjs(item.scst_date).format("YYYY-MM-DD"),
                              item.course_code)} className="w-20 text-white bg-indigo-500 hover:bg-indigo-700 hover:scale-110 hover:-translate-y-1 transition-all duration-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5">
                              <Search />    
                                
                            </button>
                    </td>
          
                  
                  </tr>
                
                
                </>
            ))}
          
          </table></div>
        )}
      </div>
      
    </>
  );
}

export default TisSchedule;
