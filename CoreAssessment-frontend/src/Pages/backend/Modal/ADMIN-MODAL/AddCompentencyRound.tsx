// import React from 'react'
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateRange, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { FormControlLabel, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import SrvCoreAssessment from "../../../../service/coreAssessment"
import { compentencyRoundREV } from "../../../../Model/Admin/admin";
import Swal from "sweetalert2";

function AddCompentencyRound({ openDialog, onClose }: any) {

  const today = new Date();


 const [code,setcode] = useState<string>("")
 const [active, setactive] = useState<any>(true);

 const [stDate, setstDate] = useState<string>(dayjs(new Date(today.getFullYear(), today.getMonth(), 1)).format("YYYY-MM-DD"));
 const [enDate, setenDate] = useState<string>(dayjs(new Date(today.getFullYear(), today.getMonth() + 1, 0)).format("YYYY-MM-DD"));

 const [dtPicker] = useState<DateRange<Dayjs>>([
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-21T18:30'),
  ]);




  useEffect(() => {
    SrvCoreAssessment.getREV().then((res)=>{
      try{
        setcode(res.data)
       
      }catch(error){
        console.log(error)
      }
    })
  }, [])



  const filterMonthDataTable = (data: any) =>{
    setstDate(dayjs(data[0]).format("YYYY-MM-DD HH:mm:ss"));
    setenDate(dayjs(data[1]).format("YYYY-MM-DD HH:mm:ss"));

  }

  function submitData(){
    let payload : compentencyRoundREV ={
      code : code,
      stDate : stDate,
      enDate : enDate,
      status : active
    }

    SrvCoreAssessment.saveREV(payload).then((res)=>{
      try{
        if(res.data == "OK"){
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "เพิ่มรอบสำเร็จ",
            showConfirmButton: false,
            timer: 1500
          });

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
        <TextField sx={{mt:'10px',mb:'12px'}} fullWidth  disabled id="outlined-basic" label="Code" variant="outlined" inputProps={{ maxLength: 7 }} value={code}  onChange={(e)=>setcode(e.target.value)}/>
        {/* {String(checked)} */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DemoContainer components={["DateTimeRangePicker"]}>
              <DateTimeRangePicker
                localeText={{ start: "Start Date Time", end: "End Date Time" }}
                value={dtPicker}
                onChange={(newValue) => filterMonthDataTable(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
       
          <FormControlLabel  sx={{mt:3}} control={<Switch defaultChecked onChange={(e)=>setactive(e.target.checked)} />} label="ACTIVE" />   </DialogContentText>
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

export default AddCompentencyRound;
