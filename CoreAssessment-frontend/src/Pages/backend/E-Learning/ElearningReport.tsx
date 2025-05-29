import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  RadialLinearScale,
  Filler
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

import { Box, Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useEffect, useRef, useState } from "react";
import SrvElearning from "../../../service/elearningReport";
import { Bar, getElementAtEvent, Radar } from "react-chartjs-2";
// import { elearningModel } from "../../../Model/Elearning/Elearning";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PaidIcon from "@mui/icons-material/Paid";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups"; // import { ExportCSV } from "./Excel/ExportToCSV";
import SystemSecurityUpdateWarningIcon from "@mui/icons-material/SystemSecurityUpdateWarning";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
import ReportIcon from "@mui/icons-material/Report";
import ComplianceTrainningRecored from "../ComplianceReport/ComplianceTrainningRecored";
// import { useNavigate } from "react-router-dom";
// import { getDataAttendance } from "../../../service/ComplianceTrainingRecored";
import CCAttendanceTableReport from "../Modal/CC-MODAL/CCAttendanceTableReport";



ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  LineController,
  Filler
);

type elearningModel = {
  course_name?: string;
  course_name_th?: string;
  employeeIsLearing?: number;
  employeeIsLearingPercent?: number;
  totalEmployee?: number;
};
//@ts-ignore
type elearningModel2 = {
  dvcd_name?: string;
  course_name_th?: string;
  employeeIsLearing?: number;
  employeeIsLearingPercent?: number;
  totalEmployee?: number;
};

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};
//@ts-ignore
type SublabelChartsList = {
  grp_name: string[];
};

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});
//@ts-ignore
var randomColorGenerator = function () {
  return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
};




