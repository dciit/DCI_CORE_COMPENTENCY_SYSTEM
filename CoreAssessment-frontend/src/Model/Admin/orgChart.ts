import { Grid } from '@mui/material';
import { dept } from './../../constant/authen';
export interface OrgChartDept {
    dept_cd?:string;
    dept_name?:string;
    dept_persons?:OrgChartEmployeeApprove[]

  }


   export interface OrgChartEmployeeApprove {

    dept_person?:string;
    sections?:OrgChartSection[];

  }

  export interface OrgChartSection {
    sect_name?:string;
    sect_cd?:string;
    sect_person?:string;
    grps?:OrgChartGroup[];

  }
  

  export interface OrgChartGroup {
    grp_cd?:string;
    grp_name?:string;
    grp_person?:string;


  }

  export interface Depts {
    dept_cd?:string;
    dept_name?:string;
    sects:Sects[]
  }

  export interface Sects {
    sect_cd?:string;
    sect_name?:string;
    groups:Groups[]
  }


  export interface Groups {
    grp_cd?:string;
    grp_name?:string;
  }


  