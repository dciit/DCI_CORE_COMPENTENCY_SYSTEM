import { useState, useEffect } from "react";
import { Doughnut, Radar } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import SrvCoreAssessmentList from "../../service/employeeList";
import SrvCoreAssessment from "../../service/coreAssessment";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
// import Swal from 'sweetalert2';

ChartJS.register(
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);


export interface DashboardScore {
  courseName: string;
  scorce: scoreStatus[];
}

export interface scoreStatus {
  pass: number;
  notPass: number;
}

export interface Employee {
  code: string;
  name: string;
  surn: string;
  dept: string;
  sect: string;
  posit: string;
  joinDate: Date;
}

export interface ApproveData {
  empcode: string;
  approveBy: string;
  year: string;
  statusConfirm: boolean;
}

const styles = {
  commonStyles: {
    bgcolor: "background.paper",
    mt: 2,
    border: 1,
    borderColor: "text.primary",
    width: "auto",
    height: "auto",
  },

  commonStyles_dashboard: {
    bgcolor: "background.paper",
    mt: 2,
    borderColor: "text.primary",
    width: "auto",
    height: "auto",
  },
};

// const data = {
//   labels: ["CC 001", "CC 002", "CC 003", "CC 004", "CC 005"],
//   datasets: [
//     {
//       label: "คะแนน %",
//       data: [65, 59, 90, 81, 56],
//       fill: true,
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
      
//     },
//   ],
// };

const config = {
  responsive: true,
 
  scales: {
    
    r: {
      ticks: {
        stepSize: 10,
        color: 'white',
        backdropColor: 'rgb(47, 56, 62)',
    },
    pointLabels: {
      font: {
        // weight: 'bold',        
        size: 20,
    
      },
      padding: 10,
    },
        angleLines: {
            color: "rgba(255,99,132,1)",
        },

        grid: {
            color: "darkblue",
        },
    },
  }
}

