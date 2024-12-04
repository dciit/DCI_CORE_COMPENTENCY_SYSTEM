// import { dept } from './../constant/authen';
import http from "../Config/_configAxios"
import { EmployeeAttendanceReport } from '../Model/Admin/employeeAttendance';
import { OrgChartDept } from "../Model/Admin/orgChart";




const getCompentencyRound = async () => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/CompentencyRound`).then((res)=>{
      resolve(res.data)
    })
  })
}


export function getDept() {
  return new Promise<boolean>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getDepts`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};

export function getSectionByDept(dept:string) {
  return new Promise<EmployeeAttendanceReport[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getDataAttendanceByDept/${dept}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};

export function getSectionManager(dept:string) {
  return new Promise<EmployeeAttendanceReport[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getDataAttendanceManager/${dept}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};

export function getOrganizationChart(dept:string) {
  return new Promise<OrgChartDept[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getOrgChart/${dept}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};



export function getDashboard() {
  return new Promise<any>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getDataDashboard`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};


export function getTIS(level:number) {
  
  return new Promise<any>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/Admin/getTIS/${level}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};





  
export default {
    getCompentencyRound

};