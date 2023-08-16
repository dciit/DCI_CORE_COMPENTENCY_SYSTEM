// import { BASE_URL_PART } from "./constants";
import { AUTH_URL_PATH,COMPETENCY_ACCSCCMENT_API_PATH } from "./contants"
import Axios from "axios"


const COMPETENCY_ACCSCCMENT_API = Axios.create({
    
    baseURL:COMPETENCY_ACCSCCMENT_API_PATH,
    headers:{
        'Content-Type':'application/json'
    }
})



const AUTH = Axios.create({
    
    baseURL:AUTH_URL_PATH,
    headers:{
        'Content-Type':'application/json'
    }
})

export default{ 
    AUTH ,
    COMPETENCY_ACCSCCMENT_API
};