
// const user_info:any = Cookies.get("user_info")
// const empcode:string = user_info ? JSON.parse(user_info)[0].EmpCode : ""
// const name:string = user_info ? JSON.parse(user_info)[0].ShortName : ""
// const position_short:string = user_info ? JSON.parse(user_info)[0].Position : ""
// const position_full:string = user_info ? JSON.parse(user_info)[0].SECT_Long : ""
// const dept : string = user_info ? JSON.parse(user_info)[0].DEPT_CD : ""
// const sect : string = user_info ? JSON.parse(user_info)[0].SECT_CD : ""
// const group : string = user_info ? JSON.parse(user_info)[0].DVCD : ""

const initialData = {

    userAuthenData:{
      postion:'',
      position_number:''

  
    }

  
   
  }
  
  
  const userAuthenReducer = (state = initialData  ,action:any) => {
    
    switch(action.type){
      
      case 'GET_POSITION_NUMBER': 
      return{
       
        ...state,userAuthenData:{
          position:action.payload.position,
          position_number:action.payload.position_number
      


        }
      
      
         

        
      }


      case 'POSTION_RESET': 
      return{
       
          userAuthenData:{
          postion:'',
          position_number:''
      


        }
      
      
         

        
      }
    
      default:
        return state
  
  
    }
  }
  
  export default userAuthenReducer