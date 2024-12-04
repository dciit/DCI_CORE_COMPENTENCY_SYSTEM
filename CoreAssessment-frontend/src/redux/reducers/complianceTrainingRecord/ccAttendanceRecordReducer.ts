const initialData = {

    ccSectionState:{
      section:'',
 
        
  
    }
  
   
  }
  
  
  const ccAttendanceRecordReducer = (state = initialData  ,action:any) => {
    switch(action.type){
      case 'KEEP_SECTION': 
       
       
        return{
         
          ...state,
          ccSectionState:{
            section : action.payload.section,

          }
        }
    
          
         
     
   
      default:
        return state
  
  
    }
  }
  
  export default ccAttendanceRecordReducer