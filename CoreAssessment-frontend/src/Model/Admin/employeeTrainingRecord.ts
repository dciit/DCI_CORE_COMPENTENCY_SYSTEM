
export interface ICourse {
    course_code?:string;
    totalEmployee?:string;
    resultEmployeeAssessment?:string;
    employees?:IEmployee[];

  }

  export interface IEmployee {
    code?:string;
    fname?:string;
    lname?:string;
    position?:string;
    status?:string;
    workingAge_Year?:string;
    workingAge_TotalDay?:string;
    workingAge_Month?:string;
    workingAge_Day?:string;
    joinDate?:Date

  }
  