import http from "../Config/_configAxios"
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









