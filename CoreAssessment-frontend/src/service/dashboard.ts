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


const getBarChart = async (empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentDashboard/getDashboardBarChart/${empcode}`);

}


const getPieChart = async (code:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentDashboard/getGadgetCardDashboard/${code}`);

}


export function getDashboards(payload:any) {
  
  return new Promise<any>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentDashboard/getDataDashboard`,payload).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};








  
export default {
    getBarChart,
    getPieChart


};