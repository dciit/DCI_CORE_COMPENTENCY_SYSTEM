import { Bar } from "react-chartjs-2";
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
} from "chart.js";
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SrvDashboard from '../../service/dashboard'

ChartJS.register(
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export interface BarChart {
  level : number
  score : BarChartChild[]

}

export interface BarChartChild {
  score:number
  courseCode:string
}


function Dashboard() {

  const [dashboardBarChart,setdashboardBarChart] = useState<BarChart[]>([])

  useEffect(() => {

    SrvDashboard.getBarChart().then((res)=>{
      try{
        setdashboardBarChart(res.data)
        
       
      }catch(error){
        console.log(error)
      }
    })

  }, [])
  

  let data : any

  // const data:any = {
  //   labels: ["January", "February", "March", "April","M","awd"],
  //   datasets: [
  //     {
  //       type: "bar",
  //       label: "Bar Dataset",
  //       data: [10, 20, 30, 40,50,100],
  //       borderColor: "rgb(255, 99, 132)",
  //       backgroundColor: "rgba(255, 99, 132, 0.2)",
  //     },
  //     {
  //       type: "line",
  //       label: "Line Dataset",
  //       data: [80, 80, 80, 80,80],
  //       fill: false,
  //       borderColor: "rgb(54, 162, 235)",
  //     },
  //   ],
  
  // };

//   const options:any = {
//     responesive:true,
//     scales: {
//       x: {
//         grid: {
//           display: false
//         },
//         border:{
//           display:false
//         }
//       },
//       y: {
//         grid: {
//           display: false
//         },
//         border:{
//           display:false
//         },
//         ticks: {
//           display: false,
//         }
//       },

//     },
//     plugins: {
//       datalabels: {
//           anchor: 'end',
//           align: 'top',
//           formatter: Math.round,
//           font: {
//               weight: 'bold'
//           }
//       }
//   }
// }

  return (
    <>

      <Grid container spacing={2} sx={{mt:2}}>

        {dashboardBarChart.map((barchart,index)=>{
          
        
             data = {
              labels: barchart.score.map((item)=>item.courseCode),
              datasets: [
                {
                  type: "bar",
                  label: "คะแนน",
                  data: barchart.score.map((item) => item.score),
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                },
                {
                  type: "line",
                  label: "เป้าหมาย",
                  data: [80, 80, 80, 80, 80,80,80,80],
                  fill: false,
                  borderColor: "rgb(54, 162, 235)",
                },
              ],
            
            };
         
        
        

          return <>  <Grid item xs={6} >
                      <Typography variant="body1">LEVEL {index+1}</Typography>    
                        <Bar data={data} >                         
                      </Bar>
                    </Grid>
               
                  </>
        })}
      
    
      </Grid>
    </>
  );
}

export default Dashboard;
