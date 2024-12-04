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
    PolarAreaController
  } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin
import PersonIcon from '@mui/icons-material/Person';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useState } from 'react';
import { getDashboard } from '../../../service/admin';
import { Bar, Doughnut } from 'react-chartjs-2';
import Skeleton from '@mui/material/Skeleton';

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
    Filler,
    PolarAreaController
  );

 

function AdminDashboard() {

    const [loadApi,setloadApi] = useState<Boolean>(false)

    // bar chart
    const [labelsBarChart, setlabelsBarChart] = useState<string[]>([]);
    const [EmpEvalute, setEmpEvalute] = useState<number[]>([]);
    const [CountEmpInSection,setCountEmpInSection] = useState<number[]>([]);
    const [EmpEvalutePercent, setEmpEvalutePercent] = useState<number[]>([]);
 

    // donut chart
    const [labelsDonutChart, setlabelsDonutChart] = useState<string[]>([]);
    const [dataDonutChart, setdataDonutChart] = useState<number[]>([]);


    // card

    const [empNotEvaluted,setempNotEvaluted] = useState<number>(0)
    const [empWaitConfirm,setempWaitConfirm] = useState<number>(0)
    const [empWaitApprove,setempWaitApprove] = useState<number>(0)
    const [empApprove,setempApprove] = useState<number>(0)




    useEffect(() => {
        
        initDataDashboard()
     
    }, [])

    const initDataDashboard = async () => {
        setloadApi(true)
        const res: any = await getDashboard()

        
        // card
        setempNotEvaluted(res.count_empNotEvaluted)
        setempWaitConfirm(res.count_empWaitConfirm)
        setempWaitApprove(res.count_empWaitApprove)
        setempApprove(res.count_empApprove)

        // bar chart
        setEmpEvalutePercent(res.dataChart)
        setlabelsBarChart(res.labelChart);
        setEmpEvalute(res.countEmployeeIsEvaluted)
        setCountEmpInSection(res.countTotalEmployeeInSection)

        // donut chart
        setlabelsDonutChart(res.coreLevel)
        setdataDonutChart(res.totalEmp)

        setloadApi(false)


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

      const data_donutChart= {
        labels: labelsDonutChart,
        datasets: [{
          label: 'จำนวนคนที่ประเมิน',
          data: dataDonutChart,
          backgroundColor: [
            'rgb(24, 119, 242)',
            'rgb(255, 171, 0)',
            'rgb(81, 25, 183)',
            'rgb(255, 86, 48)'
          ],
          hoverOffset: 20
        }]
      };

  return (
    <>
  {loadApi ? (
        <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
                    
                        <div> <Skeleton variant="rounded"  height={200}/></div>
                        <div> <Skeleton variant="rounded" height={200}/></div>
                        <div> <Skeleton variant="rounded" height={200}/></div>
                        <div> <Skeleton variant="rounded" height={200}/></div>
  
        </div>
     <br />
     <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4'>                    
          <div className="w-full h-[600px] sm:col-span-1 md:col-span-1 lg:col-span-1" > <Skeleton variant="rounded"  height={550}/></div>
          <div className='w-full h-[600px]' ><Skeleton variant="rounded" height={550}/></div> 
        </div>      
      </div> 
      /* <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4'>                    
          <div className="w-full h-[600px] sm:col-span-1 md:col-span-1 lg:col-span-3" > <Skeleton variant="rounded"  height={550}/></div>
          <div className='w-full h-[600px]' ><Skeleton variant="rounded" height={550}/></div> 
        </div>      
      </div>   */
  ) : (
    <div className='p-4'>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className='bg-red-300/90 p-10 rounded-xl text-white shadow-lg'>
            <div className='flex flex-row justify-between'>
                <div className='w-[80%]'>
                    <div className='font-bold text-3xl text-red-800'>{empNotEvaluted.toLocaleString()} คน</div> <br />
                    <div className='text-lg text-red-800'>จำนวนพนักงานไม่ได้ประเมิน</div>
                </div>
                <div className='w-[20%] text-end'>
                        <div className='z-0 absolute border-white border-2  
                        flex h-20 w-20 items-center justify-center rounded-full bg-red-500'>
                            <PersonIcon style={{width:'50px',height:'50px'}}/>
                        </div>

                </div>
            </div>
        </div>
        <div className='bg-amber-200  p-10 rounded-md text-white shadow-lg'>
     
        <div className='flex flex-row justify-between'>
            <div className='w-[80%]'>
                    <div className='font-bold text-3xl text-orange-800'>{empWaitConfirm.toLocaleString()}  คน</div> <br />
                    <div className='text-lg text-orange-800'>จำนวนพนักงานที่รอการ Confirm</div>
                </div>
                <div className='w-[20%] text-end'>
                <div className='z-0 absolute border-white border-2  
                        flex h-20 w-20 items-center justify-center rounded-full bg-amber-500'>
                            <AssignmentTurnedInIcon style={{width:'50px',height:'50px'}}/>
                        </div>
                </div>
            </div>
        
        </div>
        <div className='bg-blue-200  p-10 rounded-md  shadow-lg'>

            <div className='flex flex-row justify-between'>
       
                    <div className='w-[80%] text-start text-white'>
                        <div className='font-bold text-3xl text-blue-800'>{empWaitApprove.toLocaleString()}  คน</div><br />
                        <div className='text-lg text-blue-800'>จำนวนพนักงานที่รอการ Approve</div>
                    </div>
                    <div className='w-[20%] '>
                        <div className='z-0 absolute border-white border-2  
                                flex h-20 w-20 items-center justify-center rounded-full bg-blue-500'>
                                    <PendingActionsIcon style={{width:'50px',height:'50px',color:'white'}}/>
                                </div>
                    </div>
                
                </div>
        </div>
        <div className='bg-green-200 border border-1 black p-10 rounded-md  shadow-xl'>

        <div className='flex flex-row justify-between'>
                <div className='w-[80%] text-white'>
                    <div className='font-bold text-3xl text-green-900'>{empApprove.toLocaleString()}  คน</div> <br />
                    <div className='text-lg text-green-800'>จำนวนพนักงานที่ประเมินแล้ว Finish</div>
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

   
    <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-6'> 
            <div className='w-full h-[600px] border border-gray shadow-2xl p-6 sm:col-span-1 md:col-span-1 lg:col-span-1 rounded-xl' >
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
                              
                                padding:0,
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
                                size: 10,
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
            <div className='w-full h-[600px] border border-gray shadow-2xl  p-6 grow rounded-xl' >
            <p className="text-xl font-bold">จำนวนพนักงานที่ประเมิน Core Level</p>
            <Doughnut data={data_donutChart} 
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
              // scales: {
              //   y: { 
              //     ticks:{
              //       padding:50
              //     }
              //   },
              // },
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  // anchor: "end",
                  // align: "end",
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
            /></div>
    </div>

    
    </div>
  )}




  
    </>
  )
}

export default AdminDashboard