import Cookies from "js-cookie";
// import {position} from "../../constant/authen.ts"
// import Cookies from "js-cookie";


const USER_ROLE = {
    ADMIN:"ADMIN",
    APPROVE_USER:["GM","AGM","SGM","AG","PD","DI"],
    ASSESSMENT_USER :["SE","SS","ST","SU","MG","AM","GM","AGM","SGM","AG","PD","DI"],
    NORMAL_USER: ["ATE","AV","DI","DR","EN","EN.S","FO","LE","LE.S","OP.S","OP-D","OP-P","OP-T","OTH","PD","SF","SUB","TE","TE.S","TR","TRN"],
}


function AdminRole({children}:any) {
  
const user_info:any = Cookies.get("user_info") 
const position = user_info ? JSON.parse(user_info)[0].Position : ""

    const USER_POSITION_LOGIN = position
  
    if(USER_POSITION_LOGIN == USER_ROLE.ADMIN){
        return <>{children}</>
    
      }
      else{
        return <>user is not admin role access</>
    
      }  
}


function AssessmentUserRole({children}:any) {
  
   
const user_info:any = Cookies.get("user_info") 
const position = user_info ? JSON.parse(user_info)[0].Position : ""

    const USER_POSITION_LOGIN = position

    if(USER_POSITION_LOGIN == USER_ROLE.ADMIN || 
        USER_ROLE.ASSESSMENT_USER.includes(USER_POSITION_LOGIN)){
      return <>{children}</>
  
    }
    else{
      return <>user is not can assessment </>
  
    }  
  }


  function NormalUserRole({children}:any) {
    

    const user_info:any = Cookies.get("user_info") 
    const position = user_info ? JSON.parse(user_info)[0].Position : ""
    
    const USER_POSITION_LOGIN = position

    if(USER_POSITION_LOGIN == USER_ROLE.ADMIN || 
    USER_ROLE.ASSESSMENT_USER.includes(USER_POSITION_LOGIN)  || 
    USER_ROLE.NORMAL_USER.includes(USER_POSITION_LOGIN)){
      return <>{children}</>
  
    }
    else{
      return <>user is not can open page</>
  
    }  
  }

  function ApproveUserRole({children}:any) {
    

    const user_info:any = Cookies.get("user_info") 
    const position = user_info ? JSON.parse(user_info)[0].Position : ""
    
    const USER_POSITION_LOGIN = position

    if(USER_POSITION_LOGIN == USER_ROLE.ADMIN || 
    USER_ROLE.APPROVE_USER.includes(USER_POSITION_LOGIN)){
      return <>{children}</>
  
    }
    else{
      return <>user is not can open page</>
  
    }  
  }


export {AdminRole,AssessmentUserRole,NormalUserRole,ApproveUserRole}