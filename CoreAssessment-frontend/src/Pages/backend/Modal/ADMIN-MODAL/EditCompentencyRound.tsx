// import React from 'react'
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { FormControlLabel, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import SrvCoreAssessment from "../../../../service/coreAssessment"
import { compentencyRoundREV } from "../../../../Model/Admin/admin";
import Swal from "sweetalert2";

function EditCompentencyRound({ openDialog,codeRev, onClose }: any) {


 const [active, setactive] = useState<any>(true);

 const [stDate, setstDate] = useState<string>("");
 const [enDate, setenDate] = useState<string>("");
 const [getDataCompentencyRound,setDataCompentencyRound] = useState<compentencyRoundREV>()




  useEffect(() => {
    if (openDialog == true) {

        SrvCoreAssessment.getEditREV(codeRev).then((res)=>{
            try{
            
                setDataCompentencyRound(res.data)
                setactive(res.data.status)
             
            }catch(error){
              console.log(error)
            }
          })
    }
  }, [openDialog]);


  const filterMonthDataTable = (data: any) =>{
    setstDate(dayjs(data[0]).format("YYYY-MM-DD HH:mm:ss"));
    setenDate(dayjs(data[1]).format("YYYY-MM-DD HH:mm:ss"));

  }

  function submitData(){
    let payload : compentencyRoundREV ={
      code : codeRev,
      stDate : stDate,
      enDate : enDate,
      status : active
    }

  
    SrvCoreAssessment.EditREV(payload).then((res)=>{
      try{
        if(res.data.status == "OK"){
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "แก้ไขรอบสำเร็จ",
            showConfirmButton: false,
            timer: 1500
          }).then(onClose);

        }else{
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถเพิ่มรอบอบรมได้",
            text: "มีรอบการอบรมที่เปิดอยู่",
            showConfirmButton: false,
            timer: 2000
          });
        }
       
      }catch(error){
        console.log(error)
      }
    })

  }
  


  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      
    >   

    
      <DialogTitle id="alert-dialog-title">
        {"เพิ่มรอบการประเมิน"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{mt:'6px'}} >
        <TextField sx={{mt:'10px',mb:'12px'}} fullWidth  disabled id="outlined-basic" label="Code" variant="outlined" inputProps={{ maxLength: 7 }} value={getDataCompentencyRound?.code}/>
        {/* {String(checked)} */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DemoContainer components={["DateTimeRangePicker"]}>
              <DateTimeRangePicker
                localeText={{ start: "Start Date Time", end: "End Date Time" }}
                onChange={(newValue) => filterMonthDataTable(newValue)}
                value={[
                    dayjs(getDataCompentencyRound?.stDate),
                    dayjs(getDataCompentencyRound?.enDate),
                  ]}
              />
            </DemoContainer>
          </LocalizationProvider>
          <FormControlLabel  sx={{mt:3}} control={<Switch defaultChecked={active ? true : false} onChange={(e)=>setactive(e.target.checked)} />} label="ACTIVE" />   </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{color:'white'}} disabled={dayjs(stDate).isValid() && dayjs(enDate).isValid()  ? false : true} type="button" color="success" variant="contained" onClick={submitData}>บันทึก</Button>
        <Button type="button" color="error" variant="contained"  onClick={onClose} autoFocus>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCompentencyRound;
