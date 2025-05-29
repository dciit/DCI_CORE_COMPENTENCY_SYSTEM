import http from "../Config/_configAxios"
import { TISSchedule, TISTrainee } from "../Model/TIS/TIS";
// Method Get all product

// step 1 create fuction



  export function getTISRecord(payload:any) {

    return new Promise<any>(resolve => {
       http.COMPETENCY_ACCSCCMENT_API.post(`/Admin/loadTIS`,payload).then((res) => {
         resolve(res.data);
       }).catch((e) => {
         console.log(e);
       });
    })
};




export function getCourseCode() {
  return new Promise<string[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/CourseCode`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};


export function getTisCalendar() {

  return new Promise<TISSchedule[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getTrainingToDay`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};


export function getTisTrainee(sdate:string,edate:string,cc:string) {

  return new Promise<TISTrainee[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.post(`/Admin/findTraineeByCourse`,{stDate:sdate,enDate:edate,courseCode:cc}).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};










