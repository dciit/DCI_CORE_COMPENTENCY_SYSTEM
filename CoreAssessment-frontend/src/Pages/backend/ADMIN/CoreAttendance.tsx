import { useEffect, useState } from "react";
import { getDept, getGrpBySections, getSectionByDept } from "../../../service/admin";
import { IGroup, IEmployee } from "../../../Model/Admin/employeeAttendance";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";

function CoreAttendance() {
  const [Dept, setDept] = useState<string[]>([]);
  const [section, setsection] = useState<string[]>([]);
  const [DeptSelected, setDeptSelected] = useState<number>(0);
  const [SectSelected, setSectSelected] = useState<number>(0);
  const [loadAPI, setloadAPI] = useState<Boolean>(true);

  const [groupList, setgroupList] = useState<IGroup[]>([]);

  useEffect(() => {
    initData();
    selectedDept("ADMINISTRATION")
    selectedSection("HUMAN RESOURCES MANAGEMENT")
  }, []);

  async function initData() {
    let tempDept: any = await getDept();
    setDept(tempDept);
  }

  const selectedDept = async (dept:string) => {
    let oSection: any = await getSectionByDept(dept);
    setsection(oSection);
    selectedSection(oSection[0]);
   
  };

  const selectedSection = async (section: string) => {
    setloadAPI(true);
    let oGrp: any = await getGrpBySections(section);
    setgroupList(oGrp);
    setloadAPI(false);
  };

  const selectedDeptIndex = (index: number) => {
    setDeptSelected(index);
    setSectSelected(0);

   
  };


  return (
    <>
    <div className="flex flex-col gap-5 h-screen w-full">
      <div className="w-full flex-none items-center gap-2 bg-white border  rounded-lg select-none p-2">
        <div className="text-sm font-medium text-center text-gray-500">
          <ul className="flex flex-wrap -mb-px cursor-pointer">
            {Dept.map((item: string, i: number) => (
              <div className="" onClick={() => selectedDeptIndex(i)}>
                <li>
                  <a className="inline-block p-2 border-b-2 border-transparent rounded-t-lg ">
                    <div
                      key={i}
                      onClick={() => selectedDept(item)}
                      className={`px-4 py-3 min-w-[75px] text-center ${
                        DeptSelected == i
                          ? "x-4 py-3 text-white bg-blue-600 rounded-lg hover:text-white"
                          : "text-gray-500"
                      } hover:text-blue-500 transition-all duration-[300] text-[16px]`}
                    >
                      {item}
                    </div>
           
                  </a>
                </li>
              </div>
            ))}
          </ul>
        </div>
        </div>



        <div className="flex-none items-center gap-2 bg-white border  rounded-lg select-none p-2">

            <ul className="flex flex-wrap -mb-px cursor-pointer">
              {section.map((item: string, j: number) => (
                <div className="" onClick={() => setSectSelected(j)}>
                  <li>
                    <a className="inline-block p-2 border-b-2 border-transparent rounded-t-lg ">
                      <div
                        key={j}
                        onClick={() => selectedSection(item)}
                        className={`px-4 py-3 min-w-[75px] text-center ${
                          SectSelected == j
                            ? "x-4 py-3 text-white bg-yellow-500 rounded-lg hover:text-white"
                            : "text-gray-500"
                        } hover:text-blue-500 transition-all duration-[300] text-[16px]`}
                      >
                        {item}
                      </div>
            
                    </a>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        
        {loadAPI ? (
                     <div className="flex flex-col justify-center items-center h-screen"> 
                             <div> <CircularProgress size={50}/></div>
                             <div> <p className="text-2xl"> กําลังโหลด ....</p></div>
                              
                             
                             </div>
                    ) : (
                      <>
                           {groupList.length > 0 ? (
                      <div className="flex-none items-center gap-2 bg-white border  rounded-lg select-none p-6 ">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* {groupList
                          .filter(
                            (item: any) =>
                              item.totalEmployee > 0 && item.grp_name.trim() != "TRANSLATOR"
                          ) */}
                          
                           {groupList      
                          .map((item: IGroup) => (
                            <>
                              <div>
                                <div className="border  border-gray-300 w-full p-2 bg-red-200">
                                  <div className="flex flex-row justify-start gap-2">
                                  <div>
                                    <span className="relative flex h-4 w-4 mt-[10px]">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-700"></span>
                                      </span>
                                    </div>
                                    <div>
                                      <h1 className="b text-xl p-1 ">
                                      {item.grp_cd}:{item.grp_name}
                                      </h1>
                                      
                                    </div>
            
                               
                                  </div>
                                </div>
            
                                <table className="tbAdminMain w-full bg-green-50">
                                  <tr className="text-md">
                                    <th>จำนวนพนักงานในหน่วยงาน</th>
                                    <th>จำนวนคนที่ประเมินแล้ว</th>
                                  </tr>
                                  <tbody>
                                    <tr className="text-center text-lg">
                                      <>
                                        <td className="w-[55.1%]">{item.totalEmployee}</td>
                                        <td>{item.resultEmployeeAssessment}</td>
                                      </>
                                    </tr>
                                  </tbody>
                                </table>
                                <table className="tbAdminMain w-full text-sm bg-gray-50">
                                  <tr>
                                    <th>ลำดับ</th>
                                    <th>รหัส</th>
                                    <th>ชื่อ-นามสกุล</th>
                                    <th>ตำแหน่ง</th>
                                    <th>อายุงาน</th>
                                    <th>สถานะ</th>
                                  </tr>
                                  <tbody>
                                    {typeof item.employees != "undefined" &&
                                      item.employees.map((emp: IEmployee, i: number) => (
                                        <>
                                          <tr>
                                            <td className="text-center p-1 w-[1%]">
                                              {i + 1}
                                            </td>
                                            <td className="text-left p-1 w-[1%]">
                                              {emp.code}
                                            </td>
                                            <td className="text-left p-1 w-[20%]">
                                              {emp.fname} {emp.lname}
                                            </td>
                                            <td className="text-left p-1 w-[1%]">
                                              {emp.position}
                                            </td>
                                            <td className="text-left p-1 w-[1%]">
                                            {dayjs(emp.joinDate).format("DD/MM/YYYY")}
                                            </td>
                                            <td
                                              className={` text-left p-1 w-[15%] ${
                                                emp.status == "ประเมินแล้ว"
                                                  ? "blinkColor-Approve bg-green-600 text-black"
                                                  : (emp.status == "รอการ Approve") ? "blinkColor-wait-Approve bg-orange-400 text-black" 
                                                  : (emp.status == "รอการ Confirm") ? " blinkColor-wait-Approve bg-yellow-400 text-black"
                                                  :'text-red-500'
                                              }`}
                                            >
                                              {emp.status}
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ))}
                      </div>
            
                      <br />
                      </div>
                        ) : (
                          <main className="grid place-items-start justify-center px-6 py-24 sm:py-32 lg:px-8 top-0 h-screen">
                          <div className="text-center">
                           
                            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Data not found</h1>
                            <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
                        
                          </div>
                        </main>
                        )}
                      
                      
                      </>
                     

                    )}

      </div>
    </>
  );
}

export default CoreAttendance;
