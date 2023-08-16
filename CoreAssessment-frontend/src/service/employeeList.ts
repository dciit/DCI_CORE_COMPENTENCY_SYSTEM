import http from "../Config/_configAxios"
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


const getAssessmentList = async (position:string,position_number:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getAssessmentList/${position}/${position_number}`);

}

const getDashboardEmployeeData = async (level:string,empcode:string,year:string) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getAssessmentList/${level}/${empcode}/${year}`);
}


const SaveApproveEmployee = async (approveData:ApproveData) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post<ApproveData>(`/AssessmentListPerson/SaveApproveEmployee`,approveData);
}




  
export default {
    getAssessmentList,
    getDashboardEmployeeData,
    SaveApproveEmployee

};