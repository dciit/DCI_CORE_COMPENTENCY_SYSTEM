import { useState, useEffect } from "react";
import SrvCoreAssessmentList from "../../service/employeeList";
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
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alpha } from "@mui/material/styles";
import Swal from 'sweetalert2';
import counterBadge from '../../service/counterBadge';
import moment from 'moment'
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const columns = [
  { id: "empImgae", label: "" },
  { id: "empRev", label: "รอบการประเมิน" },
  { id: "empCode", label: "CODE" },
  { id: "empName", label: "NAME" },
  { id: "empPosition", label: "Position" },
  { id: "empDVCD", label: "DVCD" },
  { id: "EvaluteBy", label: "Assessor By"},
  { id: "EvalutedStatus", label: "Evaluted Status" },
  { id: "ApproveBy", label: "Approve By" },
  { id: "ApproveStatus", label: "Approve Status" },

  { id: "action", label: "Action" },
];


export interface checkboxDataSend {
  evaluteYear: string;
  empCode: string;
  coreLevel: string; 
  evaluteStatus:string;
  approveStatus:String;
  approveBy:string;

}


export interface AssessmentList {
  evaluteYear: string;
  empCode: string;
  name: string;
  posit: string;
  dept: string;
  dvName: string;
  coreLevel: string;
  scroce: string;
  evaluteBy: string;
  evaluteDate: string;
  evaluteStatus: string;
  approveBy: string;
  approveDate: string;
  approveStatus: string;
}

