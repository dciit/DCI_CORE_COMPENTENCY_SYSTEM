import { useState, useEffect } from "react";
import SrvCoreAssessment from "../../service/coreAssessment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {  CardMedia, Grid, Tooltip } from "@mui/material";
// import { SendRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import {
  CoreCompentencyTitle,
  AssessmentScore,
} from "../../Model/AssessmentEmployee/assessment";
import HelpIcon from "@mui/icons-material/Help";

export interface Employee {
  code: string;
  name: string;
  surn: string;
  dept: string;
  sect: string;
  posit: string;
  joinDate: Date;
}


export interface IndicatorDataTable {
  indicator_CourseName: string;
  indicator_CourseCode: CourseCodeDataTableDetail[];
  indicator_Category: IndicatorDataTableDetail[];
}

export interface CourseCodeDataTableDetail {
  courseCode: string;
  status: string;
}

export interface IndicatorDataTableDetail {
  indicator_Id: number;
  indicator_DetailCourseName: string;
  scroe: number;
  status: string;
}

export interface IndicatorSubRecord {
  indicatorDetail_Id: number;
  indicatorBy: string;
  empcode: any;
  scroce: number;
}

const columns = [
  {
    id: "Corecompentency",
    label: "Core Compentency",
    width: "13%",
  },
  {
    id: "Corecompentency_Detail",
    label: "คำอธิบายพฤติกรรม และตัวชี้วัดำฤติกรรม (Behavior Indicators)",
    width: "27%",
  },
  { id: "Corecompentency_Knowledge", label: "Knowledge", width: "25%" },
  { id: "Corecompentency_Skill", label: "Skill", width: "15%" },
];

const definition = [
  {
    title: "CC001",
    desc: "- ความเข้าใจนโยบาย มาตรการ กฎระเบียบ รวมถึงความมุ่งมั่นในการปฏิบัติตามระเบียบด้านความปลอดภัยและสิ่งแวดล้อม ความสามารถในการคาดการณ์ การวางแนวทางป้องกันความเสี่ยงหรืออุบัติเหตุ และแนวทางในการปฏิบัติและดูแลสิ่งแวดล้อมในองค์กร พร้อมทั้งการให้คำแนะนำและพูดจูงใจผู้อื่นให้เห็นถึงความสำคัญของระเบียบด้านความปลอดภัยและสิ่งแวดล้อม",
  },
  {
    title: "CC002",
    desc: "- ความเข้าใจและยอมรับการเปลี่ยนแปลงต่างๆ ที่เกิดขึ้นในองค์กร การให้ความร่วมมือและปรับตัวได้เหมาะสมกับสถานการณ์ทั้งภายในและภายนอกพร้อมทั้งกระตุ้นและส่งเสริมให้ผู้อื่นเข้าใจและสามารถปรับตัวได้อย่างเหมาะสม",
  },
  {
    title: "CC003",
    desc: "- การรับรู้ และความเข้าใจในระบบการผลิตแบบ DAIKIN หรือที่เรียกว่า Production of Daikin System รวมทั้งปฏิบัติตามขั้นตอนการทำงานต่างๆ ด้วยความถูกต้อง แม่นยำ",
  },
  {
    title: "CC004",
    desc: "- ความเข้าใจถึงนโยบาย มาตรการ กฎระเบียบปฏิบัติ  และความมุ่งมั่นในการปฏิบัติตามวิธีการที่กำหนดไว้ ความสามารถในการตรวจพบสิ่งผิดปกติ รวมทั้งการหาแนวทางแก้ไข ป้องกันไม่ให้เกิดซ้ำ",
  },
  {
    title: "CC005",
    desc: "- ความเข้าใจขั้นตอนวิธีการทำงาน และการคิดออกแบบวิธีการทำงานและพัฒนาเครื่องมือใหม่ๆ ในการปรับปรุงคุณภาพการทำงาน และหาวิธีกระตุ้นจูงใจให้ผู้อื่นเห็นด้วยและปฏิบัติตามขั้นตอนการทำงานใหม่ๆ รวมถึงการเข้าใจกิจกรรมต่างๆ ที่นำมาใช้ในการสนับสนุน เช่นInnovation,TEI-AN,KAI-ZEN",
  },
];


