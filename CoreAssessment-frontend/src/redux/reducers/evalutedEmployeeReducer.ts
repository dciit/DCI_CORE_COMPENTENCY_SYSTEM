
const initialData = {


    assessmentList : []
  
    
   }
   
   
   const evalutedEmployeeReducer = (state = initialData  ,action:any) => {
     switch(action.type){
         case 'GET_INTIAL_DATA': 
         return{    
          
           ...state,
           assessmentList:action.payload
         }
     
    
         
        
       default:
         return state
   
   
     }
   }
   
   export default evalutedEmployeeReducer