
const initialData = {


   counterBadgeState:{
        counterBadge_EVALUTED :0, 
        counterBadge_APPROVE : 0

    }
   
  }
  
  
  const counterBadgeReducer = (state = initialData  ,action:any) => {
    switch(action.type){
        case 'GET_COUNTER': 
        return{
         
          ...state,
          counterBadgeState :{
            counterBadge_EVALUTED:action.payload.counterBadge_EVALUTED,
            counterBadge_APPROVE :action.payload.counterBadge_APPROVE
          } 
        }
    
   
        
       
              
   
      default:
        return state
  
  
    }
  }
  
  export default counterBadgeReducer