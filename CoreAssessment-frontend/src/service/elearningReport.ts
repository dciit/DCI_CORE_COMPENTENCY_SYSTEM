import http from "../Config/_configAxios"




const getChartSection1 = async () => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/ElearningReport/getChartSection1`).then((res)=>{
      resolve(res.data)
    })
  })

}

const getChartSection2 = async (cc:string) => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/ElearningReport/getChartSection2_Dev/${cc}`).then((res)=>{
      resolve(res.data)
    })
  })

}



  
export default {
    getChartSection1,
    getChartSection2

};