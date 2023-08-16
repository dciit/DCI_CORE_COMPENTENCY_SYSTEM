import http from "../Config/_configAxios"
// Method Get all product

// step 1 create fuction

export interface IndicatorSubRecord {
  indicatorDetail_Id:number;
  indicatorBy:number;
  empcode:string;
  scroce:number;
  


}

const getEmployeeForIndicator = async (empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEmployeeIndicator/${empcode}`);

}


const getSection = async (section:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getSection/${section}`);
};


const getGroup = async (group:string) => {
    return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getGroup/${group}`);
  };


const getEmployee = async (level:number,section:string,group:string) => {
    return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getEmployee/${level}/${section}/${group}`);
  };

const getIndicator = async (level:number,section:string,group:string,empcode:string) => {
  return await http.COMPETENCY_ACCSCCMENT_API.get(`/AssessmentPerson/getIndicator/${level}/${section}/${group}/${empcode}`);

}

const saveIndicatorCompentenctSub = async (payload:any) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveAssessmentDetail/`,payload);

}

const saveIndicatorCompentenctMain = async (payload:any) =>{
  return await http.COMPETENCY_ACCSCCMENT_API.post(`/AssessmentPerson/saveAssessmentMain/`,payload);

}

  
export default {
    getSection,
    getGroup,
    getEmployee,
    getEmployeeForIndicator,
    getIndicator,
    saveIndicatorCompentenctSub,
    saveIndicatorCompentenctMain
};