function EnhancedTableHead(props: any) {
  const { onSelectAllClick, numSelected, rowCount } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        
        {columns.map((headCell) => (
          <TableCell key={headCell.id} style={{ fontWeight: "bold" }}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function ListApprove() {

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const positionData = useSelector((state:any) => state.authenStateReducer.userAuthenData);
  const counterBadgeStep = useSelector((state:any) => state.counterBagdeStateReducer.counterBadgeState);


  const [assessmentList, setassessmentList] = useState<AssessmentList[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [selected, setSelected] = useState<readonly string[]>([]);
  const [selectedList, setSelectedList] = useState<checkboxDataSend[]>([]);

  useEffect(() => {
    dispatch({
      type: "RESET_DASHBOARD_EMP_PAGE",
    });

 
    SrvCoreAssessmentList.getApproveList(
      positionData.empcode,
      positionData.position,
    ).then((res) => {
      try {
        setassessmentList(res.data);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);


  //@ts-ignore
  const handleChangePage = (event: unknown,newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isSelected = (evaluteYear:string,empcode: string,coreLevel:string) => selected.indexOf(evaluteYear) !== -1 || 
                                                                              selected.indexOf(empcode) !== -1 ||
                                                                              selected.indexOf(coreLevel) !== -1

  const handleCheckboxClick = (event: React.MouseEvent<unknown>,evaluteYear:string,empcode: string,coreLevel:string,evalutedStatus:string,approveStatus:string) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(empcode);

    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, empcode);
      setSelectedList([...selectedList,{
                      evaluteYear: evaluteYear,
                      empCode: empcode,
                      coreLevel: coreLevel,
                      evaluteStatus:evalutedStatus,
                      approveBy:positionData.empcode,
                      approveStatus:approveStatus
      }]); 

      

    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      setSelectedList(selectedList.filter((obj=>obj.empCode !== empcode)))
      
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      setSelectedList(selectedList.filter((obj=>obj.empCode !== empcode)))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );

      setSelectedList(selectedList.filter((obj) => obj.empCode !== empcode));

    }


   
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = assessmentList.map((n) => n.empCode);
      setSelected(newSelected);
  

      // const newSelectedList : any =  assessmentList.map((n) => n.approveStatus !== 'Approve' ? {...n,approveBy:positionData.empcode} : []));
      
      
      let changeObj:any = []

      assessmentList.map((x) => {
        if(x.approveStatus !== 'Approve'){
          changeObj.push({...x,nameIncharge:positionData.name,approveBy:positionData.empcode})
        }
      })

      setSelectedList(changeObj)

      
      return;
    }
    setSelected([]);
    setSelectedList([])
  };



  const dashBoard = (
    level: string,
    empcode: string,
    position: string,
    year: string,
    statusApprove: string
  ) => {
    dispatch({
      type: "OPEN_DASHBOARD_EMP_PAGE",
      payload: {
        level: level,
        empcode: empcode,
        position: position,
        year: year,
        statusApprove: statusApprove,
      },
    });

    navigate(`/CASAPP/backend/core-assessmentList-report/${empcode}`);
  };
  async function changeStatusApprove() {
    const res = await SrvCoreAssessmentList.changeStatusApprove(selectedList)
        try{
             
          if(res.data.statusConfirm){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'ทำการอนุมัติเรียบร้อย',
              showConfirmButton: false,
              timer: 1500
            })

            SrvCoreAssessmentList.getApproveList(
              positionData.empcode,
              positionData.position,
            ).then((res) => {
              try {
                setassessmentList(res.data);
                getCounterBadge(positionData.empcode)
                setSelected([]);
                setSelectedList([])
             
              } catch (error) {
                console.log(error);
              }
            });
          }
            
            //getCounterBadge()


        }catch (error) {
            console.log(error);
        }
        
           
  }

  async function getCounterBadge(empcode:string) {

    const res:any = await counterBadge.getBadgeDev(empcode)
        try{
            dispatch({
                type: "GET_COUNTER",
                payload:{...counterBadgeStep,counterBadge_EVALUTED:res[0],counterBadge_APPROVE:res[1] } 
                
             })

        }catch (error) {
            console.log(error);
        }
        
           
  }

    
  
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        รายชื่อพนักงานที่รอการอนุมัติ 
      </Typography>
      <Box>
      <Grid container spacing={2}>
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
              onClick={() => changeStatusApprove()}
              disabled={selectedList.length > 0 ? false : true}
              endIcon={<CheckBoxIcon/>}
            >
              Approve
            </Button>

        
          </ButtonGroup>
        </Grid>
      </Grid>
      </Box>
      {/* {JSON.stringify(selectedList)} */}
      <Paper sx={{ width: "100%", overflow: "auto", mt: 3 }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table" className="tbConfirm">
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={assessmentList.length}
            />
            <TableBody>
    
              {assessmentList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.evaluteYear,row.empCode,row.coreLevel);
                  return (
                    <TableRow
                      key={index}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      className={index % 2 == 0 ? "bg-blue-100" : "bg-white"} 
                    >
                  
                  {row.approveStatus === "Approve"  ? (
                              <>
                                <TableCell></TableCell>
                              </>
                            ) : (
                              <>
                                    <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) =>
                            handleCheckboxClick(event, row.evaluteYear,row.empCode,row.coreLevel,row.evaluteStatus,row.approveStatus)
                          }
                        />
                      </TableCell>
                              </>
                            )}

                      <TableCell>
                        <img
                          src={`http://dcidmc.dci.daikin.co.jp/PICTURE/${row.empCode.trim()}.JPG`}
                          width={60}
                          height={60}
                        />
                      </TableCell>
                      <TableCell>{row.evaluteYear}</TableCell>
                      <TableCell>{row.empCode}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.posit}</TableCell>
                      <TableCell>{row.dvName}</TableCell>
                     

                      <TableCell>{row.evaluteBy} <br /> {moment(row.evaluteDate).format("DD/MM/YYYY ")}</TableCell>
                      {/* <TableCell>
                        {moment(row.evaluteDate.substring(0,10)).format("DD/MM/YYYY")}
                      </TableCell> */}
                 
                      <TableCell>{row.evaluteStatus}</TableCell>
                      <TableCell>{
                                  row.approveBy == "" || moment(row.approveDate).format("DD/MM/YYYY") == "01/01/0001"? 

                                (<>-</>) : (<>{row.approveBy} <br />  {moment(row.approveDate).format("DD/MM/YYYY")}</>)
                                
                                } </TableCell>

                      <TableCell>{row.approveStatus == "" ? "-" : row.approveStatus }</TableCell>

                      <TableCell>
                        <Button
                          type="button"
                          color="info"
                          variant="contained"
                          endIcon={<SearchOutlinedIcon />}
                          onClick={() =>
                            dashBoard(
                              row.coreLevel,
                              row.empCode,
                              row.posit,
                              row.evaluteYear,
                              row.approveStatus
                            )
                          }
                        >
                          ข้อมูลการประเมิน
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      


      {selected.length > 0  ? (
        <Paper sx={{ width: "100%", overflow: "auto" ,mt:5}}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        > <Typography
        sx={{ flex: "1 1 " }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        ทั้งหมด {selectedList.filter(x=>x.approveStatus != "Approve").length} รายการ
      </Typography>
      {/* <Tooltip title="ประเมิน">
              <Button
                type="button"
                // style={{backgroundColor:'black',fontWeight:'bold'}}
                onClick={() =>
                  changeStatusApprove()
                }
                startIcon={<SendIcon sx={{ width: "40px", height: "40px" }} />}

              >
                อนุมัติ
              </Button>
            </Tooltip> */}

        </Toolbar>

        </Paper>
      ): (
        <></>
      )}

    </>
  );
}

export default ListApprove;
