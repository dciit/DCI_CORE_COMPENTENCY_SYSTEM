import http from "../Config/_configAxios"
// Method Get all product

// step 1 create fuction


const Login = (username:string,password:string) => {
    return http.AUTH.get(`authen?username=${username}&password=${encodeURIComponent(password)}`);
  };

  export function checkPermission(empcode:string) {
    return new Promise<boolean>(resolve => {
       http.COMPETENCY_ACCSCCMENT_API.get(`/Authentication/authentication/${empcode}`).then((res) => {
         resolve(res.data);
       }).catch((e) => {
         console.log(e);
       });
    })
};





export default {
    Login
};