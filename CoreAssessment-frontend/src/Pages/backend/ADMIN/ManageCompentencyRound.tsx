import {useState,useEffect} from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SrvAdmin from "../../../service/admin.ts"
import { compentencyRoundREV } from "../../../Model/Admin/admin.ts";
import { Button, ButtonGroup, Grid, Typography } from "@mui/material";
import dayjs from "dayjs"
import AddIcon from '@mui/icons-material/Add';
import AddCompentencyRound from "../Modal/ADMIN-MODAL/AddCompentencyRound.tsx";
import EditIcon from "@mui/icons-material/Edit";
import EditCompentencyRound from "../Modal/ADMIN-MODAL/EditCompentencyRound.tsx";

const columns = [
    { id: "empImgae", label: "CODE" },
    { id: "empCode", label: "Start Date" },
    { id: "empName", label: "End Date" },
    { id: "empAction", label: "Status" },
    { id: "Action", label: "Action" }
  
  ];



function ManageCompentencyRound() {
  // const [value, setValue] = React.useState<DateRange<Dayjs>>([
  //     dayjs('2022-04-17T15:30'),
  //     dayjs('2022-04-21T18:30'),
  //   ]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [roundCompentencyREV,setroundCompentencyREV] = useState<compentencyRoundREV[]>([])
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setopenDialogEdit] = useState(false);
    const [code , setcode] = useState("")

    useEffect(() => {
      
        getDataCompentencyRound();
      
    }, [])


     
  useEffect(() =>{
    getDataCompentencyRound()
  },[openDialogEdit])

    
   
    
      const closeDialog = () => {
        setOpenDialog(false)
        setopenDialogEdit(false);
      };


      const openDiglogEdit = (_code: any) => {
        
        setcode(_code)
        setopenDialogEdit(true);
      };

    async function getDataCompentencyRound() {
    
        const res: any = await  SrvAdmin.getCompentencyRound()
        try {
    
        
            
            setroundCompentencyREV(res)

    
           
    
    
        } catch (error) {
          console.log(error);
        }
      }
    //@ts-ignore
    const handleChangePage = (newPage:any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
  return (
    <>
    <div className="p-4">
      <Grid container spacing={2} sx={{mt:2}}>
        <Grid item sm={1} xs={12} md={6} xl={4}></Grid>
        <Grid item sm={1} xs={12} md={6} xl={4}></Grid>

        <Grid item sm={10} xs={3} md={4} xl={4} sx={{textAlign:"end"}}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              type="button"
              color="success"
              variant="contained"
              sx={{color:'white'}}
              onClick={() => setOpenDialog(true)}
              endIcon={<AddIcon/>}
            >
              เพิ่มรอบการประเมิน
            </Button>

        
          </ButtonGroup>
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", overflow: "auto",mt:2 }}>
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

              {roundCompentencyREV.length > 0 ? (
                <>
                 {roundCompentencyREV
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                  >
                    
                     <TableCell>{row.code}</TableCell>
                      <TableCell>{dayjs(row.stDate).format("DD/MM/YYYY")} <br /> {dayjs(row.stDate).format("HH:mm")}</TableCell>
                      <TableCell>{dayjs(row.enDate).format("DD/MM/YYYY")}  <br /> {dayjs(row.enDate).format("HH:mm")}</TableCell>
                      <TableCell >{String(row.status) == "true" ? "ACTIVE" : "NON-ACTIVE"}</TableCell>
                      <TableCell >      <Button
                              type="button"
                              color="info"
                              variant="contained"
                              onClick={() => openDiglogEdit(row.code)}
                            >
                              <EditIcon />
                            </Button>
                      </TableCell>


                     {/* {!row.status ?  <TableCell><Button type='button' color="info" variant="contained" onClick={() => CoreAssessment_selectEmployee(row.code,row.status_2)}>ประเมิน</Button></TableCell> :
                     
                     <TableCell><Button type='button' color="info" variant="contained" disabled>ประเมินแล้ว</Button></TableCell>
                     
                     }
                    */}
                  
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
          count={roundCompentencyREV.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <AddCompentencyRound openDialog={openDialog} onClose={closeDialog}/>
      <EditCompentencyRound openDialog={openDialogEdit} codeRev={code} onClose={closeDialog}/>

      </div>
    </>
  );
}

export default ManageCompentencyRound;
