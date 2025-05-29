import { useState, useEffect } from "react";
import SrvCoreAssessment from "../../../service/coreAssessment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, CircularProgress, Typography } from "@mui/material";
// import {position} from "../../../constant/authen.ts"
import Cookies from "js-cookie";
import { IEmployee } from "../../../Model/employeeInfo";
import dayjs from "dayjs";

const columns = [
  { id: "empImgae", label: "รูปภาพ" },
  { id: "empCode", label: "พนักงาน" },
  { id: "empName", label: "อายุงาน" },
  { id: "empPosition", label: "ตำแหน่ง" },
  { id: "empAction", label: "สถานะ" },
];

function CoreAssessment_selectEmployee() {
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const trackingStep = useSelector(
    (state: any) => state.trackingStateReducer.trackingState
  );
  const timeOutAssessmentEmployee = useSelector(
    (state: any) => state.timeoutCounterStateReducer.timeoutCounterState
  );

  const [employee, setEmployee] = useState<IEmployee[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loadApi, setloadApi] = useState(true);

  //@ts-ignore
  const handleChangePage = (event: unknown, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const positionData = useSelector(
    (state: any) => state.authenStateReducer.userAuthenData
  );
  const user_info: any = Cookies.get("user_info");
  const POSITION: string = user_info ? JSON.parse(user_info)[0].Position : "";
  useEffect(() => {
    if (
      POSITION == "GM" ||
      POSITION == "AGM" ||
      POSITION == "SGM" ||
      POSITION == "PD" ||
      POSITION == "DI" ||
      POSITION == "AG"
    ) {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 4,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: trackingStep.trackingLevel,
          trackingEmpCode: "",
        },
      });
    } else if (POSITION == "MG" || POSITION == "AMG" || POSITION == "AM") {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 2,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: trackingStep.trackingLevel,
          trackingEmpCode: "",
        },
      });
    } else {
      dispatch({
        type: "PREVIOUS_TRACKING_STEP",
        payload: {
          ...trackingStep,
          trackingCount: 1,
          trackingDept: trackingStep.trackingDept,
          trackingSection: trackingStep.trackingSection,
          trackingGroup: trackingStep.trackingGroup,
          trackingLevel: trackingStep.trackingLevel,
          trackingEmpCode: "",
        },
      });
    }

    SrvCoreAssessment.getEmployeeDev(
      positionData.empcode,
      trackingStep.trackingSection,
      trackingStep.trackingGroup,
      trackingStep.trackingLevel
    ).then((res) => {
      try {
        setEmployee(res.data);
      } catch (error) {
        console.log(error);
      }
    });

    setloadApi(false);
  }, []);

  const CoreAssessment_selectEmployee = (code: string, status: string) => {
    dispatch({
      type: "NEXT_TRACKING_STEP",
      payload: {
        ...trackingStep,
        trackingEmpCode: code,
        trackingStatus: status,
      },
    });

    navigate(
      `/CASAPP/backend/core-assessment/${trackingStep.trackingDept}/${trackingStep.trackingSection}/${trackingStep.trackingGroup}/${trackingStep.trackingLevel}/${code}`
    );
  };

  return (
    <>
      {loadApi ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div>
            <CircularProgress size={50} />
          </div>
          <div>
            <p className="text-2xl"> กําลังโหลด ....</p>
          </div>
        </div>
      ) : (
        <>
          <Paper sx={{ width: "100%", overflow: "auto", mt: 2 }}>
            <TableContainer sx={{ maxHeight: 1000 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className="tbEmployee"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={index} style={{ fontWeight: "bold" }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employee.length > 0 ? (
                    <>
                      {employee
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                src={`http://dcidmc.dci.daikin.co.jp/PICTURE/${row.code}.JPG`}
                                width={60}
                                height={60}
                              />
                            </TableCell>
                            <TableCell>
                              {row.code}
                              <br />
                              {row.name}
                            </TableCell>
                            <TableCell>
                              {dayjs(row.joinDate).format("DD/MM/YYYY")} <br />
                              {/* {row.workingAge_TotalDay.toLocaleString()} วัน */}
                              {row.workingAge_Year} ปี {row.workingAge_Month}{" "}
                              เดือน {row.workingAge_Day} วัน
                            </TableCell>
                            <TableCell>
                              {row.posit} LV
                              {parseInt(row.grade) == 0 ? "" : row.grade}
                            </TableCell>
                            {!row.status &&
                            !timeOutAssessmentEmployee.assessmentTimeout ? (
                              <TableCell>
                                {row.status_2 == "Pending" ? (
                                  <Button
                                    type="button"
                                    color="warning"
                                    variant="contained"
                                    onClick={() =>
                                      CoreAssessment_selectEmployee(
                                        row.code,
                                        row.status_2
                                      )
                                    }
                                  >
                                    แก้ไขประเมิน
                                  </Button>
                                ) : (
                                  <Button
                                    sx={{
                                      width: 100,
                                      height: 50,
                                      fontSize: 16,
                                    }}
                                    type="button"
                                    color="info"
                                    variant="contained"
                                    onClick={() =>
                                      CoreAssessment_selectEmployee(
                                        row.code,
                                        row.status_2
                                      )
                                    }
                                  >
                                    ประเมิน
                                  </Button>
                                )}
                              </TableCell>
                            ) : (
                              <TableCell>
                                <Button
                                  type="button"
                                  color="info"
                                  variant="contained"
                                  disabled
                                >
                                  {timeOutAssessmentEmployee.assessmentTimeout
                                    ? "หมดเวลาประเมิน"
                                    : "ประเมินแล้ว"}
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                    </>
                  ) : (
                    <Typography variant="h5" sx={{ pt: 5, pl: 50 }}>
                      ไม่มีพนักงานในตำแหน่งนี้ !!!
                    </Typography>
                  )}
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
      )}
    </>
  );
}

export default CoreAssessment_selectEmployee;
