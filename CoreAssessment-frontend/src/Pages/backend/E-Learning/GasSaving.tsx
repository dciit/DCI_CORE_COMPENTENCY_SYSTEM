import { useState } from 'react'
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import SearchIcon from '@mui/icons-material/Search';

  
  import { Bar } from "react-chartjs-2";
  import { useMemo } from 'react';
  import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
  } from 'material-react-table';
  
  //example data type
  type Person = {
   
    Month: string;
    Consumption: string;
    
  };
  const data: Person[] = [
    {
      Month: 'January',
      Consumption: '60,000',
  
    },
    {
     
      Month: 'February',
      Consumption: '52,000',
    },
    {
     
      Month: 'March',
      Consumption: '55,000',
    },
    {
      
      
      Month: 'April',
      Consumption: '53,000',
    },
    {
      
      Month: 'May',
      Consumption: '51,000',
    },
  ];

  const option: any = {
    options: {
      plugins: {
        stacked100: {
          enable: true,
          replaceTooltipLabel: false,
        },
      },
    },
    scale: {
      x:{
        stacked:true,
      },
      y: {
        beginAtZero: true,
      },
      ticks: {
        precision: 0,
      },
    },
  };


function GasSaving() {
    const [labels] = useState<string[]>(["Jan","Feb","Mar","Apr","May"]);

    // const data_donut = {
    //   labels: ["NG"],
    //   datasets: [
    //     {
    //       label: ['Jan','Feb','Mar'],
    //       data: [1000,2000,3000,4000,5000],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)',
    //       ],
    //       borderColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)',
    //       ],
    //       borderWidth: 1,
    //     },
    //   ],
    // };

    const columns = useMemo<MRT_ColumnDef<Person>[]>(
      () => [
        {
          accessorKey: 'Month', //access nested data with dot notation
          header: 'Month',
          size: 150,
        },
        {
          accessorKey: 'Consumption',
          header: 'ปริมาณที่ใช้ก็าซ NG (m3)',
          size: 150,
        },
       
      ],
      [],
    );

    const table = useMaterialReactTable({
      columns,
      data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

      const data_line_section1 = {
        labels: labels,
        datasets: [
          {
            label: "NG (m3)",
            data: [7200,7000,6800,7000,3000],
            backgroundColor: "blue",
            order: 3
          },
          {
            label: 'Actual',
            data: [9000,8000,6000,4000,3000],
            borderColor: "red",
            backgroundColor: "white",
            type: 'line',
            order: 2
          },

          {
            label: 'Average',
            data: [3000,4330,5032,6320,7230],
            borderColor: "orange",
            backgroundColor: "white",
            type: 'line',
            order:1
          },

          {
            label: 'Taget',
            data: [2000,330,1032,2320,3230],
            borderColor: "green",
            backgroundColor: "white",
            type: 'line',
            order:0
          }
      
        ],
      };

  return (
    <>
     <div className="bg-slate-300 text-center p-6">
              <p className="text-5xl">
                GAS SAVER SAVING MONITORING
              </p>
    </div>

      <div className='bg-gray-100 p-2'>
            <div className='flex justify-start gap-[30px] p-6'>
                <div>  
                    <FormControl className="m-2 min-w-[60%]">                
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        sx={{width:'150px'}}>
                        <MenuItem value={"306"}>รายเดือน</MenuItem>                
                        </Select>
                    </FormControl>
                </div>
                <div>  
                    <FormControl className="m-2 min-w-[60%]">                
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        sx={{width:'200px'}}>
                        <MenuItem value={"306"} selected>Factory 1</MenuItem>
                                       
                        </Select>
                    </FormControl>
                </div>
                <div>
                <FormControl className="m-2 min-w-[60%]">                
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        sx={{width:'200px'}}>
                        <MenuItem value={"306"} selected>Final Line Oven</MenuItem>
                                       
                        </Select>
                    </FormControl>
                </div>
            

                <div>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SearchIcon />}
                    sx={{ width: "150px", height: "50px", padding: "28px" }}
                    
                    >
                    ค้นหา
                    </Button>
                </div>

            </div>

      </div>

      <div className="flex md:flex-row flex-col justify-center divide-x divide-black border  border-black">
              <div className="w-full p-5 bg-orange-50 ">
            
                <Bar data={data_line_section1} options={option}></Bar>

              </div>
              <div className="w-full md:w-1/2 p-5 bg-yellow-50">
              <p className="text-xl mb-4 italic font-thin">
                    ยอดสะสม Nartual Gas (NG) รายเดือน
                </p>
                <MaterialReactTable table={table} />
              </div>
            </div>
    
    </>
  )
}

export default GasSaving