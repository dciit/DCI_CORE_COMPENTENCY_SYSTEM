import Cookies from "js-cookie";


const user_info:any = Cookies.get("user_info") 
// const authen = useSelector((state:any) => state.authenReducer.userAuthenData);

export const empcode = user_info ? JSON.parse(user_info)[0].EmpCode : ""
export const name = user_info ? JSON.parse(user_info)[0].ShortName : ""
export const position_long = user_info ? JSON.parse(user_info)[0].SECT_Long : ""
export const dept = user_info ? JSON.parse(user_info)[0].DEPT_CD : ""
export const sect = user_info ?JSON.parse(user_info)[0].SECT_CD  : ""
export const group = user_info ? JSON.parse(user_info)[0].DVCD : ""
export const empPic = user_info ? JSON.parse(user_info)[0].EmpPic : ""
//export const  position = user_info ? JSON.parse(user_info)[0].Position : ""
export const position = "SS"
// export const dept = "11000"
// export const sect = "11100"
// export const group = "11110"