function DisplayEmployee() {
  const DashboardPageStore = useSelector((state: any) => state.scoreEmployeeStateReducer.DashboardEmployeePage);
  const [employee, setemployee] = useState<Employee>();
  const [AssessmentCore, setAssessmentCore] = useState<CoreCompentencyTitle[]>([]);
  // const positionData = useSelector( (state: any) => state.authenStateReducer.userAuthenData);

  const [saveAssessmentSub, setsaveAssessmentSub] = useState<AssessmentScore[]>([]);

  useEffect(() => {
    console.log(DashboardPageStore)
    SrvCoreAssessment.getEmployeeForIndicator(DashboardPageStore.empcode).then((res:any) => {
      try {
        setemployee(res.data);
      } catch (error) {
        console.log(error);
      }
    });


      SrvCoreAssessment.getNewIndicator(
        DashboardPageStore.level,
        DashboardPageStore.empcode,
      ).then((res:any) => {
        try {
          setAssessmentCore(res.data);
          console.log(res.data)
        }
        catch (error) {
          console.log(error);
        }
      });


      SrvCoreAssessment.editSelectAssessment(DashboardPageStore.year,DashboardPageStore.empcode).then((res:any) => {
        try {
          let _temp: AssessmentScore[] = [];
          res.data.map((item: AssessmentScore) => {
            
            _temp.push({
              cD_Rev:item.cD_Rev,
              cD_Name: item.cD_Name,
              cD_EmpCode:DashboardPageStore.empcode,
              cD_ExpectedScore: item.cD_ExpectedScore,
              cD_ActualScore: item.cD_ActualScore,
              cD_Gap: item.cD_Gap,
              cD_Comment:item.cD_Comment,
              cD_Assessor:item.cD_Assessor
            });
          });
  
          
   
  
          setsaveAssessmentSub(_temp);
        } catch (error) {
          console.log(error);
        }
      });
    
   
  }, []);

  return (
    <>    
    <h1 className="text-center mb-10 mt-4 text-4xl">แบบประเมินความสามารถและวางแผนพัฒนาพนักงานรายบุคคล (Compentency Assessment Form)</h1>
      <div className="flex justify-between ">
        <div className="flex flex-col md:flex-row bg-teal-600 rounded-lg md:w-1/2 w-1/2 m-2 gap-5">
          <div className="flex justify-center md:1/7 ">
            <CardMedia
              component="img"
              sx={{ width: 150, height: 170, borderRadius: "10%", padding: 1 }}
              image={`http://dcidmc.dci.daikin.co.jp/PICTURE/${DashboardPageStore.empcode}.JPG`}
            />
          </div>

          <div className="md:p-0 md:w-1/2 p-4 mt-3 ">
            <Typography
              component="div"
              sx={{ color: "white", fontSize: "20px" }}
            >
              ผู้รับการประเมิน
            </Typography>
            <Typography
              color="text.secondary"
              component="div"
              sx={{ color: "white", fontSize: "16px" }}
            >
              <Box fontWeight="bold" display="inline">
                รหัสพนักงาน :
              </Box>{" "}
              {employee?.code}
            </Typography>
            <Typography
              color="text.secondary"
              component="div"
              sx={{ color: "white", fontSize: "16px" }}
            >
              <Box fontWeight="bold" display="inline">
                ชื่อ-นามสกุล :
              </Box>{" "}
              {employee?.name} {employee?.surn}
            </Typography>
            <Typography
              color="text.secondary"
              component="div"
              sx={{ color: "white", fontSize: "16px" }}
            >
              <Box fontWeight="bold" display="inline">
                ตำแหน่ง :
              </Box>{" "}
              {employee?.posit}
            </Typography>
            <Typography
              color="text.secondary"
              component="div"
              sx={{ color: "white", fontSize: "16px" }}
            >
              <Box fontWeight="bold" display="inline">
                หน่วยงาน :
              </Box>{" "}
              {employee?.sect}
            </Typography>
            <Typography
              color="text.secondary"
              component="div"
              sx={{ color: "white", fontSize: "16px" }}
            >
              <Box fontWeight="bold" display="inline">
                วันที่เข้าทำงาน :
              </Box>{" "}
              {dayjs(employee?.joinDate).format("DD/MM/YYYY")}
            </Typography>
          </div>
        </div>

        <div className="flex flex-col md:flex-row  w-1/2 rounded-lg m-2 gap-2 bg-[#CACFD2] p-4">
          <div>
            <Box sx={{ fontWeight: "bold", fontSize: "20px", width: "100px" }}>
              คำชี้แจง{" "}
            </Box>
          </div>

          <div>
            <Box sx={{ fontSize: "16px" }}>
              1.
              กรุณาประเมินตามความเป็นจริงตามพฤติกรรมที่คาดหวังในระดับขั้นสามารถที่ตรงกับตำแหน่ง{" "}
              <br />
              2. ผลการประเมินของพนักงานที่มีช่องว่างความสามารถ (Gap)
              จะนำไปใช้ในการวางแผนพัฒนาบุคคลต่อไป <br />
              3. กรุณาแสดงความคิดเห็น หรือระบุพฤติกรรมที่เห็นชัดเจน
              ในกรณีที่ท่านประเมินสูง หรือต่ำกว่าความคาดหวัง (Expected)
              เพื่อนำข้อมูลไปใช้ในการวางแผนพัฒนาให้ตรงกับสภาพความเป็นจริงมากที่สุด
            </Box>
          </div>
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "auto", mt: 2 ,mb:2}}>
        <TableContainer sx={{ maxHeight: "auto" }}>
          <Table className="tbMain" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    rowSpan={2}
                    key={index}
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      width: column.width,
                    }}
                    // colSpan={column.label == "Knowledge" ? 4 :}
                  >
                    {column.label}
                  </TableCell>
                ))}

                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                  colSpan={4}
                >
                  การประเมิน
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    width: "5%",
                    textAlign: "center",
                    padding: "12px 0px",
                  }}
                >
                  Expected
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    width: "4%",
                    textAlign: "center",
                    padding: "12px 0px",
                  }}
                >
                  Actual
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    width: "4%",
                    textAlign: "center",
                    padding: "12px 0px",
                  }}
                >
                  Gap
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    width: "20%",
                    textAlign: "center",
                    padding: "12px 0px",
                  }}
                >

                  Comment
                </TableCell>
              </TableRow>
            </TableHead>

            {AssessmentCore.map((item, i) => {
              return (
                <>
                  <TableBody>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        alignItems: "start",
                        alignContent: "start",
                      }}
                    >
                      <p className="text-[14px]">
                        {item.cc_name} <br /> {item.cc_desc} <br />
                      </p>
                      <div className="text-sm m-[-2px] pl-2 bg-gray-300 rounded-lg w-[125px] h-6 mt-2 text-left">
                        <Tooltip
                          title={
                            definition.filter((x) => x.title == x.title)[i]
                              ?.desc
                          }
                          placement="top-start"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "common.black",
                                "& .MuiTooltip-arrow": {
                                  color: "common.black",
                                },
                                fontSize: 14,
                              },
                            },
                          }}
                        >
                          <p style={{ cursor: "pointer" }}>
                            คำจำกัดความ <HelpIcon />
                          </p>
                        </Tooltip>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 12,
                        alignItems: "start",
                        alignContent: "start",
                      }}
                    >
                      <p className="font-bold text-[13px]">{item.cc_title}</p>
                      {item.cc_Behavior.map((bb_item, i) => (
                        <p>
                          {i + 1}. {bb_item.sub_name}
                        </p>
                      ))}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 12,
                        alignItems: "start",
                        alignContent: "start",
                      }}
                    >
                      {item.cc_knowledge.map((knowledge_item, i) => (
                        <p className="font-md">
                          {i + 1}. {knowledge_item.kl_name}
                          <p
                            className={
                              knowledge_item.kl_status == "FAIL"
                                ? "inline text-red-500"
                                : "inline text-green-600"
                            }
                          >
                            (
                            {knowledge_item.kl_status == "FAIL"
                              ? "ไม่ผ่าน"
                              : "ผ่าน"}
                            )
                          </p>
                        </p>
                      ))}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 12,
                        alignItems: "start",
                        alignContent: "start",
                      }}
                    >
                      {item.cc_skill.map((skill_item, i) => (
                        <p style={{ fontSize: 12 }}>
                          {i + 1}. {skill_item}
                        </p>
                      ))}
                    </TableCell>

                    <TableCell sx={{ fontSize: 16 }}>
                      <Grid container justifyContent="center">
                        <input
                          type="text"
                          maxLength={1}
                          // value={calScoreExpected[i].expectedScore}
                          value={AssessmentCore[i].cc_knowledge.length}
                          className="w-14 text-center border border-black bg-[#c1ffff] text-xl"
                        
                          readOnly
                        />
                      </Grid>
                    </TableCell>

                    <TableCell sx={{ fontSize: 16 }}>
                      <Grid container justifyContent="center">
                        <input
                          type="text"
                          // value={calScoreExpected[i].actualScore}
                          value={AssessmentCore[i].cc_knowledge.filter((x=>x.kl_status == "PASS")).length}
                          maxLength={1}
                          className="w-14 text-center border border-black bg-[#c1ffff] text-xl"
                       
                          readOnly
                        />
                      </Grid>
                    </TableCell>

                    <TableCell sx={{ fontSize: 16 }}>
                      <Grid container justifyContent="center" className={saveAssessmentSub[i].cD_Gap >= 0 ? "text-green-800 text-xl" : "text-red-500 text-xl"}>
                        {saveAssessmentSub[i].cD_Gap}
                      </Grid>
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignContent="flex-start"
                      >
                        <div className="w-22">
                          <div className="relative w-full min-w-[200px]">
                            <textarea
                              className="peer h-full min-h-[100px] w-full rounded-[7px] border border-black p-2 bg-[#faffb3] "
                              placeholder=" "
                              defaultValue={""}
                              value={saveAssessmentSub[i].cD_Comment}
                              readOnly
                              disabled
                            
                            
                            />
                            {/* <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                              Message
                            </label> */}
                          </div>
                        </div>
                      </Grid>
                    </TableCell>
                  </TableBody>
                </>
              );
            })}
          </Table>
        </TableContainer>
      </Paper>


    
    
    </>
  )
}

export default DisplayEmployee