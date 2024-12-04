import { useEffect, useState } from "react";
import { getDept, getSectionManager } from "../../../service/admin";
import { IGroup, IEmployee } from "../../../Model/Admin/employeeAttendance";
function CoreAttendanceLV5() {
  const [Dept, setDept] = useState<string[]>([]);
  const [LineSelected, setLineSelected] = useState<number>(0);
  const [groupList, setgroupList] = useState<IGroup[]>([]);

  useEffect(() => {
    initData();
    selectedDept("ADMINISTRATION")
  }, []);

  async function initData() {
    let tempDept: any = await getDept();
    setDept(tempDept);
  }

  const selectedDept = async (item: string) => {
    let oGroup: any = await getSectionManager(item);
    setgroupList(oGroup);
  };

  return (
    <>
      {/* <div className="w-full flex-none items-center gap-2 bg-white border  rounded-lg select-none cursor-pointer">
        <div
          id="select-line"
          className="flex gap-6 mb-6 h-[70px] bg-[#f9fafb] rounded-t-lg px-3  border-b"
        >
          {Dept.map((item: string, i: number) => (
            <div className="" onClick={() => setLineSelected(i)}>
              <div
                key={i}
                className={`px-4 py-3 min-w-[75px] text-center ${
                  LineSelected == i ? "text-blue-500" : "text-gray-500"
                } hover:text-blue-500 transition-all duration-[300] text-[16px]`}
              >
                {item}
              </div>
              <div
                className={`w-full border-b-2 transition-all duration-300 ${
                  LineSelected == i ? "border-blue-500" : "border-transparent"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div> */}
      <div className="w-full flex-none items-center gap-2 bg-white border  rounded-lg select-none ">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 bg-gray-50">
          <ul className="flex flex-wrap -mb-px cursor-pointer">
            {Dept.map((item: string, i: number) => (
              <div className="" onClick={() => setLineSelected(i)}>
                <li>
                  <a className="inline-block p-2 border-b-2 border-transparent rounded-t-lg ">
                    <div
                      key={i}
                      onClick={() => selectedDept(item)}
                      className={`px-4 py-3 min-w-[75px] text-center ${
                        LineSelected == i
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
        <div className="p-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {groupList
              .filter(
                (item: any) =>
                  item.totalEmployee > 0 && item.grp_name.trim() != "TRANSLATOR"
              )
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
                        <th>สถานะ</th>
                      </tr>
                      <tbody>
                        {typeof item.employees != "undefined" &&
                          item.employees.map((emp: IEmployee, i: number) => (
                            <>
                              <tr>
                                <td className="text-center p-1 w-[7%]">
                                  {i + 1}
                                </td>
                                <td className="text-left p-1 w-[11.5%]">
                                  {emp.code}
                                </td>
                                <td className="text-left p-1 w-[25%]">
                                  {emp.fname} {emp.lname}
                                </td>
                                <td className="text-left p-1 w-[10%]">
                                  {emp.position}
                                </td>
                                <td
                                  className={` text-left p-1 w-[25%] ${
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
      </div>
    </>
  );
}

export default CoreAttendanceLV5;
