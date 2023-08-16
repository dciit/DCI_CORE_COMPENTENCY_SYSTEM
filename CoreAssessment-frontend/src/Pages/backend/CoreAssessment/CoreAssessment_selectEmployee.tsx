import {useState,useEffect} from 'react'
import SrvCoreAssessment from "../../../service/coreAssessment"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate  } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Typography } from '@mui/material';
import {position} from "../../../constant/authen.ts"


export interface IEmployee {
    code : string;
    name : string;
    surn : string;
    posit : string;
    grade:string;
    status: boolean;
  }
  


  const columns = [
    { id: "empImgae", label: "รูปภาพ" },
    { id: "empCode", label: "รหัสพนักงาน" },
    { id: "empName", label: "ชื่อ-นามสกุล" },
    { id: "empPosition", label: "ตำแหน่ง" },
    { id: "empAction", label: "Action" },
  
  ];


function CoreAssessment_selectEmployee() {
  let navigate = useNavigate(); 

  const dispatch = useDispatch();
  const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState);
    const [employee,setEmployee] = useState<IEmployee[]>([])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
  
    const handleChangePage = (newPage:any) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event:any) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    //const authenStore = useSelector((state:any) => state.authenReducer.userAuthenData);
    const POSITION:string = position
    useEffect(() => {
      if(POSITION == "GM"){
        dispatch({
          type: "PREVIOUS_TRACKING_STEP",
          payload:{...trackingStep,
            trackingCount:3,
            trackingDept:trackingStep.trackingDept,
            trackingSection:trackingStep.trackingSection,
            trackingGroup:trackingStep.trackingGroup,
            trackingLevel:trackingStep.trackingLevel,
            trackingEmpCode: ''
            } 
        
         })
      }else if(POSITION == "MG"){
        dispatch({
          type: "PREVIOUS_TRACKING_STEP",
          payload:{...trackingStep,
            trackingCount:2,
            trackingDept:trackingStep.trackingDept,
            trackingSection:trackingStep.trackingSection,
            trackingGroup:trackingStep.trackingGroup,
            trackingLevel:trackingStep.trackingLevel,
            trackingEmpCode: ''
            } 
        
         })
      }else{
        dispatch({
          type: "PREVIOUS_TRACKING_STEP",
          payload:{...trackingStep,
            trackingCount:1,
            trackingDept:trackingStep.trackingDept,
            trackingSection:trackingStep.trackingSection,
            trackingGroup:trackingStep.trackingGroup,
            trackingLevel:trackingStep.trackingLevel,
            trackingEmpCode: ''
            } 
        
         })
      }
   
    
        SrvCoreAssessment.getEmployee(trackingStep.trackingSection,trackingStep.trackingGroup,trackingStep.trackingLevel).then((res)=>{
            try{
                setEmployee(res.data)
             
            }catch(error){
              console.log(error)
            }
          })
     
    }, [])


    const CoreAssessment_selectEmployee = (code:string) =>{
      dispatch({
        type: "NEXT_TRACKING_STEP",
        payload:{...trackingStep,trackingEmpCode:code} 
      
       })
       
      navigate(`/backend/core-assessment/${trackingStep.trackingDept}/${trackingStep.trackingSection}/${trackingStep.trackingGroup}/${trackingStep.trackingLevel}/${code}`)
    }
    


  return (
    <>
    <Paper sx={{ width: "100%", overflow: "auto" ,mt:5}}>
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
      
              {employee.length > 0 ? (
                <>
                 {employee
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    
                     <TableCell><img src= {`http://dcidmc.dci.daikin.co.jp/PICTURE/${row.code}.JPG`} width={80} height={80} /></TableCell>
                     <TableCell>{row.code}</TableCell>
                     <TableCell>{row.name}</TableCell>
                     <TableCell>{row.posit}&nbsp;{parseInt(row.grade) == 0 ? "" : row.grade}</TableCell>
                     {!row.status ?  <TableCell><Button type='button' color="info" variant="contained" onClick={() => CoreAssessment_selectEmployee(row.code)}>ประเมิน</Button></TableCell> :
                     
                     <TableCell><Button type='button' color="info" variant="contained" disabled>ประเมิน</Button></TableCell>
                     
                     }
                   
                  
                  </TableRow>
                ))}
                </>
              ) : <Typography variant='h5' sx={{pt:5,pl:50}} >ไม่มีพนักงานในตำแหน่งนี้ !!!</Typography>}
             
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={employee.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default CoreAssessment_selectEmployee