function ElearningReport() {
  // let isData: any;
  // const [master, setmaster] = useState<SublabelChartsList[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const [data, setdata] = useState<elearningModel[]>([]);
  const [tabData, setTabData] = useState<elearningModel[]>([]);
  const chartRef: any = useRef();

  // const [totalEmployeePercent, settotalEmployeePercent] = useState<number[]>([]);
  const [aryCC, setaryCC] = useState<string[]>([]);
  const [aryEmpLearning, setaryEmpLearning] = useState<number[]>([]);
  // section2
  const [dataArrayListSection2, setdataArrayListSection2] = useState<any>([]);
  const [aryEmpLearningSection2, setaryEmpLearningSection2] = useState<number[]>([]);
  const [aryCountEmpInSection,setaryCountEmpInSection] = useState<number[]>([]);
  // const [target, settarget] = useState<number[]>([]);
  //@ts-ignore
  const [titleTablTitle, settTablTitle] =
    useState<string>("CC001 Anti-Bribery");
  const [loadAPI, setloadAPI] = useState<Boolean>(true);
  const [loadAPI2, setloadAPI2] = useState<Boolean>(true);
  const [Tabvalue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [cc, setcc] = useState<string>("");
  //const [dept, setdept] = useState<string>("");

  const dispatch = useDispatch();

  const ccSection = useSelector(
    (state: any) => state.ccAttendanceRecordStateReducer.ccSectionState
  );

 
  const columns = useMemo<MRT_ColumnDef<elearningModel>[]>(
    () => [
      {
        accessorFn: (row) =>
          `${row.course_name}` + ":" + `(${row.course_name_th})`, //access nested data with dot notation
        header: "วิชา",
        size: 300,
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <span>{renderedCellValue?.split(":")[0]}</span> <br />
              <span>{renderedCellValue?.split(":")[1]}</span>
            </>
          );
        },
      },
      {
        accessorFn: (row) =>
          `100%` + " " + `(${row.totalEmployee?.toLocaleString()})`,
        header: "พนักงานทั้งหมด",
        size: 120,
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <span>{renderedCellValue?.split(" ")[0]}</span> <br />
              <span>{renderedCellValue?.split(" ")[1]}</span>
            </>
          );
        },
      },
      {
        accessorFn: (row) =>
          `${row.employeeIsLearingPercent}%` +
          " " +
          `(${row.employeeIsLearing?.toLocaleString()})`, //normal accessorKey
        header: "พนักงานสำเร็จอบรม",
        size: 200,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <>
              <span
                className={
                  renderedCellValue?.split(" ")[0].substring(0, 1) != "100" &&
                  renderedCellValue?.split(" ")[0].substring(0, 1) != "0"
                    ? "text-red-700"
                    : ""
                }
              >
                {showDisplay(
                  renderedCellValue,
                  row.index
                )}
              </span>
              <br />
              <span>
                {renderedCellValue?.split(" ")[0].substring(0, 1) != 0
                  ? renderedCellValue?.split(" ")[1]
                  : ""}
              </span>
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    fetchDataSection1();
    fetchDataSection2("CC001");
  }, []);

  async function fetchDataSection1() {
    // โหลด section1
    let aryTotalEmp: any = [];
    let aryCCTemp: any = [];
    let aryCCResult: any = [];
    let aryEmpLearningTemp: any = [];
    let aryEmpLearningPercentTemp: any = [];

    const res: any = await SrvElearning.getChartSection1();
    try {
      setdata(res.chartSection1);
      res.chartSection1.map((x: elearningModel) => {
        aryTotalEmp.push(100);
        aryCCTemp.push(x.course_name);
        aryCCTemp.push(x.course_name_th);
        aryCCResult.push(aryCCTemp);
        aryEmpLearningTemp.push(x.employeeIsLearing);
        aryEmpLearningPercentTemp.push(x.employeeIsLearingPercent);
        aryCCTemp = [];
      });

      // settotalEmployeePercent(aryTotalEmp);
      setaryCC(aryCCResult);
      setaryEmpLearning(aryEmpLearningPercentTemp);

      // โหลด section2

      let tabDataDisplay: elearningModel[] = Array.from(res.chartSection1);
      tabDataDisplay.push({
        course_name: "Summary Report",
        course_name_th: "สรุปรายงาน",
        employeeIsLearing: 0,
        employeeIsLearingPercent: 0,
        totalEmployee: 0,
      });
      setTabData(tabDataDisplay);

      setloadAPI(false);
      setloadAPI2(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataSection2(cc: string) {
    setloadAPI2(true);
    const res: any = await SrvElearning.getChartSection2(cc);
    try {
      // โหลด section2

      setLabels(res.labelChart.sect_name);
      setdataArrayListSection2(res.dataArrayListSection2);
      setLabels(res.labelChart);
      setdataArrayListSection2(res.dataChart);
      // settarget(res.target);
      setaryCountEmpInSection(res.countTotalEmployeeInSection)
      setaryEmpLearningSection2(res.countEmployeeIsLearing);
      setloadAPI2(false);
    } catch (error) {
      console.log(error);
    }
  }

  // const data_line_section1 = {
  //   labels: aryCC,
  //   datasets: [
  //     {
  //       label: "จำนวนพนักงานทั้งหมด (%)",
  //       data: totalEmployeePercent,
  //       backgroundColor: "#0FA6F1",
  //       // categoryPercentage:0.5
  //     },
  //     {
  //       label: "จำนวนคนที่ผ่านการอบรมครบ (%)",
  //       data: aryEmpLearning,
  //       backgroundColor: "#7DDA58",
  //     },
  //   ],
  // };

  const data_line_section1_Radar = {
    
    labels:aryCC,
    datasets: [{
      label: 'พนักงานสำเร็จการอบรม',
      data: aryEmpLearning,
      fill: true,
      // backgroundColor: 'green',
      // borderColor:'black',
      backgroundColor: "rgba(34, 202, 236, .2)",
      borderColor: "rgba(34, 202, 236, 1)",
      pointBackgroundColor: "rgba(34, 202, 236, 1)",
      poingBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(34, 202, 236, 1)",
    
     
      
  
    }], 
  };


  let delayed:boolean;
  // const option2: any = {
  //   // indexAxis:'y',
  //   // responsive: true,
  //   // interaction: {
  //   //   mode: "index" as const,
  //   //   intersect: true,
  //   // },

  //   scales: {
  //     x: { stacked: true,
  //       // min: 0,
  //       // max: 100,

  //       ticks: {
  //         callback: function (value: any) {
  //           return value + "%";
  //         },

  //       },
  //     },
  //     y: {
  //       stacked: true,

  //     },
  //   },
  //   animation: {
  //     onComplete: () => {
  //       delayed = true;
  //     },
  //     delay: (context:any) => {
  //       let delay = 0;
  //       if (context.type === 'data' && context.mode === 'default' && !delayed) {
  //         delay = context.dataIndex * 300 + context.datasetIndex * 300;
  //       }
  //       return delay;
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },

  //     tooltip: {
  //       callbacks: {
  //         title: (xDatapoint: any) => {
  //           return labels[xDatapoint.dataIndex];
  //         },
  //         label: (yDatapoint: any) => {
  //           let index: number = yDatapoint.dataIndex;
  //           let indexDataSet: number = yDatapoint.datasetIndex;
  //           let raw: string = yDatapoint.raw;
  //           return typeof master[index]?.grp_name[indexDataSet] != "undefined"
  //             ? `${master[index]?.grp_name[indexDataSet]} : ${raw}%`
  //             : null;
  //         },
  //       },
  //     },
  //   },
  // };

  // const BarChartDay: React.FC = () => {
  //   var dataset: any = [];
  //   {
  //     dataset.push(
  //       // {

  //       //   type: 'line' as const,
  //       //   label: "",
  //       //   borderColor: 'rgb(255, 99, 132)',
  //       //   borderWidth: 2,
  //       //   fill: false,
  //       //   data: labels.map(() => 25),
  //       // },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[0],
  //         backgroundColor: "cyan",

  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[1],
  //         backgroundColor: "blue",
  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[2],
  //         backgroundColor: "red",
  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[3],
  //         backgroundColor: "yellow",
  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[4],
  //         backgroundColor: "orange",
  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[5],
  //         backgroundColor: "pink",

  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[6],
  //         backgroundColor: "black",

  //       },
  //       {
  //         label: "",
  //         data: dataArrayListSection2[7],
  //         backgroundColor: "green",

  //       }
  //     );
  //   }

  //   isData = {
  //     labels,
  //     datasets: dataset,
  //   };
  //   return <Bar className="hover:cursor-pointer" data={isData} options={option2} ref={chartRef} onClick={(e) => attendanceEmployee(e)}></Bar>;
  // };

  // const topLabels = {

  //   id:'topLabels',
  //   afterDatasetDraw(chart:any, args:any, pluginOptions:any) {
  //     const { ctx,scales:{y} } = chart;
  //     alert("awdawd")
  //   }
  // }
  // const config:any = 


  const data_line_section2 = {
    labels: labels,
    datasets: [
      {
        label: titleTablTitle,
        data: dataArrayListSection2,
        backgroundColor:
          titleTablTitle == "CC001 Anti-Bribery" ? "#88A27C" : (
          titleTablTitle == "CC002 Trade Secret" ? "#DDA9A0" :(
          titleTablTitle == "CC003 PDPA" ? "#D6B55E" :(
          titleTablTitle == "CC004 Security Export" ? "#5B8DB8" : 
            "#9B8FBF"))),
        order: 2,
   
      },

      // {
      //   label: "Target 25 %",
      //   data: target,
      //   borderColor: "green",
      //   backgroundColor: "green",
      //   type: "line",

      //   pointRadius: 5 ,
      //   order: 1,
      //   datalabels: {
      //     display: false // Enable labels for this dataset
      // }
      // },
    ],
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  //@ts-ignore
  const attendanceEmployee = (event: any) => {
    
    dispatch({
      type: "KEEP_SECTION",
      payload: {
        ...ccSection,
        section: labels[getElementAtEvent(chartRef.current, event)[0].index],
      },
    });

    setOpenDialog(true);
    setcc(titleTablTitle.split(" ")[0]);
    //setdept(labels[getElementAtEvent(chartRef.current, event)[0].index]);
  };

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    // columnFilterDisplayMode: 'popover',
    // paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: "bottom",
    //@ts-ignore
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          variant="contained"
          sx={{ backgroundColor: "green" }}
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export CSV
        </Button>
      </Box>
    ),
  });

  // @ts-ignore
  const TabhandleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue == 0) {
      fetchDataSection2("CC001");
      settTablTitle("CC001 Anti-Bribery");
    } else if (newValue == 1) {
      fetchDataSection2("CC002");
      settTablTitle("CC002 Trade Secret");
    } else if (newValue == 2) {
      fetchDataSection2("CC003");
      settTablTitle("CC003 PDPA");
    } else if (newValue == 3) {
      fetchDataSection2("CC004");
      settTablTitle("CC004 Security Export");
    } else if (newValue == 4) {
      fetchDataSection2("CC005");
      settTablTitle("CC005 Whistle blowing");
    }
    else if (newValue == 5) {
      fetchDataSection2("CC006");
      settTablTitle("CC006 Antitrust");
    }
  };
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function showDisplay(textSplit: string, index: number) {
    let textNew = textSplit.split("% ");
    
    if (textNew[0] == "0" && index == 1) {
      return "Open jun 3, 24";
    } else if (textNew[0] == "0" && index == 2) {
      return "Open Aug 1, 24";
    } else if (textNew[0] == "0" && index == 3) {
      return "Open Oct 1, 24";
    } else if (textNew[0] == "0" && index == 4) {
      return "Open Dec 2, 24";
    } 
    else if (textNew[0] == "0" && index == 5) {
      return "Open Jul, 25";
    }
    else {
      return textNew[0] + "%";
    }
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Typography className="mt-5">{children}</Typography>
        )}
      </div>
    );
  }

  return (
    <>

     
      {loadAPI ? (
        <div
         className="flex flex-col justify-center items-center h-screen w-screen gap-5 bg-slate-300"
        > 
        <div> <CircularProgress size={100}/></div>
        <div> <p className="text-2xl"> กําลังโหลด ....</p></div>
         
        
        </div>
      ) : (
        <>
          <>
            <div className="bg-slate-300 text-center p-4">
            <p className="bg-slate-300 text-end text-sm">
                V.1.0.5
              </p>
              <p className="text-5xl w-full mb-4">
                หลักสูตรการปฏิบัติตามกฏระเบียบออนไลน์ (ComplianceCourse TrainingRecord)
              </p> 
             
            </div>

            <div className="flex md:flex-row flex-col justify-center divide-x divide-black border  border-black ">
              <div  className="w-full bg-yellow-50">
                {/* <Bar data={data_line_section1}   options={{
                              animation: {
                                onComplete: () => {
                                  delayed = true;
                                },
                                delay: (context) => {
                                  let delay = 0;
                                  if (
                                    context.type === "data" &&
                                    context.mode === "default" &&
                                    !delayed
                                  ) {
                                    delay =
                                      context.dataIndex * 500 +
                                      context.datasetIndex * 400;
                                  }
                                  return delay;
                                },
                              },
                             
                              scales: {
                                y: { 
                                  ticks:{
                                    padding:20,
                                    
                                  }
                                },
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                datalabels: {
                                  anchor: "end",
                                  align: "end",
                                    color: "black",
                                    //@ts-ignore
                                  formatter: function (value,context) {
                                    const dataIndex = context.dataIndex;
                                    const result = context.dataset.data[dataIndex];
                                     
                                      return  result + "%" ;
                                    
                                  },
                                  font: {
                                    weight: "bold",
                                    size: 12,
                                  },
                                },
                                legend: {
                                  position: "bottom" as const,
                                  labels: {
                                    padding: 40
                                  }
                                 
                                  
                                },
                          
                              },
                  }}></Bar> */}
                   
                     <Radar className="p-4" options={
                      {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                          onComplete: () => {
                            delayed = true;
                          },
                          delay: (context:any) => {
                            let delay = 0;
                            if (
                              context.type === "data" &&
                              context.mode === "default" &&
                              !delayed
                            ) {
                              delay =
                                context.dataIndex * 900 +
                                context.datasetIndex * 1000;
                            }
                            return delay;
                          },
                        },
                        scales: {
                          r: {
                            ticks: {
                              stepSize: 25,
                              color: 'white',
                              // backdropColor: 'rgb(47, 56, 62)',
                              backdropColor: 'black',

                        
                          },
                          pointLabels: {
                            font: {
                              size: 15,
                            
                          
                            },
                            color:"black"
                      
                          },
                              angleLines: {
                                color: "black",
                                lineWidth: 2
                              },
                      
                              grid: {
                                color: "black",
                                // circular: true,
                                lineWidth: 2
                              },
                              
                              suggestedMax: 100
                          },
                        },
                        plugins: {
                          datalabels: {
                            anchor: "end",
                            align: "end",
                              color: "red",
                              //@ts-ignore
                            formatter: function (value,context) {
                              const dataIndex = context.dataIndex;
                              const result = context.dataset.data[dataIndex];
                               
                                return  result + "%" ;
                              
                            },
                            font: {
                              weight: "bold",
                              size: 14,
                           
                            },
                          
                          },
                          legend: {
                            position: "bottom" as const,
                            display: false,
                            labels: {
                              padding:500,
                                color:"white"
                              
                            }
                            
                            
                           
                            
                          },
                      
                        },
                       
                      }
                     } data={data_line_section1_Radar}/>
                </div>

              <div className="w-full md:w-1/2 p-5 bg-yellow-50">
                <p className="text-2xl mb-4 italic font-thin">
                  พนักงานสําเร็จการฝึกอบรม 5 หลักสูตรภายใน 5 ปี
                </p>
                <MaterialReactTable table={table} />
              </div>
            </div>
            <div className="p-5 bg-slate-200 ">
              <div className="MuiTabFlexBetween">
                <Tabs
                  value={Tabvalue}
                  onChange={TabhandleChange}
                  aria-label="icon label tabs example"
                  className="box-tabs "
                >
                  {tabData.map((item, index) => (
                    <Tab
                      className="hover:scale-105 transition-all duration-400 cursor-pointer select-none "
                      icon={
                        index == 0 ? (
                          <PaidIcon
                            className={
                              Tabvalue == 0
                                ? "animate-bounce 10s ease-in-out"
                                : ""
                            }
                            sx={{ fontSize: "50px" }}
                          />
                        ) : index == 1 ? (
                          <AssessmentIcon
                            className={
                              Tabvalue == 1 ? "animate-bounce w-6 h-6" : ""
                            }
                            sx={{ fontSize: "50px" }}
                          />
                        ) : index == 2 ? (
                          <GroupsIcon
                            className={
                              Tabvalue == 2 ? "animate-bounce w-6 h-6" : ""
                            }
                            sx={{ fontSize: "50px" }}
                          />
                        ) : index == 3 ? (
                          <SystemSecurityUpdateWarningIcon
                            className={
                              Tabvalue == 3 ? "animate-bounce w-2 h-6" : ""
                            }
                            sx={{ fontSize: "50px" }}
                          />
                        ) : index == 4 ? (
                          <SystemSecurityUpdateWarningIcon
                            className={
                              Tabvalue == 4 ? "animate-bounce w-2 h-6" : ""
                            }
                            sx={{ fontSize: "50px" }}
                          />
                        ) 
                       : index == 5 ? (
                        <AccountBalanceIcon
                          className={
                            Tabvalue == 5 ? "animate-bounce w-2 h-6" : ""
                          }
                          sx={{ fontSize: "50px" }}
                        />
                      ) 
                        
                        : (
                          <ReportIcon
                            className={
                              Tabvalue == 6 ? "animate-bounce w-6 h-6" : ""
                            }
                            sx={{ fontSize: "50px" }}
                          />
                        )
                      }
                      label={
                        index != 6 ? (
                          <div>
                            {/* <p>{item?.course_name?.substring(0, 5)}</p > */}
                            <p>
                              {item?.course_name?.substring(
                                5,
                                item?.course_name.length
                              )}
                            </p>
                            <p className="text-sm">
                              ({item?.course_name_th})
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold">{item?.course_name}</p>
                            <p className="text-sm">
                              ({item?.course_name_th})
                            </p>
                          </div>
                        )
                      }
                      sx={{ fontSize: "20px" }}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
              </div>
            </div>

            <CustomTabPanel value={Tabvalue} index={Tabvalue}>
              {loadAPI2 ? (

                      <div
                      className="flex flex-col justify-center items-center h-screen w-screen gap-5 bg-orange-50"
                      > 
                      <div> <CircularProgress size={50}/></div>
                      <div> <p className="text-2xl"> กําลังโหลด ....</p></div>


                      </div>
              
              ) : (
                <>
                  <div className="text-center">
                    {Tabvalue == 6 ? (
                      <>
                        <ComplianceTrainningRecored />
                      </>
                    ) : (
                      <>
                        <div className="w-full p-5 h-[800px] bg-orange-50 ">
                          <Bar
                            data={data_line_section2}
                            options={{
                            
                              scales: {
                                y: { 
                                  ticks:{
                                    padding:30
                                  }
                                },
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                datalabels: {
                                  anchor: "end",
                                  align: "end",
                                  color: "black",
                                  //@ts-ignore
                                  formatter: function (value,context) {
                                    const dataIndex = context.dataIndex;
                                    const result = context.dataset.data[dataIndex];
                                      return `${result}%\n(${aryEmpLearningSection2[dataIndex]}/${aryCountEmpInSection[dataIndex]})`;
                                      // return `${result}%\n (${aryEmpLearningSection2[dataIndex]}คน)`;

                                    
                                  },
                                  font: {
                                    weight: "bold",
                                    size: 12,
                                  },
                                },
                                legend: {
                                  position: "bottom" as const,
                                  labels: {
                                    padding: 40
                                  }
                                 
                                  
                                },
                          
                              },
                            }}
                            onClick={attendanceEmployee}
                            ref={chartRef}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </CustomTabPanel>
          </>
        </>
      )}

      <CCAttendanceTableReport
        openDialog={openDialog}
        cc={cc}
        onClose={closeDialog}
      />
    
    </>
  );
}

export default ElearningReport;
