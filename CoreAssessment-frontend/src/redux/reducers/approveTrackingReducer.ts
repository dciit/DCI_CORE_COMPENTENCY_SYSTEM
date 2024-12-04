
const initialData = {

    approveTrackingState:{
      approveTrackingCount:0,
      approveTrackingDept:'',
      approveTrackingSection:'',
      approveTrackingGroup:'',
      approveTrackingEmpcode:''
        
  
    }
  
   
  }
  
  
  const approveTrackingReducer = (state = initialData  ,action:any) => {
    switch(action.type){
      case 'FIRST_TRACKING_STEP': 
        return{
         
          ...state,
          approveTrackingState:{
            approveTrackingCount : 0,
            approveTrackingDept:action.payload.approveTrackingDept,
            approveTrackingSection:action.payload.approveTrackingSection,
            approveTrackingGroup:action.payload.approveTrackingGroup,
            approveTrackingEmpcode:action.payload.approveTrackingEmpcode
           
  
          }
        }
  
      case 'NEXT_TRACKING_STEP': 
  
        return{
         
          ...state,
          approveTrackingState:{
            approveTrackingCount : state.approveTrackingState.approveTrackingCount +1,
            approveTrackingDept:action.payload.approveTrackingDept,
            approveTrackingSection:action.payload.approveTrackingSection,
            approveTrackingGroup:action.payload.approveTrackingGroup,
            approveTrackingEmpcode:action.payload.approveTrackingEmpcode
  
          }
          
         
        } 
  
        case 'PREVIOUS_TRACKING_STEP': 
        return{
         
          ...state,
          approveTrackingState:{
            approveTrackingCount : action.payload.approveTrackingCount,
            approveTrackingDept:action.payload.approveTrackingDept,
            approveTrackingSection:action.payload.approveTrackingSection,
            approveTrackingGroup:action.payload.approveTrackingGroup,
            approveTrackingEmpcode:action.payload.approveTrackingEmpcode
          }
        }
          
         
     
   
      default:
        return state
  
  
    }
  }
  
  export default approveTrackingReducer