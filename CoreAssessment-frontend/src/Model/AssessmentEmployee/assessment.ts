export interface CoreCompentencyTitle {
    cc_name : string;
    cc_desc : string;
    cc_title : string;
    cc_Behavior : BehaviorSub[]
    cc_knowledge:Knowlegde[]
    cc_skill:string[]
 
  }



  export interface BehaviorSub {
    sub_name:string
  }

  export interface Knowlegde {
    kl_name:string
    kl_status:string
  }


  export interface Skill {
    skill_name:string
  }


  export interface AssessmentScore {
    
    cD_Rev:string;
    cD_Name:string
    cD_EmpCode:string;
    cD_ExpectedScore:number
    cD_ActualScore:number
    cD_Gap:number
    cD_Comment:string
    cD_Assessor:string
  }


  export interface AssessmentScoreMain {
    
    CC_Rev : string;
    CC_EmpCode:string;
    CC_CoreLevel:number;
    CC_EvaluteStatus:string;
    CC_EvaluteBy:string;
  }



