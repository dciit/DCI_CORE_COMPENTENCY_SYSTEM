import {useState,useEffect,Fragment} from 'react'
import SrvCoreAssessment from "../../../service/coreAssessment"
import { useNavigate  } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { Button, CardMedia, Divider, Grid, Stack } from '@mui/material';
import { SendRounded } from '@mui/icons-material';
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from "react-redux";



  export interface Employee {
    code:string;
    name:string;
    surn:string;
    dept:string;
    sect:string;
    posit:string;
    joinDate:Date;
  }


  export interface IndicatorDataTable {
    indicator_CourseName:string;
    indicator_CourseCode:CourseCodeDataTableDetail[]
    indicator_Category:IndicatorDataTableDetail[]
  }




  export interface CourseCodeDataTableDetail {
    courseCode :string,
    status:string
  }

  export interface IndicatorDataTableDetail {
    indicator_Id:number;
    indicator_DetailCourseName:string;
  }


  export interface IndicatorSubRecord {
    indicatorDetail_Id:number;
    indicatorBy:string;
    empcode:any;
    scroce:number;
    


  }


  const columns = [
    { id: "Corecompentency", label: "หลักสูตรตามสมรรถนะหลัก (Core Compentency Course)" },
    { id: "Corecompentency_Detail", label: "คำอธิบาย" },
  ];
  
  const styles = {
    avatarContainer: {
        display: "flex",
        alignItems: "left",
        flexDirection: 'column',
        my: 5
    },
    avatar: {
      width: '50%',
      height: 'auto'
  },
  commonStyles :{
    bgcolor: 'background.paper',
    mt: 2,
    border: 1,
    borderColor: 'text.primary',
    width: 'auto',
    height: 'auto',
  }
}

  



