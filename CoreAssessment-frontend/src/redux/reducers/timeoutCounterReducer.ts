
const initialData = {


    timeoutCounterState:{
        assessmentRev:'',
        assessmentTimeout:false,
 
     }
    
   }
   
   
   const timeoutCounterReducer = (state = initialData  ,action:any) => {
     switch(action.type){
         case 'GET_REV_AND_TIMEOUT': 
         return{
          
           ...state,
           timeoutCounterState :{
            assessmentRev:action.payload.assessmentRev,
            assessmentTimeout :action.payload.assessmentTimeout
           } 
         }
     
    
         
        
               
    
       default:
         return state
   
   
     }
   }
   
   export default timeoutCounterReducer