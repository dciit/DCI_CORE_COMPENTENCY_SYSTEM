
const initialData = {

    DashboardEmployeePage:{
     
      level:0,
      year: '',
      empcode:'',
      position:'',
      statusApprove:''
    
    }
  
   
  }
  
  
  const scoreEmployeeReducer = (state = initialData  ,action:any) => {
    switch(action.type){
      case 'OPEN_DASHBOARD_EMP_PAGE': 
      return{
         
          ...state,
          DashboardEmployeePage:{
            level:action.payload.level,
            year:action.payload.year,
            empcode:action.payload.empcode,
            position:action.payload.position,
            statusApprove:action.payload.statusApprove
       
          }
        }
  
  
        case 'RESET_DASHBOARD_EMP_PAGE' :
        return{
            DashboardEmployeePage:{
              position:'',
              level:0,
              year: '',
              empcode:''
           
  
          }
        } 
      
  
    
         
        
    
      
   
      default:
        return state
  
  
    }
  }
  
  export default scoreEmployeeReducer