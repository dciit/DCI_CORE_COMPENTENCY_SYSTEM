
import {useState,useEffect} from 'react'
import SrvCoreAssessmentList from "../../service/EmployeeList.ts"
import { useSelector } from "react-redux";
// import { useNavigate  } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from '@mui/material';
import * as dayjs from 'dayjs'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { position } from "../../constant/authen.ts";

const columns = [
  { id: "empImgae", label: "รูปภาพ" },
  // { id: "empCoreLevel", label: "CoreLevel" },
  { id: "empCode", label: "รหัส" },
  { id: "empName", label: "ชื่อ-นามสกุล" },
  { id: "empPosition", label: "ตำแหน่ง" },
  { id: "empPosition", label: "หน่วยงาน" },


  { id: "EvaluteBy", label: "ผู้ประเมิน" },
  { id: "EvaluteDate", label: "วันที่ประเมิน" },
  { id: "empScore", label: "คะแนน" },
  { id: "empStatus", label: "สถานะ" },
  { id: "empStatus", lable: "สถานะ"},
  { id: "action", label: "" },

];


export interface AssessmentList {
  evaluteYear:string;
  empCode:string;
  name:string;
  posit:string;
  dept:string;
  dvName:string;
  coreLevel:string;
  scroce:string;
  evaluteBy:string
  evaluteDate:string;
  approveStatus : string
}



function ListAssessment() {
  let navigate = useNavigate(); 
  const dispatch = useDispatch();

  //const dvcd:string = JSON.parse(user_info)[0].DEPT_CD



  //const section:string = "11100"
  // const dispatch = useDispatch();
    const positionData = useSelector((state:any) => state.authenStateReducer.userAuthenData);
    const [assessmentList,setassessmentList] = useState<AssessmentList[]>([])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);


    const handleChangePage = (newPage:any) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event:any) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    useEffect(() => {
      

      dispatch({
        type: "RESET_DASHBOARD_EMP_PAGE",
    
      
       })

      SrvCoreAssessmentList.getAssessmentList(positionData.position,positionData.position_number).then((res)=>{
            try{
              setassessmentList(res.data)
             
            }catch(error){
              console.log(error)
            }
          })
     
    }, [])

    const dashBoard =(level:string,empcode:string,position:string,year:string,statusApprove:string) =>{
      dispatch({
        type: "OPEN_DASHBOARD_EMP_PAGE",
        payload:{
          level:level,
          empcode:empcode,
          position:position,
          year:year,
          statusApprove:statusApprove}    
       })

      navigate(`/backend/core-assessmentList/${empcode}`);

    }


  return (
    <>
   <Typography variant="h5"sx={{fontWeight:'bold'}}>รายชื่อผู้ที่ได้รับการประเมินแล้ว</Typography>

    <Paper sx={{ width: "100%", overflow: "auto" ,mt:3}}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    style={{ fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {assessmentList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    
                     <TableCell><img src= {`http://dcidmc.dci.daikin.co.jp/PICTURE/${row.empCode}.JPG`} width={80} height={80} /></TableCell>
                     {/* <TableCell>{row.coreLevel}</TableCell> */}
                     <TableCell>{row.empCode}</TableCell>
                     <TableCell>{row.name}</TableCell>
                     <TableCell>{row.posit}</TableCell>
                     <TableCell>{row.dvName}</TableCell>
                 
                
                     <TableCell>{row.evaluteBy}</TableCell>
                     <TableCell>{dayjs(row.evaluteDate).format("DD/MM/YYYY")}</TableCell>
                     <TableCell>{row.scroce}%</TableCell>
                     {parseInt(row.scroce) >= 80 ? 
                      <TableCell><Box sx={{ bgcolor: 'success.main', color: 'warning.contrastText', p: 1 }}>ผ่าน</Box></TableCell> :
                      <TableCell><Box sx={{ bgcolor: 'error.main', color: 'warning.contrastText', p: 1 }}>ไม่ผ่าน</Box></TableCell> 
                    }

                     {row.approveStatus == "pendding" ? 
                      <TableCell><Box sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', p: 1, }}>รอ Approve</Box></TableCell> :
                      <TableCell><Box sx={{ bgcolor: 'success.main', color: 'warning.contrastText', p: 1 }}>Approve แล้ว</Box></TableCell> 
                    }
                      <TableCell><Button type='button' color="info" variant="contained" endIcon={<SearchOutlinedIcon />} onClick={() => dashBoard(row.coreLevel,row.empCode,row.posit,dayjs(row.evaluteDate).format("YYYY"),row.approveStatus)}>ข้อมูลการประเมิน</Button></TableCell>
                  
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={assessmentList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default ListAssessment