function EmployeeDashboard() {
  const DashboardPageStore = useSelector(
    (state: any) => state.scoreEmployeeStateReducer.DashboardEmployeePage
  );
  let isData: any;
  const [scores, setScroes] = useState<DashboardScore[]>([]);
  const [isPositionSupervisorDown, setisPositionSupervisorDown] =
    useState<number>(5);
  const [employee, setemployee] = useState<Employee>();

  const courseCode: string[] = [
    "CC 001 จิตสำนึกด้านความปลอดภัย (Safety Awareness)",
    "CC 002 ความสามารถในการปรับตัว (Professional Adaptability)",
    "CC 003 การผลิตแบบไดกิ้นที่เป็นเลิศ (Excellent PDS)",
    "CC 004 จิตสำนึกด้านคุณภาพที่เป็นเลิศ (Excellent Quality Awareness)",
    "CC 005 การพัฒนาอย่างต่อเนื่อง (Development)",
    "MC 001 การบริหารจัดการผลงาน (Performance Management)",
    "MC 002 การบริหารจัดการโดยยึดคนเป็นศูนย์กลาง",
    "MC 003 การบริหารกลยุทธ์เชิงรุก (Provactive Strategy Management)",
  ];

  const [labels, setLabels] = useState<string[]>([]);


  //const employeeLv3_Down:string[] =["LE","LE.S","OP.S","OP-D","OP-P","OP-T","OTH","PD","SE","SF","SS","ST","SU","SUB","TE","TE.S","TR"]
  const employeeLv4_Up: string[] = ["MG", "AM", "GM", "SGM", "AG"];

  useEffect(() => {

    let rLabel: string[] = [];

    SrvCoreAssessment.getEmployeeForIndicator(DashboardPageStore.empcode).then(
      (res) => {
        try {
          setemployee(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    );

    SrvCoreAssessmentList.getDashboardEmployeeData(
      DashboardPageStore.level,
      DashboardPageStore.empcode,
      DashboardPageStore.year
    ).then((res) => {
      try {
        setScroes(res.data);

     

      } catch (error) {
        console.log(error);
      }
    });

    if (employeeLv4_Up.includes(DashboardPageStore.position)) {
      setisPositionSupervisorDown(8);
      
      courseCode.slice(0,isPositionSupervisorDown).forEach((element: any) => {
        rLabel.push(
          element.substring(0,7)
        );
      });
    setLabels(rLabel);

    } else {

      setisPositionSupervisorDown(5);
      courseCode.slice(0,5).forEach((element: any) => {
        rLabel.push(
          element.substring(0,7)
        );
      });
      setLabels(rLabel);
    }

    


  }, []);

  // const data_donut = {
  //     labels: getBarDashboard[0]?.company,
  //     datasets: [
  //       {
  //         label: 'ชั่วโมงทั้งหมด',
  //         data: getBarDashboard[0]?.totalTime,
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)',
  //         ],
  //         borderColor: [
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)',
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  // const data = {

  //     datasets: [{
  //       label: 'คะแนน',
  //       data: [100,80],
  //       backgroundColor: [
  //         '#3260CA',
  //         '#0DC6F7',

  //       ],
  //       hoverOffset: 4
  //     }],

  //   };

  const text_center = {
    id: "textCenter",
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;

      ctx.save();
      ctx.font = "bolder 30px prompt";

      ctx.textAlign = "center";
      ctx.fillText(
        "80%",
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };


    const RadarChart: React.FC = () => {
    var dataset: any = [];
    let dataLabels : any = []
    {
      
      scores.map((sc) => {dataLabels.push(sc.scorce[0].pass)})
        dataset.push({
          data: dataLabels,
          label: "คะแนน %",
          fill: true,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
        });
  
    }
    isData = {
      labels,
      datasets: dataset,
    };
 
    return (
      <Radar options={config} data={isData} />
    );
  };

  

  // const approveClick = (event: React.MouseEvent<HTMLElement>,year:string,empcode:string,approveBy:string) =>{
  //     event.preventDefault()

  //     let approveData : ApproveData= {
  //       year:year,
  //       empcode:empcode,
  //       approveBy:approveBy,
  //       statusConfirm:false

  //     }

  //     SrvCoreAssessmentList.SaveApproveEmployee(approveData).then((res)=>{
  //       try{
  //         if(res.data.statusConfirm){
  //           Swal.fire({
  //             position: 'top-end',
  //             icon: 'success',
  //             title: 'Approve สำเร็จ',
  //             showConfirmButton: false,
  //             timer: 1500
  //           })
  //         }else{
  //           Swal.fire({
  //             position: 'top-end',
  //             icon: 'error',
  //             title: 'Approve ไม่สำเร็จ',
  //             showConfirmButton: false,
  //             timer: 1500
  //           })

  //         }

  //       }catch(error){
  //         console.log(error)
  //       }
  //     })
  // }

  return (
    <>
      <Card sx={{ display: "flex", borderRadius: 2, backgroundColor: "teal" }}>
        <Box sx={{ display: "flex", alignItems: "center", m: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: 120, borderRadius: "10%" }}
            image={`http://dcidmc.dci.daikin.co.jp/PICTURE/${employee?.code}.JPG`}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5" sx={{ color: "white" }}>
              ผู้รับการประเมิน
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ color: "white" }}
            >
              <Box fontWeight="bold" display="inline">
                รหัสพนักงาน :
              </Box>{" "}
              {employee?.code}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ color: "white" }}
            >
              <Box fontWeight="bold" display="inline">
                ชื่อ-นามสกุล :
              </Box>{" "}
              {employee?.name}&nbsp;{employee?.surn}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ color: "white" }}
            >
              <Box fontWeight="bold" display="inline">
                ตำแหน่ง :
              </Box>{" "}
              {employee?.posit}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ color: "white" }}
            >
              <Box fontWeight="bold" display="inline">
                หน่วยงาน :
              </Box>{" "}
              {employee?.sect}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ color: "white" }}
            >
              <Box fontWeight="bold" display="inline">
                วันที่เข้าทำงาน :
              </Box>{" "}
              {dayjs(employee?.joinDate).format("DD/MM/YYYY")}
            </Typography>
          </CardContent>
        </Box>
      </Card>

      <Box sx={{ ...styles.commonStyles, border: 2 }}>
        <Card sx={{ minWidth: 275, backgroundColor: "#CACFD2" }}>
          <CardContent>
            <Typography component="div" variant="h5">
              คำอธิบายผลการประเมิน
            </Typography>
            <Typography sx={{ mt: 1.5 }} color="text.secondary" variant="body1">
              80~100% = เข้าใจอย่างถ่องแท้ สามารถทำงานได้อย่างเชี่ยวชาญ
              <br />
              70~79% = เข้าใจดี ทำงานได้
              <br />
              60~69% = เข้าใจ สามารถทำงานได้โดยอิสระโดยไม่ต้องมีคนช่วย
              <br />
              50~59% = เข้าใจไม่ดี สามารถทำงานช่วยเหลือได้
              <br />
              0~49% = ล้มเหลว ไม่เข้าใจ
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ ...styles.commonStyles_dashboard, border: 2 }}>
        <Card sx={{ backgroundColor: "#CACFD2", p: 5 }}>
          <CardContent>
            {/* <Typography variant='h5' sx={{marginTop:3}}>Dash board</Typography> */}
            <Grid container spacing={10}>
              {courseCode
                .slice(0, isPositionSupervisorDown)
                .map((code, index) => {
                  const data = {
                    datasets: [
                      {
                        label: "คะแนน",
                        data: [
                          scores[index]?.scorce[0]?.pass,
                          scores[index]?.scorce[0]?.notPass,
                        ],
                        backgroundColor: ["#3260CA", "#0DC6F7"],
                        hoverOffset: 4,
                      },
                    ],
                  };
                  return (
                    <Grid item xs={12} sm={6} md={4} sx={{ marginTop: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: 15 }}
                      >
                        {code}
                      </Typography>
                      <div
                        className="chart"
                        style={{ height: "300px", width: "450px" }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={1}>
                            <h2>{scores[index]?.scorce[0]?.notPass}%</h2>
                          </Grid>
                          <Grid item xs={7}>
                            <Doughnut plugins={[text_center]} data={data} />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body1">
                              เป้าหมาย : 80%
                            </Typography>
                            {scores[index]?.scorce[0].pass >= 80 ? (
                              <Typography
                                variant="body1"
                                sx={{ color: "green" }}
                              >
                                ผ่าน : {scores[index]?.scorce[0].pass}%
                              </Typography>
                            ) : (
                              <Typography variant="body1" sx={{ color: "red" }}>
                                ไม่ผ่าน : {scores[index]?.scorce[0].pass}%
                              </Typography>
                            )}
                            <h2>{scores[index]?.scorce[0]?.pass}%</h2>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  );
                })}
            </Grid>

            <Grid sx={{ marginTop: 5, textAlign: "-webkit-center" }}>
              <div style={{width:'800px',height:'700px'}}>   <RadarChart  /></div>
           
            </Grid>
          </CardContent>
        </Card>
  
      </Box>
      <br />
    </>
  );
}

export default EmployeeDashboard;
