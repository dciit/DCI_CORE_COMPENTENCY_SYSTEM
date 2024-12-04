import http from "../Config/_configAxios"
// Method Get all product

// step 1 create fuction

export interface IndicatorSubRecord {
  indicatorDetail_Id:number;
  indicatorBy:number;
  empcode:string;
  scroce:number;
  


}


const getBadge = async (empcode:string) => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getCounterBadge/${empcode}`).then((res)=>{
      resolve(res.data)
    })
  })

}


const getBadgeDev = async (empcode:string) => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentListPerson/getCounterBadgeDev/${empcode}`).then((res)=>{
      resolve(res.data)
    })
  })

}






  
export default {
  getBadge,
    getBadgeDev


};