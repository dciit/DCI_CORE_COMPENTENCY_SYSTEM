
const initialData = {

    trainingScheduleState:{
      stDate:0,
      enDate:'',
      cc:'',
        
  
    }
  
   
  }
  
  
  const trainingScheduleReducer = (state = initialData  ,action:any) => {
    switch(action.type){
      case 'VIEW_TRAINEE': 
        return{
         
          ...state,
          trainingScheduleState:{
            stDate : action.payload.stDate,
            enDate:action.payload.enDate,
            cc:action.payload.cc,

           
  
          }
        }
  
    
         
     
   
      default:
        return state
  
  
    }
  }
  
  export default trainingScheduleReducer