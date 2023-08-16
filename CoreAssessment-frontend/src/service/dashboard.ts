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


const getBarChart = async () => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentDashboard/getAssessmentDashboardBarChart`);

}





  
export default {
    getBarChart,


};