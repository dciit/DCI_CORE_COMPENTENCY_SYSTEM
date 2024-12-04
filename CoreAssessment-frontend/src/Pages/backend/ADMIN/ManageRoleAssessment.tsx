import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  getDept,
  getOrganizationChart,
} from "../../../service/admin";
import {
  OrgChartDept,
  OrgChartGroup,
} from "../../../Model/Admin/orgChart";
// import { sect } from "../../../constant/authen";
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import OrganizationalChart from "react-organizational-chart";

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid gray;
`;

function ManageRoleAssessment() {
  const [Dept, setDept] = useState<string[]>([]);
  const [LineSelected, setLineSelected] = useState<number>(0);
  const [groupList, setgroupList] = useState<OrgChartDept[]>([]);
  // const [isDept, setIsDept] = useState<String>("");

  useEffect(() => {
    initData();
    selectedDept("ADMINISTRATION");


  }, []);

  async function initData() {
    let tempDept: any = await getDept();
    setDept(tempDept);
  }

  const selectedDept = async (item: string) => {
    // setIsDept(item);
    let oGroup: any = await getOrganizationChart(item);
    setgroupList(oGroup);
    console.log(oGroup)
  };
  return (
    <>
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
      </div>

      <div className="flex flex-col justify-start w-full h-full mt-10 ">

                {groupList.map((dept: any) => (
                 <>
                    <div className={`max-w-[100%] max-h-full mb-6 mt-[20px] scale-[0.8]}`}>
                    <Tree
                      lineWidth={"2px"}
                      lineColor={"black"}
                      lineBorderRadius={"2px"}
                      label={
                        <StyledNode className="bg-green-300 text-black ">
                          <div className="p-4">
                            <p className="text-xl">{dept.dept_name}</p>
                     
                          </div>
                        </StyledNode>
                      }
                    >
                      {dept.dept_persons.map((person: any) => (
                        
                        <TreeNode
                        label={
                          <StyledNode className="bg-amber-300 text-black">
                            <div className="p-4">
                              <p className="text-md">{person.dept_person.split("-")[0]}</p>
                              <p className="text-md">({person.dept_person.split("-")[1]} {person.dept_person.split("-")[2]})</p>
                             
                            </div>
                          </StyledNode>
                        }
                      >
                      {person.sections.map((section: any) => (
                        <TreeNode
                          label={
                            <StyledNode className="bg-blue-300 text-black">
                              <div className="p-4">
                                <p className="text-md">{section.sect_name}</p>
                                <p className="text-[12px]">
                                  {section.sect_person.split("-")[0]}
                                </p>
                                <p className="text-[12px]">
                                  ({section.sect_person.split("-")[1]}{" "}
                                  {section.sect_person.split("-")[2]})
                                </p>
                              </div>
                            </StyledNode>
                          }
                        >
                          {section.grps?.length > 0 &&
                            section.grps.map((grp: OrgChartGroup) => (
                              <TreeNode
                                label={
                                  <StyledNode className="bg-sky-300 text-black">
                                    <div className="p-4">
                                      <p className="text-[12px] font-bold">{grp.grp_name}</p>
                                      {grp.grp_person != "" && (
                                        <>
                                          <p className="text-[12px]">
                                            {grp.grp_person?.split("-")[0]}
                                          </p>
                                          <p className="text-[12px]">
                                            ({grp.grp_person?.split("-")[1]}{" "}
                                            {grp.grp_person?.split("-")[2]})
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </StyledNode>
                                }
                              ></TreeNode>
                            ))}
                        </TreeNode>
                      ))}
                      </TreeNode>

                     

                      ))}
               
                    </Tree>
                    </div>
                        
                </>

                ))}
      
         
     
        
      </div>
    </>
  );
}

export default ManageRoleAssessment;
