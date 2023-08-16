
const initialData = {

  trackingState:{
    trackingCount:0,
    trackingDept:'',
    trackingSection:'',
    trackingGroup:'',
    trackingLevel:'',
    trackingEmpCode:''
   
    
    

  }

 
}


const trackingReducer = (state = initialData  ,action:any) => {
  switch(action.type){
    case 'FIRST_TRACKING_STEP': 
      return{
       
        ...state,
        trackingState:{
          trackingCount : 0,
          trackingDept: action.payload.trackingDept,
          trackingSection: action.payload.trackingSection,
          trackingGroup :action.payload.trackingGroup,
      
         

        }
      }

    case 'NEXT_TRACKING_STEP': 
      return{
       
        ...state,
        trackingState:{
          trackingCount : state.trackingState.trackingCount +1,
          trackingDept: action.payload.trackingDept,
          trackingSection: action.payload.trackingSection,
          trackingGroup :action.payload.trackingGroup,
          trackingLevel :action.payload.trackingLevel,
          trackingEmpCode: action.payload.trackingEmpCode
        }
        
       
      } 

      case 'PREVIOUS_TRACKING_STEP': 
      return{
       
        ...state,
        trackingState:{
          trackingCount : action.payload.trackingCount,
          trackingDept: action.payload.trackingDept,
          trackingSection: action.payload.trackingSection,
          trackingGroup :action.payload.trackingGroup,
          trackingLevel :action.payload.trackingLevel,
          trackingEmpCode: action.payload.trackingEmpCode
        }
        
       
      }
      
      case 'RESET_TRACKING_STATE':
       return {
        ...state,
        trackingState:{
          trackingCount : 0,
          trackingDept: '',
          trackingGroup :'',
          trackingLevel :0,
          trackingEmpCode: ''
        }
       }
    
 
    default:
      return state


  }
}

export default trackingReducer