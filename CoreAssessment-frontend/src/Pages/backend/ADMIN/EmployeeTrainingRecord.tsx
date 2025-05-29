import { useEffect, useState } from "react";
import { getTIS } from "../../../service/admin";
import Skeleton from '@mui/material/Skeleton';
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

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
function EmployeeTrainingRecord() {
  const [Dept] = useState<string[]>(['CORE LV 1','CORE LV 2','CORE LV 3','CORE LV 4','CORE LV 5']);
  const [LevelSelected, setLevelSelected] = useState<number>(0);
  const [label,setlabel] = useState<string[]>([])
  const [data,setdata] = useState<number[]>([])
  const [loadApi,setloadApi] = useState<Boolean>(false)

  useEffect(() => {
    initData(1)
  }, []);

  async function initData(level:number) {
    setloadApi(true)
    let res: any = await getTIS(level);
    setlabel(res.labelChart);
    setdata(res.dataChart)
    setloadApi(false)
  }

  const maxScaleValue = (LevelSelected + 1) == 1 ? 1500 : (LevelSelected + 1 == 2) ? 200 : (LevelSelected + 1 == 3) ? 100 : (LevelSelected + 1 == 4) ? 30 : (LevelSelected + 1 == 5) ? 30 : 0;
  let delayed:boolean;
  const data_barchart= {
      labels: label ,
      datasets: [
        {
          label: "จำนวนพนักงานที่อบรมแล้ว (คน)",
          data: data,
          // backgroundColor:"#00bfff",
          backgroundColor:"rgba(115, 186, 251, 0.64)",
          fill: true,
          borderRadius: 5,
         
        
        },
  
    
      
      ],
    };

  return (
    <>
        <div className="w-full flex-none items-center gap-2 bg-white border  rounded-lg select-none mt-2">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 bg-gray-50">
          <ul className="flex flex-wrap -mb-px cursor-pointer">
            {Dept.map((item: string, i: number) => (
              <div className="" onClick={() => setLevelSelected(i)}>
                <li>
                  <a className="inline-block p-2 border-b-2 border-transparent rounded-t-lg ">
                    <div
                      key={i}
                      onClick={() => initData(i+1)}
                      className={`px-4 py-3 min-w-[75px] text-center ${
                        LevelSelected == i
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
    {loadApi ? (
        <div className="p-4">
       
     <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4'>                    
          <div className="w-full h-[600px]" > <Skeleton variant="rounded"  height={550}/></div>
        </div>      
      </div> 
     
  ) : (
  <div className=" mt-2 p-2">
      
      <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4'> 
            <div className='w-full h-[600px] border border-gray shadow-2xl p-6 sm:col-span-1 md:col-span-1 lg:col-span-1 rounded-xl' >
            <p className="text-lg">{(LevelSelected + 1) == 1 ? 'Operator, Leader' : (LevelSelected + 1) == 2 ? 'Foreman, Technician, Staff' : (LevelSelected + 1) == 3 ? 'Engineer' : (LevelSelected + 1) == 4 ? 'Supervisor' : (LevelSelected + 1) == 5 ? 'Manager/Assitant Manager' : ''} </p>

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

                              max:  maxScaleValue,
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
                                  return `${result} คน`;

                                
                              },
                              font: {
                                weight: "bold",
                                size: 10,
                              },
                            },
                            legend: {
                              position: "top" as const,
                              labels: {
                                padding: 4
                              },
                              display: true,
                             
                              
                            },
                      
                          },
                        }}
                      
                      />

            </div>
      </div>
  
      </div>
  )}
     
  
    </>
  );
}

export default EmployeeTrainingRecord;