function CoreAssessment_selectAssess() {

   
      let navigate = useNavigate(); 
      const user_info:any = Cookies.get("user_info")
      const empcodeLogin:string = JSON.parse(user_info)[0].EmpCode
      const empNameLogin:string = JSON.parse(user_info)[0].ShortName


      const dispatch = useDispatch();
      const trackingStep = useSelector((state:any) => state.trackingStateReducer.trackingState);
      const calScore = useSelector((state:any) => state.calculateSroceStateReducer.yourScoreStatus);

      const [indicator,setindicator] = useState<IndicatorDataTable[]>([])
      const [employee,setemployee] = useState<Employee>()
      const [totalChoice,settotalChoice] = useState<number>(0)

    
  
      useEffect(() => {
        console.log(calScore)
          SrvCoreAssessment.getEmployeeForIndicator(trackingStep.trackingEmpCode).then((res)=> {
            try{

              setemployee(res.data)

            }catch(error){
              console.log(error)
            }
          })

          SrvCoreAssessment.getIndicator(trackingStep.trackingSection,trackingStep.trackingGroup,trackingStep.trackingLevel,trackingStep.trackingEmpCode).then((res)=>{
              try{
                settotalChoice(res.data.total_choice)
                setindicator(res.data.indicatorDataTables)
               
              }catch(error){
                console.log(error)
              }
            })
       
      }, [])
  
  
    const inputScore = (event:React.ChangeEvent<HTMLInputElement>,id:number) =>{
        // setchoiceSelectList([...choiceSelectList,id])
   
        let payload  = {
          IndicatorDetail_Id:id,
          IndicatorBy:empcodeLogin,
          EmpCode:trackingStep.trackingEmpCode,
          Scroce:event.target.value
        
          
        }


        SrvCoreAssessment.saveIndicatorCompentenctSub(payload).then(()=>{
          try{

        
              if(calScore.yourChoiceSelect.includes(id)){
                dispatch({
                  type: "CHOICE_CURRENT_SELECT",
                  payload:{...calScore,
                    yourChoiceSelect:id,
                    yourScore:event.target.value,
                    } 
                
                 })
              }else{
                dispatch({
                  type: "CHOICE_NEW_SELECT",
                  payload:{...calScore,
                    yourChoiceSelect:id,
                    yourScore:event.target.value ,
                    yourTotalChoice:totalChoice * 5
                    } 
                
                 })
              }             
            
           
              

            
     

          }catch(error){
            console.log(error)
          }
        })

    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
   
        let payload  = {
          
          IndicatorBy:empNameLogin,
          EmpCode:trackingStep.trackingEmpCode,
          CoreLevel:trackingStep.trackingLevel
        
               
        }
        
        
        SrvCoreAssessment.saveIndicatorCompentenctMain(payload).then((res)=>{
          try{
            if(res.data.statusConfirm){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'ทำการประเมินเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1500
              })
              dispatch({
                type: "RESET_CALCULATE"
                
            
           })
      //      dispatch({
      //       type: "RESET_TRACKING_STATE"
        
      //  })
              navigate("/backend/core-assessmentList")
            }
          }catch(error){
            console.log(error)
          }
        })
    }


      
  return (
   <>

    <Card sx={{ display: 'flex',mt:5,borderRadius:2,backgroundColor:'teal' }}>
      <Box sx={{ display: 'flex', alignItems: 'center',m:2 }}>
      <CardMedia
          component="img"
          sx={{ width: 120,  borderRadius: '10%', }}
          image={`http://dcidmc.dci.daikin.co.jp/PICTURE/${employee?.code}.JPG`}
        />
          </Box>
  
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" sx={{color:'white' }}>
            ผู้รับการประเมิน
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{color:'white' }}>
              <Box fontWeight='bold' display='inline'>รหัสพนักงาน :</Box> {employee?.code}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{color:'white' }}>
              <Box fontWeight='bold' display='inline'>ชื่อ-นามสกุล :</Box> {employee?.name}&nbsp;{employee?.surn}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{color:'white' }}>
              <Box fontWeight='bold' display='inline'>ตำแหน่ง :</Box>  {employee?.posit}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{color:'white' }}>
              <Box fontWeight='bold' display='inline'>หน่วยงาน :</Box>  {employee?.sect}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{color:'white' }}>
              <Box fontWeight='bold' display='inline'>วันที่เข้าทำงาน :</Box> {dayjs(employee?.joinDate).format("DD/MM/YYYY")}
          </Typography>
     
        </CardContent>
     
      </Box>
    
    </Card>
   
  
    <Box sx={{...styles.commonStyles,border:2}}>
          <Card sx={{ minWidth: 275,backgroundColor:'#CACFD2' }}>
              <CardContent>                                  
                  <Typography component='div' variant='h5'><Box fontWeight='bold' display='inline'>คำชี้แจง :</Box>กรุณาทำเครื่องหมายลงในช่อง เกณฑ์การประเมิน ตามสมรรถนะความสามารถ (Compentency) หรือพฤติกรรมการทำงานของผู้รับการประเมินที่ท่านสังเกตได้</Typography>                                                        
                  <Typography sx={{ mt: 1.5 }} color="text.secondary" variant='body1'>
                    มากที่สุด (5 คะแนน) = เข้าใจอย่างถ่องแท้ สามาถทำงานได้อย่างเชี่ยวชาญ 
                    <br/>
                    มาก (4 คะแนน) = เข้าใจดีทำงานได้ 
                    <br/>
                    ปานกลาง (3 คะแนน) = เข้าใจ สามารถทำงานได้โดยอิสระโดยไม่ต้องมีคนช่วย
                    <br/>
                    น้อย (2 คะแนน) = เข้าใจไม่ไดี สามารถทำงานช่วยเหลือได้
                    <br/>
                    น้อยที่สุด (1 คะแนน) = ล้มเหลว ไม่เข้าใจ

                  </Typography>
                
              </CardContent>

        </Card>
    </Box>
    <Paper sx={{ width: "100%", overflow: "auto" ,mt:2}}>
        <TableContainer sx={{maxHeight: 800 }}>
          <Table className='tbMain' stickyHeader aria-label="sticky table"  >
            <TableHead>
                <TableRow>
                        {columns.map((column, index) => (
                    <TableCell
                        rowSpan={2}
                        key={index}
                        style={{ fontWeight: "bold",textAlign:'center',width:'30%' }}
                    >
                        {column.label}
                    </TableCell>
                    ))}
                
                    <TableCell  sx={{textAlign:'center',fontWeight: "bold",width:'30%'}} colSpan={5}>ผลการประเมิน</TableCell>
                    
                </TableRow>
                    <TableRow>  
                            <TableCell style={{ fontWeight: "bold",width:"8%",textAlign:'center',padding:'12px 0px' }}>มากที่สุด</TableCell>
                            <TableCell style={{ fontWeight: "bold",width:"8%",textAlign:'center',padding:'12px 0px' }}>มาก</TableCell>
                            <TableCell style={{ fontWeight: "bold",width:"8%",textAlign:'center',padding:'12px 0px' }}>ปานกลาง</TableCell>
                            <TableCell style={{ fontWeight: "bold",width:"8%",textAlign:'center',padding:'12px 0px' }}>น้อย</TableCell>
                            <TableCell style={{ fontWeight: "bold",width:"8%",textAlign:'center',padding:'12px 0px' }}>น้อยที่สุด</TableCell>
                    </TableRow> 
        
            </TableHead>
            <TableBody>
    
        
 
                {indicator.map((row) =>(
                      <Fragment>
                        
                        <TableRow>  
                                <TableCell sx={{padding:0}} rowSpan={row.indicator_Category.length+1}>
                                    <Stack style={{height:'100%'}}  direction={'row'} spacing={3}  >
                                        <Stack flex={1}  direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                            <Typography style={{width:'100%',textAlign:'center'}}>{row.indicator_CourseName}</Typography>
                                            <Divider orientation='vertical'/>
                                        </Stack>
                                        <Stack flex={1} style={{margin:0,height:'100%'}} justifyContent={'space-between'}>
                                            {
                                                row.indicator_CourseCode.map((item) => (
                                                <>      
                                                        <Typography variant='body2' style={{padding:5,height:'100%',textAlign:'center',display:'flex',alignItems:'center'}}>
                                                        {item.courseCode} &nbsp; 
                                                        {item.status == "FAIL" ? <Box sx={{color:'red'}}>(not start)</Box> :<Box sx={{color:'green'}}>(complete)</Box>}</Typography>
                                                        <Divider />
                                                        </>
                                                ))
                                            }

                                        </Stack>
                                  </Stack>
                                {/* <div style={{height:'100%'}}>
                                  <Table style={{height:'100%'}}>
                                    <TableBody>
                                          <TableRow>
                                            <TableCell sx={{width:'70%'}} rowSpan={5}>{row.indicator_CourseName}</TableCell>
                                            <TableCell sx={{display:'flex'}}>TDC-SEAL1-1</TableCell>
                                          </TableRow>
                                          <TableRow><TableCell  sx={{display:'flex'}}>TDC-SEAL1-2</TableCell></TableRow>
                                        
                                          
                                    </TableBody>                                  
                                  </Table>
                                  </div> */}
                                </TableCell>
                            
                        </TableRow>
                 
                        {row.indicator_Category.map(detail => (
                            <TableRow>
                                <TableCell>{detail.indicator_DetailCourseName}</TableCell>

                                <TableCell colSpan={5}>
                                <div className='responesiveDiv'>
                                    <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange={(e) => inputScore(e,detail.indicator_Id)}
                                    >
                                            <Table className='tbRadioGroup'>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell style={{width:'20%',textAlign:'center'}}><FormControlLabel value="5" control={<Radio />} label="" /></TableCell>
                                                        <TableCell style={{width:'20%',textAlign:'center'}}><FormControlLabel value="4" control={<Radio />} label="" /></TableCell>
                                                        <TableCell style={{width:'20%',textAlign:'center'}}><FormControlLabel value="3" control={<Radio />} label="" /></TableCell>
                                                        <TableCell style={{width:'20%',textAlign:'center'}}><FormControlLabel value="2" control={<Radio />} label="" /></TableCell>
                                                        <TableCell style={{width:'20%',textAlign:'center'}}><FormControlLabel value="1" control={<Radio />} label="" /></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </RadioGroup>
                                    </div>
                               
                                </TableCell>

                            </TableRow>
                          
                        ))}
                   
                      </Fragment>
                 ))}
        
                   
            </TableBody>
          </Table>
        </TableContainer>

     
 
      </Paper>
      <Grid container spacing={2}>
          <Grid item xs={3}>
            <Box  component="form" noValidate onSubmit={handleSubmit} sx={{mt:3,textAlign:"start"}}>
               <Typography  variant="h6">ประเมินแล้ว {calScore.yourChocie} / {totalChoice} ข้อ</Typography> 
               <Typography  variant="h6">คะแนนที่ได้ {calScore.yourScore} / {totalChoice*5} &nbsp;( {Math.round((calScore.yourScore * 100) / (totalChoice *5))} %)  </Typography> 
         
               <br />

                </Box>
          </Grid>
     
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={5}>
            <Box  component="form" noValidate onSubmit={handleSubmit} sx={{mt:3,textAlign:"end"}}>

                <Button type="submit" sx={{width:'60%',height:'100%',fontSize:"20px"}} variant="contained" endIcon={<SendRounded />} >
                  ประเมินสมรรถนะ
                </Button>
            </Box>
          </Grid>
      
      </Grid>

      {/* <Box  component="form" noValidate onSubmit={handleSubmit} sx={{mt:3,textAlign:"end"}}>

          <Button type="submit" sx={{width:'20%',height:'100%',fontSize:"20px"}} variant="contained" endIcon={<SendRounded />} >
            ประเมินสมรรถนะ
          </Button>
      </Box> */}
    
   </>
  )
}



export default CoreAssessment_selectAssess