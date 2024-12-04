export interface IGetDept {

  dept_cd : string;
  dept_name : string;
  total_Employee : string;
  total_Employee_is_assessment : string;
  total_Employee_wait_assessment : string
}






export interface IGetSection {

    sect_cd : string;
    sect_name : string;
    total_Employee : string;
    total_Employee_is_assessment : string;
    total_Employee_wait_assessment : string
  }


  export interface IGetGroup {

    group_cd : string;
    group_name : string;
    total_Employee : string;
    total_Employee_is_assessment : string;
    total_Employee_wait_assessment : string
  }


  export interface AssessmentList {
    evaluteYear: string;
    empCode: string;
    name: string;
    posit: string;
    dept: string;
    dvName: string;
    coreLevel: string;
    scroce: string;
    evaluteBy: string;
    evaluteDate: string;
    evaluteStatus: string;
    approveBy: string;
    approveDate: string;
    approveStatus: string;
  }
  



