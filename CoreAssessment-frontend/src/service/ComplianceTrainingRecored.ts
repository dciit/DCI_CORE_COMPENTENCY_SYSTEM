import http from "../Config/_configAxios"




const getCCTraningRecored = async () => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/ComplianceTrainingRecored/getCCTraningRecored`).then((res)=>{
      resolve(res.data)
    })
  })

}

export function getDataAttendance(cc:string,dept:string) {
  return new Promise<boolean>(resolve => {
     http.COMPETENCY_ACCSCCMENT_API.get(`/ElearningReport/getDataAttendance/${cc}/${encodeURIComponent(dept)}`).then((res) => {
       resolve(res.data);
     }).catch((e) => {
       console.log(e);
     });
  })
};

export default {
    getCCTraningRecored

};