// import { Pie } from "react-chartjs-2";
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
  Filler,
  ArcElement,
  
} from "chart.js";
import Skeleton from '@mui/material/Skeleton';


import {  useEffect, useState } from "react";
import { getDashboards } from "../../service/dashboard";
// import { useSelector } from "react-redux";

import { Bar, Doughnut, Pie } from "react-chartjs-2";
import Carousel from 'react-material-ui-carousel'
import PersonIcon from '@mui/icons-material/Person';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DoneIcon from '@mui/icons-material/Done';
import { useSelector } from "react-redux";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin
import  SrvDashboard from "../../service/dashboard.ts"



ChartJS.register(
  ArcElement,
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

export interface MainDashBoardChart {
  dvcd: number;
  dvcd_name: string;
  countEmployee: CountEmployeeStatus[];
}



export interface CountEmployeeStatus {
  level: number;
  cc:string[]
  totalEmployee: number[];
  totalEmployeePass: number[];
}

function Dashboard() {
  // const user_info:any = Cookies.get("user_info") 

    const authenStep = useSelector((state:any) => state.authenStateReducer.userAuthenData);


  // const [dashboardBarChart, setdashboardBarChart] = useState<MainDashBoardChart[]>([]);
  // @ts-ignore
  const [dashboardPieDVCDChart, setdashboardPieDVCDChart] = useState<string[]>([]);
  // @ts-ignore
  const [dashboardPieCountChart, setdashboardPieCountChart] = useState<number[]>([]);

  const [loadAPI,setloadAPI] = useState<Boolean>(false)
  
  // card

  const [countEmployeeInSection,setcountEmployeeInSection] = useState<number>(0)
  const [countEmployeePendding,setcountEmployeePendding] = useState<number>(0)
  const [countEmployeeNotEaluted,setcountEmployeeNotEaluted] = useState<number>(0)
  const [countEmployeeEvaluted,setcountEmployeeEvaluted] = useState<number>(0)

  
     // bar chart
     const [labelsBarChart, setlabelsBarChart] = useState<string[]>([]);
     const [EmpEvalute, setEmpEvalute] = useState<number[]>([]);
     const [CountEmpInSection,setCountEmpInSection] = useState<number[]>([]);
     const [EmpEvalutePercent, setEmpEvalutePercent] = useState<number[]>([]);
  
    // donut chart
    // const [labelsDonutChart, setlabelsDonutChart] = useState<string[]>([]);
    // const [dataDonutChart, setdataDonutChart] = useState<number[]>([]);

        // Pie chart
    const [labelsPieChart, setlabelsPieChart] = useState<string[]>([]);
    const [dataPieChart, setdataPieChart] = useState<number[]>([]);



  useEffect(() => {
    

      fetchDashboard()
    
  

  

  }, []);



  const fetchDashboard =  async () => { 
    setloadAPI(true)

     let payload = {
      empcode:authenStep.empcode,
      position:authenStep.position,
      dvcd:authenStep.position_number
     }

    const dashboard: any = await getDashboards(payload);
    //const res: any = await SrvDashboard.getBarChart(authenStep.empcode);
    try {
      
      //setdashboardBarChart(res.data)
      setcountEmployeeInSection(dashboard.count_empInSection)
      setcountEmployeePendding(dashboard.count_empWaitConfirmPending)
      setcountEmployeeNotEaluted(dashboard.count_empApprove)
      setcountEmployeeEvaluted(dashboard.count_empNotEvaluted)


      
        // bar chart
        setEmpEvalutePercent(dashboard.dataChart)
        setlabelsBarChart(dashboard.labelChart);
        setEmpEvalute(dashboard.countEmployeeIsEvaluted)
        setCountEmpInSection(dashboard.countTotalEmployeeInSection)

        // pie chart
        // setlabelsDonutChart(dashboard.coreLevel_pie)
        // setdataDonutChart(dashboard.totalEmp_pie)

        // donut chart
        let ary_donut:string[] = []
        dashboard.coreLevel_donut.forEach((element:string) => {
          if(element.includes("1")){
            ary_donut.push("LV1 : Operator , Leader")
          }else if(element.includes("2")){
            ary_donut.push("LV2 : Foreman,Technician,Staff")
          }else if(element.includes("3")){
              ary_donut.push("LV3 : Engineer")
          }else if(element.includes("4")){
              ary_donut.push("LV4 : Supervisor")
          }else if(element.includes("5")){
              ary_donut.push("LV5 : Manager")
          }
          
         
        });
        setlabelsPieChart(ary_donut)
        setdataPieChart(dashboard.totalEmp_donut)

      setloadAPI(false) 

    } catch (error) {
      console.log(error);
    }
  }


  let delayed:boolean;
  const data_barchart= {
      labels: labelsBarChart ,
      datasets: [
        {
          label: "จำนวนพนักงานที่ประเมินในแผนก (%)",
          data: EmpEvalutePercent,
          // backgroundColor:"#00bfff",
          backgroundColor:"rgba(115, 186, 251, 0.64)",
          fill: true,
          borderRadius: 5,
         
        
        },
  
    
      
      ],
    };


    // const data_donutChart= {
    //   labels: labelsDonutChart,
    //   datasets: [{
    //     label: 'จำนวนคนที่ประเมิน',
    //     data: dataDonutChart,
    //     backgroundColor: [
    //       '#0088FE',
    //       'rgb(255, 171, 0)',
    //       'rgb(81, 25, 183)',
    //       'rgb(255, 86, 48)',
    //       '#00C49F'
    //     ],
    //     hoverOffset: 20
    //   }]
    // };
    
    const data_pieChart= {
      labels: labelsPieChart,
      datasets: [{
        label: 'จำนวนคนที่ประเมิน',
        data: dataPieChart,
        backgroundColor: [
          '#00C49F',
          '#0088FE',
          'rgb(255, 171, 0)',
          '#FF8042',
          'rgb(81, 25, 183)'
        ],
        hoverOffset: 20
      }]
    };
    

   




  return (
    <>    
 

    {loadAPI ? (
        <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
                    
                        <div> <Skeleton variant="rounded"  height={200}/></div>
                        <div> <Skeleton variant="rounded" height={200}/></div>
                        <div> <Skeleton variant="rounded" height={200}/></div>
                        <div> <Skeleton variant="rounded" height={200}/></div>
  
        </div>
     <br />
  
      <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4'>                    
          <div className="w-full h-[450px] sm:col-span-1 md:col-span-1 lg:col-span-3" > <Skeleton variant="rounded"  height={450}/></div>
          <div className='w-full h-[450px]' ><Skeleton variant="rounded" height={450}/></div> 
          <div className="w-full h-[450px] sm:col-span-1 md:col-span-1 lg:col-span-3" > <Skeleton variant="rounded"  height={450}/></div>

          <div className='w-full h-[450px]' ><Skeleton variant="rounded" height={450}/></div> 
        </div>      
      </div>  
  ) : (
    <div className='p-4'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">

        <div className='bg-blue-300/90 p-10 rounded-xl text-white shadow-lg'>
            <div className='flex flex-row justify-between'>
                <div className='w-[80%]'>
                    <div className='font-bold text-3xl text-blue-800'>{countEmployeeInSection} คน</div> <br />
                    <div className='text-lg text-blue-800'>จำนวนพนักงานทั้งหมดในสังกัด</div>
                </div>
                <div className='w-[20%] text-end'>
                        <div className='z-0 absolute border-white border-2  
                        flex h-20 w-20 items-center justify-center rounded-full bg-blue-500'>
                            <PersonIcon style={{width:'50px',height:'50px'}}/>
                        </div>

                </div>
            </div>
        </div>
        <div className='bg-red-200  p-10 rounded-md text-white shadow-lg'>

        <div className='flex flex-row justify-between'>
            <div className='w-[80%]'>
                    <div className='font-bold text-3xl text-red-800'>{countEmployeeNotEaluted} คน</div> <br />
                    <div className='text-lg text-red-800'>จำนวนพนักงานที่ไม่ได้ประเมิน</div>
                </div>
                <div className='w-[20%] text-end'>
                <div className='z-0 absolute border-white border-2  
                        flex h-20 w-20 items-center justify-center rounded-full bg-red-500'>
                            <AssignmentTurnedInIcon style={{width:'50px',height:'50px'}}/>
                        </div>
                </div>
            </div>
        
        </div>

        <div className='bg-amber-200  p-10 rounded-md text-white shadow-lg'>
        
        <div className='flex flex-row justify-between'>
            <div className='w-[80%]'>
                    <div className='font-bold text-3xl text-orange-800'>{countEmployeePendding} คน</div> <br />
                    <div className='text-lg text-orange-800'>จำนวนพนักงานที่รอการ Confirm / Approve</div>
                </div>
                <div className='w-[20%] text-end'>
                <div className='z-0 absolute border-white border-2  
                        flex h-20 w-20 items-center justify-center rounded-full bg-amber-500'>
                            <AssignmentTurnedInIcon style={{width:'50px',height:'50px'}}/>
                        </div>
                </div>
            </div>
        
        </div>


        <div className='bg-green-200 border border-1 black p-10 rounded-md  shadow-xl'>

        <div className='flex flex-row justify-between'>
                <div className='w-[80%] text-white'>
                    <div className='font-bold text-3xl text-green-900'>{countEmployeeEvaluted}  คน</div> <br />
                    <div className='text-lg text-green-800'>จำนวนพนักงานที่ประเมินแล้ว</div>
                </div>
                <div className='w-[20%] text-end'>
                <div className='z-0 absolute border-white border-2  
                        flex h-20 w-20 items-center justify-center rounded-full bg-green-500'>
                            <DoneIcon style={{width:'50px',height:'50px',color:'white'}}/>
                        </div>
                </div>
            </div>
        </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mt-6'> 
                    <div className='w-full h-[450px] border border-gray shadow-2xl p-6 sm:col-span-1 md:col-span-1 lg:col-span-3 rounded-xl' >
                    <p className="text-xl font-bold">จำนวนพนักงานที่ประเมินในแผนก </p>

                              <Bar
                              className="mt-10"
                                data={data_barchart}
                                options={{
                                  
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
                                          context.dataIndex * 40 +
                                          context.datasetIndex * 30;
                                      }
                                      return delay;
                                    },
                                  },
                                  scales: {
                                    y: { 
                                      max: 110,
                                      ticks:{
                                      
                                        padding:30,
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
                                          return `${result}%\n(${EmpEvalute[dataIndex]}/${CountEmpInSection[dataIndex]})`;

                                        
                                      },
                                      font: {
                                        weight: "bold",
                                        size: 16,
                                      },
                                    },
                                    legend: {
                                      position: "bottom" as const,
                                      labels: {
                                        padding: 0
                                      },
                                      display: false,
                                    
                                      
                                    },
                              
                                  },
                                }}
                              
                              />

                    </div>
                  
                    <div className='w-full h-[450px] border border-gray shadow-2xl  p-8 grow rounded-xl' >
                    <p className="text-md font-bold">จำนวนพนักงานที่ทั้งหมด Core Level</p>
              
                    <Pie className="mt-10" data={data_pieChart} 
                    options={{
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
                              context.dataIndex * 40 +
                              context.datasetIndex * 30;
                          }
                          return delay;
                        },
                      },
                      
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        datalabels: {
                        
                          color: "white",
                          //@ts-ignore
                          formatter: function (value,context) {
                            const dataIndex = context.dataIndex;
                            const result = context.dataset.data[dataIndex];
                              return `${result}`;

                            
                          },
                          font: {
                            weight: "bold",
                            size: 12,
                          },
                        },
                        legend: {
                          position: "bottom" as const,
                          labels: {
                            padding: 15,
                  
                          },
                          display: true,
                        
                          
                        },
                  
                      },
                    }}
                    />

            </div>
        </div>


        {/* <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mt-10'> 
                    <div className='w-full h-[550px] border border-gray shadow-2xl p-8 sm:col-span-1 md:col-span-1 lg:col-span-3 rounded-xl' >

                    <Carousel animation="fade" navButtonsAlwaysVisible>
                      {dashboardBarChart?.map((item)=>{

                      return (<>
                        <p className="text-center text-xl font-bold">{item.dvcd}: {item.dvcd_name}</p>   
                
                        
                      
                          <div className="flex flex-row h-[400px]">
                            {item.countEmployee?.map((countEmp)=>{
                                
                                  const data = {
                                    labels: countEmp.cc,
                                    datasets:[
                                      { 
                                        
                                        label: 'จำนวนคนในแผนก',
                                        data:countEmp.totalEmployee,
                                        backgroundColor:'#0FA6F1',
                                        datalabels: {
                                          display: false // Enable labels for this dataset
                                      }
                                      
                                
                                      },
                                      {
                                        label: 'จำนวนคนที่ผ่านการอบรมครบ',
                                        data:countEmp.totalEmployeePass,
                                        backgroundColor:'#7DDA58',
                                        datalabels: {
                                          display: false // Enable labels for this dataset
                                      }
                                      
                                        
                                
                                      }
                                    ]
                                  }
                                
                                  const option:any = {
                                    indexAxis:'y',
                                    responsive: true,
                                
                                    interaction: {
                                      mode: "index" as const,
                                      intersect: true,
                                    },
                                    scale: {
                                      ticks: {
                                        precision: 0
                                      }
                                    }
                                  }


                                  return <>  

                                            <div className="w-full h-[500px]">

                                              <p className="text-md font-bold mt-10 mb-2">Core Level {countEmp.level}</p>
                                                    <Bar 
                                                    data={data}
                                                    options={option}
                                                    >
                                                          
                                                      </Bar>     

                                                                          
                                            </div>   
                                          </>
                                })}
                      
                      <div/>
                      </div>
                      
                      </>)

                      })} 
                    </Carousel>

                    </div>
        
                    <div className='w-full h-[550px] border border-gray shadow-2xl  p-8 grow rounded-xl' >
                    <p className="text-md font-bold">จำนวนพนักงานที่ประเมินแล้ว Core Level</p>
                    <Doughnut className="mt-10" data={data_donutChart} 
                    options={{
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
                              context.dataIndex * 40 +
                              context.datasetIndex * 30;
                          }
                          return delay;
                        },
                      },
                      
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        datalabels: {
                        
                          color: "white",
                          //@ts-ignore
                          formatter: function (value,context) {
                            const dataIndex = context.dataIndex;
                            const result = context.dataset.data[dataIndex];
                              return `${result}`;

                            
                          },
                          font: {
                            weight: "bold",
                            size: 12,
                          },
                        },
                        legend: {
                          position: "bottom" as const,
                          labels: {
                            padding: 15,
                  
                          },
                          display: true,
                        
                          
                        },
                  
                      },
                    }}
                    />
            </div>



        </div> */}
    </div>
  )}




       


     

       
      

      
    </>
  );
}

export default Dashboard;
