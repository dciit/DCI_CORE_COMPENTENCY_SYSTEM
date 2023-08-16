import http from "../Config/_configAxios"
// Method Get all product

// step 1 create fuction


const Login = (username:string,password:string) => {
    return http.AUTH.get(`authen?username=${username}&password=${encodeURIComponent(password)}`);
  };

export default {
    Login,
};