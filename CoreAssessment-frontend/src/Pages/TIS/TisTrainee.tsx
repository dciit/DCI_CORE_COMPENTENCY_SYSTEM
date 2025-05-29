//@ts-nocheck
import React, { useEffect } from "react";
import {  getTisTrainee } from "../../service/Tis";
import { TISSchedule, TISTrainee } from "../../Model/TIS/TIS";
import moment from "moment";
import dayjs from "dayjs";
import { Button, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';



function TisTrainee() {

  const [data, setData] = React.useState<TISTrainee[]>([]);
  const [loadAPI,setloadAPI] = React.useState<boolean>(false);
  

   const payload = useSelector((state:any) => state.trainingScheduleStateReducer.trainingScheduleState);
  

  useEffect(() => {
    initCalendar();
  }, []);

  const initCalendar = async () => {
    setloadAPI(true);
    let tisTrainee: TISTrainee[] = await getTisTrainee(payload.stDate,payload.enDate,payload.cc);
   
    setData(tisTrainee);
    setloadAPI(false);

  
  };

  const columns = useMemo<MRT_ColumnDef<TISTrainee>[]>(
    () => [
    

      {
        accessorKey: 'dept',
        header: 'Dept',
        size: 1,
      },
      {
        accessorKey: 'sect',
        header: 'Section',
        size: 100,
      },
      {
        accessorKey: 'grp',
        header: 'Group',
        size: 20,
      },
    
      {
        accessorKey: 'empCode',
        header: 'รหัสพนักงาน',
        size: 20,
      },
     
      {
        accessorKey: 'empName',
        header: 'ชื่อ-นามสกุล',
        size: 20,
      },

      {
        accessorKey: 'posit',
        header: 'ตำแหน่ง',
        size: 20,
      },
     
     
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowNumbers: true, 
    paginationDisplayMode: 'pages',
    initialState: { density: 'compact'  },
    
    //@ts-ignore
 
  
 
  });

  

 
  return (
    <>
    
      <div className="flex flex-col justify-center items-center p-10 gap-6">
        <div className="text-4xl"> <p>รายชื่อผู้เข้าอบรมหลักสูตร {payload.cc} ประจำวันที่ ({payload.stDate})</p></div>
        {loadAPI ? <div className="flex flex-col gap-8 items-center justify-center align-middle mt-20"><CircularProgress size="5rem" />กำลังโหลดข้อมูล...</div> : (
                <MaterialReactTable  table={table} />

        )}
      </div>
      
    </>
  );
}

export default TisTrainee;
