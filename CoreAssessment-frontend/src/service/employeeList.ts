import http from "../Config/_configAxios"
import { AssessmentList, IGetDept, IGetGroup, IGetSection } from "../Model/Approve/ApproveList";
// Method Get all product

// step 1 create fuction

export interface IndicatorSubRecord {
  indicatorDetail_Id:number;
  indicatorBy:number;
  empcode:string;
  scroce:number;
  


}

export interface ApproveData{
  empcode:string;
  approveBy:string;
  year:string;
  statusConfirm:boolean
}

export interface checkboxDataSend {
  evaluteYear: string;
  empCode: string;
  coreLevel: string; 
  evaluteStatus:string; 
  


}

export interface checkboxDataSendApprove {
    ApproveYear: string;
    empCode: string;
    ApproveBy:string;
    coreLevel: string; 
    status:string; 
    approveStatus:string
  
}


const getAssessmentList = async (empcode:string,position:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getAssessmentList/${empcode}/${position}`);

}

const getAssessmentListDev = async (empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getAssessmentListDev/${empcode}`);

}



const getApproveList = async (empcode:string,position:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getAssessmentApprove/${empcode}/${position}`);

}


const getDashboardEmployeeData = async (level:string,empcode:string,year:string) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getAssessmentListByEmployee/${level}/${empcode}/${year}`);
}



// const changeStatusApprove = async (payload:checkboxDataSend[]) => {
//   return new Promise(resolve =>{
//     http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentListPerson/ChangeStatusApprove`,payload).then((res)=>{
//       resolve(res.data)
//     })
//   })

// }
const changeStatusApprove = async (payload:checkboxDataSend[] | checkboxDataSendApprove[]) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentListPerson/ChangeStatusApprove`,payload);
}

const SaveApproveEmployee = async (approveData:ApproveData) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post<ApproveData>(`/AssessmentListPerson/SaveApproveEmployee`,approveData);
}



export function getDept(empcode:string,dept:string) {
  return new Promise<IGetDept[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/groupCountEmployeeAssessment/${empcode}/${dept}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};

export function getSection(empcode:string,dept:string) {
  return new Promise<IGetSection[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/groupCountEmployeeAssessmentByDept/${empcode}/${dept}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};


export function getGrpBySection(empcode:string,section:string) {
  return new Promise<IGetGroup[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/groupCountEmployeeAssessmentByGroup/${empcode}/${section}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};


export function getEmployeeByGroup(empcode:string,group:string) {
  return new Promise<AssessmentList[]>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getEmployeeAssessmentByGroup/${empcode}/${group}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};








  
export default {
    getAssessmentList,
    getApproveList,
    getDashboardEmployeeData,
    SaveApproveEmployee,
    changeStatusApprove,
    getAssessmentListDev

};