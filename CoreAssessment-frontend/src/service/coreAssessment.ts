import http from "../Config/_configAxios"
import { AssessmentScore, AssessmentScoreMain } from "../Model/AssessmentEmployee/assessment";
// Method Get all product

// step 1 create fuction

export interface IndicatorSubRecord {
  indicatorDetail_Id:number;
  indicatorBy:number;
  empcode:string;
  scroce:number;
  


}


const getREV = async () => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getRunningCodeREV`);

}



const getEmployeeForIndicator = async (empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEmployeeIndicator/${empcode}`);

}

const getEmployeeFlowLogin = async (empcode:string) => {
  return new Promise(resolve =>{
    http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEmployeeEvalute/${empcode}`).then((res)=>{
      resolve(res.data)
    })
  })
}



const getDept = async (dept:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getDept/${dept}`)
}


const getSection = async (empcode:string,section:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getSection/${empcode}/${section}`);
};


const getGroup = async (empcode:string,group:string) => {
    return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getGroup/${empcode}/${group}`);
};


const getCoreLevel = async (empcode:string,dvcd:string , posit:string) => {
    return new Promise(resolve =>{
      http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getcoreLevelByEmployee/${empcode}/${dvcd}/${posit}`).then((res)=>{
        resolve(res.data)
      })
    })
}

const getEmployee = async (level:number,section:string,group:string) => {
    return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEmployee/${level}/${section}/${group}`);
  };

  
const getEmployeeDev = async (empcode:string,level:number,section:string,group:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEmployeeDev/${empcode}/${level}/${section}/${group}`);
};

const getIndicator = async (level:number,section:string,group:string,empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getIndicator/${level}/${section}/${group}/${empcode}`);

}

const getNewIndicator = async (level:number,empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getCompentencyAssessmentForm/${level}/${empcode}`);

}


const saveIndicatorCompentenctSub = async (payload:any) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveAssessmentDetail/`,payload);

}

// const saveIndicatorCompentenctMainDev = async (payload:any) =>{
//   return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveIndicatorCompentenctMainDev/`,payload);

// }


export function saveIndicatorCompentenctSubDev(payload: AssessmentScore[]) {
  return new Promise<AssessmentScore[]>(resolve => {
    http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveIndicatorCompentenctSubDev/`,payload).then((res) => {
          resolve(res.data.statusConfirm);
      }).catch((e) => {
          console.log(e);
      });
  })
}


export function saveIndicatorCompentenctMainDev(payload: AssessmentScoreMain) {
  return new Promise<AssessmentScoreMain>(resolve => {
    http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveIndicatorCompentenctMainDev/`,payload).then((res) => {
          resolve(res.data.statusConfirm);
      }).catch((e) => {
          console.log(e);
      });
  })
}





const saveIndicatorCompentenctMain = async (payload:any) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveAssessmentMain/`,payload);

}


const getPerviousScroe = async (emp:string) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getPerviousScroe/${emp}`);}

  const saveREV = async (payload:any) =>{
    return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveREV/`,payload);
  
  }

  const getEditREV = async (code:string) =>{
    return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEditREV/${code}`);}

  const EditREV = async (payload:any) =>{
    return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/EditREV`,payload); 
  }

  const editSelectAssessment = async (rev:string,code:string) =>{
    return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/editSelectAssessment/${rev}/${code}`,); 

  }


  export function getREVAssessment() {
    return new Promise<string>(resolve => {
      http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getREVAssessment/`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
  }


  export function checkEmployeeContinuousEvaluted(empcode:string,level:number,section:string,group:string) {
    return new Promise<any>(resolve => {
      http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/checkEmployeeContinuousEvaluted/${empcode}/${level}/${section}/${group}`).then((res) => {
        console.log(res.data)
        resolve(res.data);
        
        }).catch((e) => {
            console.log(e);
        });
    })
  }
  
  



  
export default {
    getREV,
    saveREV,
    getEditREV,
    EditREV,
    getEmployeeFlowLogin,
    getDept,
    getSection,
    getGroup,
    getCoreLevel,
    getEmployee,
    getEmployeeForIndicator,
    getIndicator,
    getNewIndicator,
    getPerviousScroe,
    saveIndicatorCompentenctSub,
    saveIndicatorCompentenctMain,
    getEmployeeDev,
    editSelectAssessment
    

  
};