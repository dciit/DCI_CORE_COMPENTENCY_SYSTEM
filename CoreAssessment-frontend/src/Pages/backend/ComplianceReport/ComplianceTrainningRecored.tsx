
  //@ts-nocheck
import { useEffect, useState } from "react";

// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
import { elearningModel } from "../../../Model/Elearning/Elearning";
import SrvComplianceTraining from "../../../service/ComplianceTrainingRecored.ts";
import { Dept } from "../../../Model/Compliance/ComplianceInfo.ts";
import { Box, Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateRange, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import Search from "@mui/icons-material/Search";
import dayjs, { Dayjs } from "dayjs";
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';


import { BarChart } from '@mui/x-charts/BarChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { axisClasses } from '@mui/x-charts/ChartsAxis';



import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsLegend, PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';


// const columns = [
//   { id: "targetGroup", label: "Target Group", color: "#98F5F9", width: "10%" },
//   {
//     id: "AmountEmployee",
//     label: "Amount (Employee)",
//     color: "#98F5F9",
//     width: "1%",
//   },
//   {
//     id: "ComplianceCourseTarget",
//     label: "Compliance course attendance target",
//     color: "#7DDA58",
//     width: "7%",
//   },
//   { id: "cc001", label: "Anti-Bribery", color: "#98F5F9", width: "1%" },
//   { id: "cc002", label: "Trade Secret", color: "#98F5F9", width: "1%" },
//   { id: "cc003", label: "PDPA", color: "#98F5F9", width: "1%" },
//   { id: "cc004", label: "Security export", color: "#98F5F9", width: "1%" },
//   { id: "cc005", label: "Whistle blowing", color: "#98F5F9", width: "1%" },
// ];

function ComplianceTrainningRecored() {
  const today = new Date();

  const [dataHeader, setdataHeader] = useState<elearningModel[]>([]);
  const [dataContent, setdataContent] = useState<Dept[]>([]);
  const [dataset, setdataset] = useState<any>([]);
  const [dtPicker] = useState<DateRange<Dayjs>>([
    dayjs(new Date(2024, 3, 1)),
    dayjs(new Date()),
  ]);

  //@ts-ignore
  const [stDate, setstDate] = useState<string>(
    dayjs(new Date(today.getFullYear(), today.getMonth(), 1)).format(
      "YYYY-MM-DD"
    )
  );
  //@ts-ignore
  const [enDate, setenDate] = useState<string>(
    dayjs(new Date(today.getFullYear(), today.getMonth() + 1, 0)).format(
      "YYYY-MM-DD"
    )
  );

  const [loadAPI, setloadAPI] = useState<Boolean>(true);

  useEffect(() => {
    fetchDataSection1();
  }, []);

   function valueFormatter(value: number | null) {
    return `${value}%`;
  }

  async function fetchDataSection1() {
    // โหลด section1

    const res: any = await SrvComplianceTraining.getCCTraningRecored();
    try {
      setdataHeader(res.ccHeaderList);
      setdataContent(res.ccContentList);
      setdataset(res.dataset)
      setloadAPI(false);
    } catch (error) {
      console.log(error);
    }
  }

  function showDisplay(textSplit: any, index: number) {
    if (textSplit == "0" && index == 1) {
      return "Open jun 3, 24";
    } else if (textSplit == "0" && index == 2) {
      return "Open Aug 1, 24";
    } else if (textSplit == "0" && index == 3) {
      return "Open Oct 1, 24";
    } else if (textSplit == "0" && index == 4) {
      return "Open Dec 2, 24";
    } else {
      return textSplit + "%";
    }
  }

  const filterMonthDataTable = (data: any) => {
    setstDate(dayjs(data[0]).format("YYYY-MM-DD"));
    setenDate(dayjs(data[1]).format("YYYY-MM-DD"));
  };
 

  const chartSetting:any = {
    yAxis: [
      {
        label: 'พนักงานที่อบรมแล้ว (%)',
        
      },
    
    ],
    
    width: 1900,
    height: 500,

    sx: {
      
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-10px, 0)',
       
      },
    },
   
  };
  

  return (
    <>
      {loadAPI ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={10}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="flex flex-col content-start p-10 bg-cyan-50 overflow-hidden">
  
            <div className="font-bold text-2xl border border-black p-6 mb-6 bg-zinc-50 hidden">
              <div className="flex flex-row justify-start gap-10">
                <div className="datepickerColor">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateRangePicker"]}>
                      <DateRangePicker
                        sx={{ width: 700 }}
                        localeText={{
                          start: "วันที่เริ่ม Training",
                          end: "วันที่สุดท้าย Training",
                        }}
                        className="datepickerInput "
                        value={dtPicker}
                        onChange={(newValue) => filterMonthDataTable(newValue)}
                        minDate={dayjs(new Date(2024, 3, 1))}
                        maxDate={dayjs(new Date())}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <div>
                  <Button
                    type="button"
                    variant="contained"
                    color="info"
                    // onClick={() => searchDatePicker(status)}
                    endIcon={<Search className="text-3xl" />}
                    sx={{ width: 120, height: 54, mt: 1 }}
                  >
                    <Typography variant="h6" sx={{ color: "white" }}>
                      ค้นหา
                    </Typography>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-coljustify-center items-center ">
                  {/* <BarChart
                    dataset={dataset}
                    
                    xAxis={[{ scaleType: 'band', dataKey: 'sect_short', 
                      
                      valueFormatter: (sect, context) =>
                        context.location === 'tick'
                          ? sect
                          : `${dataset.find((d:any) => d.sect_short === sect)?.section_long}`,
                    
                      
                      tickLabelStyle: {
                      angle: 90,
                      textAnchor: 'center',
                      fontSize: 12,
                      fontWeight:'bold',
                      
                    },
                  
                    
                  }]}
                    series={[
                      
                      { dataKey: 'cc001', label: 'Anti-Bribery',valueFormatter },
                      { dataKey: 'cc002', label: 'Trade Secret',valueFormatter },
                      { dataKey: 'cc003', label: 'PDPA',valueFormatter },
                      { dataKey: 'cc004', label: 'Security export',valueFormatter },
                      { dataKey: 'cc005', label: 'Whistle blowing',valueFormatter },
                      

                    ]}
                    {...chartSetting}
                  /> */}
                        <ResponsiveChartContainer
            
            series={[
                  
              { type: 'line', dataKey: 'percent', color: 'red',label:'ผ่าน', valueFormatter },
              { type: 'bar', dataKey: 'cc001',  color:'#00bfff', yAxisId: 'leftAxis',label: 'Anti-Bribery',valueFormatter },
              { type: 'bar', dataKey: 'cc002',  color:'orange', yAxisId: 'leftAxis',label: 'Trade Secret',valueFormatter },
              { type: 'bar', dataKey: 'cc003',  color:'gray', yAxisId: 'leftAxis',label: 'PDPA',valueFormatter },
              { type: 'bar', dataKey: 'cc004',  color: 'pink' ,yAxisId: 'leftAxis',label: 'Security export',valueFormatter },
              { type: 'bar', dataKey: 'cc005',  color: 'purple' ,yAxisId: 'leftAxis', label: 'Whistle blowing',valueFormatter },

              

            ]}
            xAxis={[
              {
               scaleType: 'band', dataKey: 'sect_short',

               valueFormatter: (sect, context) =>
                context.location === 'tick'
                  ? sect
                  : `${dataset.find((d:any) => d.sect_short === sect)?.section_long}`,
            
              
              tickLabelStyle: {
              angle: 90,
              textAnchor: 'start',
              fontSize: 12,
              fontWeight:'bold',
              
            },
          
            
          }]}
            yAxis={[
              { id: 'leftAxis' },
            ]}
            dataset={dataset}
            height={500}
          >
         <ChartsLegend
        direction="row"
        onItemClick={(event, context, index) => setItemData([context, index])}

      />
            <ChartsGrid horizontal />
            <BarPlot />
            <LinePlot />
            <ChartsXAxis />
            <ChartsYAxis axisId="leftAxis" label="พนักงานที่อบรมแล้ว (%)" />
            <ChartsTooltip />

                        </ResponsiveChartContainer>
              </div>

              <div className="p-10">
              <table className="tbCompliance w-full">
                <tr className="text-lg">
                  <th className="w-[15%]">Target Group</th>
                  <th className="w-[10%]">Amount (Employee)</th>
                  <th className="w-[30%]">
                    Compliance course attendance target
                  </th>
                  <th className="w-[5%]">Anti-Bribery</th>
                  <th className="w-[5%]">Trade secret control</th>
                  <th className="w-[5%]">PDPA</th>
                  <th className="w-[5%]">Security export control</th>
                  <th className="w-[5%]">Whistle blowing control</th>
                </tr>
                <tbody>
                  <tr>
                    <td rowSpan={5} className="text-[18px] text-start">
                      1) Manager/Assistant Manager <br />
                      2) Supervisor <br />
                      3) Engineer <br />
                      4) Foreman Techician , Staff
                      <br />
                      5) Operator , Leader
                    </td>
                  </tr>

                  <tr>
                    <td rowSpan={5}>
                      <p className="font-bold text-[18px] text-center">
                        {dataHeader[0]?.totalEmployee?.toLocaleString()}
                        <br />
                        (Update {dayjs(new Date()).format("DD/MM/YYYY")})
                      </p>
                    </td>
                    <td>
                      1. Employee complete 5 training courses within 5 year
                    </td>
                    {[...Array(5)].map(() => {
                      return <td className="bg-yellow-100 text-center">100%</td>
                    })}
                  </tr>

             

                  <tr>
                    <td>Actual</td>
                    {dataHeader.map((_empTotal: any, index) => {
                      return (
                        <td className="text-center">
                          <span
                            className={
                              _empTotal.employeeIsLearingPercent != "100" &&
                              _empTotal.employeeIsLearingPercent != "0"
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {showDisplay(
                              _empTotal.employeeIsLearingPercent,
                              index
                            ).substring(0, 4) == "Open" ? (
                              <>
                                {showDisplay(
                                  _empTotal.employeeIsLearingPercent,
                                  index
                                ).substring(0, 4)}{" "}
                                <br />
                                {showDisplay(
                                  _empTotal.employeeIsLearingPercent,
                                  index
                                ).substring(
                                  4,
                                  showDisplay(
                                    _empTotal.employeeIsLearingPercent,
                                    index
                                  ).length
                                )}
                              </>
                            ) : (
                              showDisplay(
                                _empTotal.employeeIsLearingPercent,
                                index
                              ).substring(0, 4)
                            )}{" "}
                            <br />{" "}
                            <p className="text-black">
                              {_empTotal.employeeIsLearing != 0 && (
                                <>({_empTotal.employeeIsLearing})</>
                              )}
                            </p>
                          </span>
                        </td>
                      )
                    })}
                  </tr>

                  <tr>
                    <td className="bg-yellow-100 text-[15px]">
                      2. All departments send at least 25% of their employees to
                      attend each course per year.
                    </td>

                    {[...Array(5)].map(() => {
                      return (
                        <td
                          rowSpan={2}
                          className="bg-yellow-100 text-center text-[18px] font-bold"
                        >
                          25%
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="bg-yellow-100">Section/Actual</td>
                  </tr>

                  {dataContent.map((content_dept: any) => {
                    return (
                      <>
                        <tr>
                          <td
                            rowSpan={content_dept.sections.length + 1}
                            className="text-left text-[18px]"
                          >
                            {content_dept.dept}
                          </td>
                        </tr>

                        {content_dept.sections.map(
                          (content_section: any) => {
                            return (
                              <tr>
                                <td className="text-center text-[15px]">
                                  {content_section.employeeTotal == null ? 0 : content_section.employeeTotal}
                                </td>
                                <td className="text-left text-[15px]">
                                  {content_section.section}
                                </td>

                                {content_section.percentScore.map(
                                  (scoreTotal: any) => {
                                    return (
                                      <td
                                        className={
                                          scoreTotal >= 25
                                            ? "bg-green-400 text-right text-[15px]"
                                            : "bg-red-200 text-right text-[15px]"
                                        }
                                      >
                                        {scoreTotal > 0 ? scoreTotal : "0.00"}
                                      </td>
                                    )
                                  }
                                )}
                              </tr>
                            )
                          }
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
              </div>
     


              
          

              {/* <TableContainer sx={{ maxHeight: "auto", width: "100%" }}>
                <Table
                  className="tbMain"
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ backgroundColor: "white" }}
                >
                  <TableHead>
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableCell
                          sx={{
                            backgroundColor: column.color,
                            width: column.width,
                            fontSize: 20,
                          }}
                          key={index}
                          style={{ fontWeight: "bold" }}
                        >
                          {index == 1 ? (
                            <>
                              {column.label.split(" ")[0]} <br />{" "}
                              {column.label.split(" ")[1]}
                            </>
                          ) : (
                            column.label
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        rowSpan={6}
                        sx={{
                          fontSize: 20,
                          alignContent: "start",
                          textAlign: "left",
                        }}
                      >
                        1) Manager/Assistant Manager <br />
                        2) Supervisor <br />
                        3) Engineer <br />
                        4) Foreman Techician , Staff
                        <br />
                        5) Operator , Leader
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell rowSpan={5} sx={{ fontSize: 18 }}>
                        <p className="font-bold">
                          {dataHeader[0]?.totalEmployee?.toLocaleString()}
                        </p>
                        (Update {dayjs(new Date()).format("DD/MM/YYYY")})
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        className="bg-yellow-100"
                        sx={{ textAlign: "left", fontSize: 15 }}
                      >
                        1. Employee complete 5 training courses within 5 year
                      </TableCell>

                      {[...Array(5)].map(() => {
                        return (
                          <TableCell
                            className="bg-yellow-100"
                            sx={{
                              textAlign: "center",
                              fontSize: 18,
                              fontWeight: "bold",
                            }}
                          >
                            100%
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ textAlign: "center", fontSize: 18 }}>
                        Actual
                      </TableCell>

                      {dataHeader.map((_empTotal: any, index) => {
                        return (
                          <TableCell sx={{ textAlign: "center", fontSize: 17 }}>
                            <span
                              className={
                                _empTotal.employeeIsLearingPercent != "100" &&
                                _empTotal.employeeIsLearingPercent != "0"
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {showDisplay(
                                _empTotal.employeeIsLearingPercent,
                                index
                              ).substring(0, 4) == "Open" ? (
                                <>
                                  {showDisplay(
                                    _empTotal.employeeIsLearingPercent,
                                    index
                                  ).substring(0, 4)}{" "}
                                  <br />
                                  {showDisplay(
                                    _empTotal.employeeIsLearingPercent,
                                    index
                                  ).substring(
                                    4,
                                    showDisplay(
                                      _empTotal.employeeIsLearingPercent,
                                      index
                                    ).length
                                  )}
                                </>
                              ) : (
                                showDisplay(
                                  _empTotal.employeeIsLearingPercent,
                                  index
                                ).substring(0, 4)
                              )}{" "}
                              <br />{" "}
                              <p className="text-black">
                                {_empTotal.employeeIsLearing != 0 && (
                                  <>({_empTotal.employeeIsLearing})</>
                                )}
                              </p>
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className="bg-yellow-100"
                        sx={{ fontSize: 15 }}
                      >
                        2. All departments send at least 25% of their employees
                        to attend each course per year.
                      </TableCell>

                      {[...Array(5)].map(() => {
                        return (
                          <TableCell
                            rowSpan={2}
                            className="bg-yellow-100"
                            sx={{
                              textAlign: "center",
                              fontSize: 18,
                              fontWeight: "bold",
                            }}
                          >
                            25%
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className="bg-yellow-100"
                        sx={{ textAlign: "center", fontSize: 18 }}
                      >
                        Section/Actual
                      </TableCell>
                    </TableRow>

                    {dataContent.map((content_dept: any) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell
                              rowSpan={content_dept.sections.length + 1}
                              sx={{ textAlign: "left", fontSize: 18 }}
                            >
                              {content_dept.dept}
                            </TableCell>
                          </TableRow>

                          {content_dept.sections.map(
                            (content_section: any, no: number) => {
                              return (
                                <TableRow>
                                  <TableCell
                                    sx={{ textAlign: "center", fontSize: 15 }}
                                  >
                                    {no + 1}
                                  </TableCell>
                                  <TableCell
                                    sx={{ textAlign: "left", fontSize: 15 }}
                                  >
                                    {content_section.section}
                                  </TableCell>

                                  {content_section.percentScore.map(
                                    (scoreTotal: any) => {
                                      return (
                                        <TableCell
                                          className={
                                            scoreTotal >= 25
                                              ? "bg-green-400"
                                              : "bg-red-200"
                                          }
                                          sx={{
                                            textAlign: "right",
                                            fontSize: 15,
                                          }}
                                        >
                                          {scoreTotal > 0 ? scoreTotal : "0.00"}
                                        </TableCell>
                                      );
                                    }
                                  )}
                                </TableRow>
                              );
                            }
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer> */}
            </div>

  
          </div>
        </>
      )}
      
    </>
  );
}

export default ComplianceTrainningRecored;
