export interface elearningModel {
    course_name?:string;
    employeeIsLearing?:number;
    employeeIsLearingPercent?:number;
    totalEmployee?:number;
    

  }

  export interface elearningModel2 {
    dvcd_name?:string;
    employeeIsLearing?:number;
    employeeIsLearingPercent?:number;
    totalEmployee?:number;
    

  }


  export interface complianceTrainingInfoModal
  {
      section :string
      section_cd:string
      result :complianceResultTraining
  }
 
  export interface complianceResultTraining
  { 
      totalEmployeeLearing:number

      totalEmployee :number
 
      totalAttendanceExpect:number
 
      percentAttendance:number
 
 
      employeeList :employeeList[]
 
  }
 
  export interface  employeeList
  {   
 
      code:string
      name:string
      position:string

      result:string
 
  }



  export interface  sectionChart
  {   
    section_short:string
      section_long:string
      cc001:number
      cc002:number

      cc003:number
      cc004:number

      cc005:number

      percent:number
 
  }
  
  