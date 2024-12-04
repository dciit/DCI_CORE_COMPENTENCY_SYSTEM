// import React from 'react'
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useEffect, useState } from "react";

import "dayjs/locale/en-gb";
import {
  complianceTrainingInfoModal,
} from "../../../../Model/Elearning/Elearning";
import { getDataAttendance } from "../../../../service/ComplianceTrainingRecored";
import { useSelector } from "react-redux";
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import FileDownloadIcon from "@mui/icons-material/FileDownload";


type EmployeeResult = {
 
  no: string;
  code: string;
  name: string;
  position:string;
  result: string;
};

function CCAttendanceTableReport({ openDialog, cc, onClose }: any) {
  const [getData, setDatas] = useState<complianceTrainingInfoModal[]>([]);
  const [data, setdata] = useState<EmployeeResult[]>([]);
  const ccSection = useSelector((state: any) => state.ccAttendanceRecordStateReducer.ccSectionState.section);

  useEffect(() => {
    if (openDialog == true) {
      initData(cc);
    }
  }, [openDialog]);

  async function initData(cc: string) {
    let tempDept: any = await getDataAttendance(cc, ccSection);
    setDatas(tempDept);
    setdata(tempDept[0].result.employeeList);
  }

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename:cc + "_" + getData[0]?.section,
  });

  const columns = useMemo<MRT_ColumnDef<EmployeeResult>[]>(
    () => [
    

      {
        accessorKey: 'code',
        header: 'รหัส',
        size: 1,
      },
      {
        accessorKey: 'name',
        header: 'ชื่อ-นามสกุล',
        size: 100,
      },
      {
        accessorKey: 'position',
        header: 'ตำแหน่ง',
        size: 20,
      },
      {
        accessorKey: 'result',
        header: 'Result',
        size: 20,
        Cell: ({ renderedCellValue}) => {
          return (
            <>
              <span
                className={
                  renderedCellValue == "PASS" 
                    ? "text-green-700/80 font-bold"
                    : "text-red-600/80 font-bold"
                }
              >
               
                  {renderedCellValue}
               
          
              </span>
            
            </>
          );
        },
       
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowNumbers: true, 
    paginationDisplayMode: 'pages',
    initialState: { density: 'compact' },
    //@ts-ignore
    renderTopToolbarCustomActions: ({ table }) => (
     
        <Button
          variant="contained"
          sx={{ backgroundColor: "green" }}
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export
        </Button>
   
     
    ),
  
 
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };


  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"><p className="text-2xl mb-2">{getData[0]?.section_cd}: {getData[0]?.section}</p></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: "6px" }}>
          <table className="tbAdminMain w-full ">
            <tr className="text-md bg-gray-200 text-black">
              <th className="w-[40%]">จำนวนพนักงานในหน่วยงาน</th>
              <th>จำนวนที่ต้องเข้าเรียน/หลักสูตร/ปี</th>
              <th>หลักสูตร</th>
              <th>{cc}</th>
            </tr>
            <tbody>
              {getData.map((item: complianceTrainingInfoModal) => (
                <>
                  <tr className="text-black">
                    <td rowSpan={2} className="text-center">{item.result.totalEmployee}</td>
                    <td rowSpan={2} className="text-center">{item.result.totalAttendanceExpect}</td>

                    <td className="text-center text-sm font-bold">เข้าเรียน</td>
                    <td className="text-center ">{item.result.totalEmployeeLearing}</td>
                  </tr>

                  <tr>
                    <td className="text-center text-sm font-bold text-black">คิดเป็น%</td>
                    <td className={`text-center text-sm text-black ${item.result.percentAttendance > 25 ? 'bg-green-300' : 'bg-red-300'}`}>{item.result.percentAttendance}%</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          {/* <table className="tbAdminMain w-full text-sm bg-gray-100/80">
            <tr className="bg-gray-200/60 text-black">
              <th>ลำดับ</th>
              <th>รหัส</th>
              <th>ชื่อ-นามสกุล</th>
              <th>ตำแหน่ง</th>
              <th>Result</th>
            </tr>
            <tbody>
              {typeof getData[0]?.result.employeeList != "undefined" &&
                getData[0]?.result.employeeList.map(
                  (emp: employeeList, i: number) => (
                    <>
                      <tr>
                        <td className="text-center p-1 w-[7%]">{i + 1}</td>
                        <td className="text-left p-1 w-[15%]">{emp.code}</td>
                        <td className="text-left p-1 w-[40%]">
                          {emp.name}
                        </td>
                        <td className="text-left p-1 w-[10%]">
                          {emp.position}
                        </td>
                        <td
                          className={` text-left p-1 w-[20%] text-black ${
                            emp.result == "PASS"
                              ? "bg-green-600/80"
                              : "bg-red-500/80"
                          }`}
                        >
                          {emp.result}
                        </td>
                      </tr>
                    </>
                  )
                )}
            </tbody>
          </table> */}
          <MaterialReactTable table={table} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          color="error"
          variant="contained"
          onClick={onClose}
          autoFocus
        >
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CCAttendanceTableReport;
