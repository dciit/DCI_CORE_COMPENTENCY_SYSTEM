
const initialData = {

  trackingState:{
    trackingCount:0,
    trackingDeptFirstStep:'',
    trackingDept:'',
    trackingSection:'',
    trackingGroup:'',
    trackingLevel:'',
    trackingEmpCode:'',
    trackingStatus:'',
    coreLevel:''
   
    
    

  }

 
}


const trackingReducer = (state = initialData  ,action:any) => {
  switch(action.type){
    case 'FIRST_TRACKING_STEP': 
      return{
       
        ...state,
        trackingState:{
          trackingCount : 0,
          trackingDeptFirstStep: action.payload.trackingDeptFirstStep,
          trackingDept: action.payload.trackingDept,
          trackingSection: action.payload.trackingSection,
          trackingGroup :action.payload.trackingGroup,
          coreLevel : action.payload.coreLevel
         

        }
      }

    case 'NEXT_TRACKING_STEP': 

      return{
       
        ...state,
        trackingState:{
          trackingCount : state.trackingState.trackingCount +1,
          trackingDeptFirstStep: action.payload.trackingDeptFirstStep,
          trackingDept: action.payload.trackingDept,
          trackingSection: action.payload.trackingSection,
          trackingGroup :action.payload.trackingGroup,
          trackingLevel :action.payload.trackingLevel,
          trackingEmpCode: action.payload.trackingEmpCode,
          trackingStatus : action.payload.trackingStatus,
          trackingRev:action.payload.trackingRev,
          coreLevel : action.payload.coreLevel,
          timeoutAssessment : action.payload.timeoutAssessment

        }
        
       
      } 

      case 'PREVIOUS_TRACKING_STEP': 
      return{
       
        ...state,
        trackingState:{
          trackingCount : action.payload.trackingCount,
          trackingDeptFirstStep : action.payload.trackingDeptFirstStep,
          trackingDept: action.payload.trackingDept,
          trackingSection: action.payload.trackingSection,
          trackingGroup :action.payload.trackingGroup,
          trackingLevel :action.payload.trackingLevel,
          trackingEmpCode: action.payload.trackingEmpCode,

          coreLevel : action.payload.coreLevel
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