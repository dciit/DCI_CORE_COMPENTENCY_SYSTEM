export interface TISPayload {
    stDate?:string;
    enDate?:string;
    courseCode?:string;
    

  }


  export interface TISSchedule {

    course_code?:string;
    course_name?:string;
    trainer?:string;
    location?:string
    scst_date?:Date;
    scen_date?:Date;
    

  }


  export interface TISTrainee {

    dept?:string;
    sect?:string;
    grp?:string;
    code?:Date;
    posit?:Date;
    

  }


