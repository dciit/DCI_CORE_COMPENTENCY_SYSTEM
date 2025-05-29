using CoreAssessment_backend.Model;
using CoreAssessment_backend.Model.Admin;
using CoreAssessment_backend.Model.ComplianceTrainingRecord;
using CoreAssessment_backend.Model.DashboardBarCharts;
using CoreAssessment_backend.Model.RuleTree;
using CoreAssessment_backend.Model.TIS;
using CoreAssessment_backend.Service.ADMIN;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Data.SqlTypes;
using System.Net.NetworkInformation;
using static CoreAssessment_backend.Model.Admin.Organization;
using static CoreAssessment_backend.Model.Elearning.ElearningReport;

namespace CoreAssessment_backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");
        private OragaiztionService oragaiztionSrv = new OragaiztionService();
        // GET: AdminController


        [HttpGet]
        [Route("CompentencyRound")]
        public IActionResult SetCompentencyRoundREV()
        {
            List<CompentencyRoundREV> _compentencyList = new List<CompentencyRoundREV> { };


            SqlCommand sqlGetDvcdByCode = new SqlCommand();
            sqlGetDvcdByCode.CommandText = @" SELECT [CODE],[ST_DATE],[EN_DATE],[STATUS]
                                             FROM [dbDCI].[dbo].[TR_CompentencyREV]";


            DataTable dtTotalScore = oCOnnDCI.Query(sqlGetDvcdByCode);

            if (dtTotalScore.Rows.Count > 0)
            {
                foreach (DataRow drow in dtTotalScore.Rows)
                {


                    CompentencyRoundREV compentencyRoundREV = new CompentencyRoundREV();
                    compentencyRoundREV.code = drow["CODE"].ToString();
                    compentencyRoundREV.stDate = Convert.ToDateTime(drow["ST_DATE"]).ToString("yyyy-MM-dd HH:mm:ss");
                    compentencyRoundREV.enDate = Convert.ToDateTime(drow["EN_DATE"]).ToString("yyyy-MM-dd HH:mm:ss");
                    compentencyRoundREV.status = Convert.ToBoolean(drow["STATUS"].ToString());


                    _compentencyList.Add(compentencyRoundREV);


                }
            }

            return Ok(_compentencyList);

        }


        [HttpGet]
        [Route("getDepts")]
        public IActionResult getDepts()
        {

            List<string> depts = new List<string>();

            SqlCommand GroupCourse = new SqlCommand();
            GroupCourse.CommandText = @" select DEPT_NAME from HRD_DEPT where ACTIVE = 'ACTIVE' ";


            DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);


            if (dtGroupCourse.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGroupCourse.Rows)
                {

                    depts.Add(drow["DEPT_NAME"].ToString());


                }
            }


            return Ok(depts);
        }




        [HttpGet]
        [Route("getSection/{Dept}")]
        public IActionResult getSectionByDepts(string Dept)
        {

            List<string> depts = new List<string>();

            SqlCommand GroupCourse = new SqlCommand();
            GroupCourse.CommandText = $@" 
				                         select SECT_NAME from HRD_SECT sect
				                         inner join HRD_DEPT dept on dept.DEPT_NAME = '{Dept}' and dept.DEPT_CD = sect.DEPT_CD
				                         where sect.ACTIVE = 'ACTIVE' ";


            DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);


            if (dtGroupCourse.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGroupCourse.Rows)
                {

                    depts.Add(drow["SECT_NAME"].ToString());


                }
            }


            return Ok(depts);
        }


        [HttpPost]
        [Route("getDataAttendanceByDept")]
        public async Task<IActionResult> getDataAttendanceBySectionAsync()
        {
            //List<EmployeeAttendanceReport> _EmployeeAttendanceReportMain = new List<EmployeeAttendanceReport>();
            List<IGroup> _groupMain = new List<IGroup>();
            string sect = "";
            using (var reader = new StreamReader(Request.Body))
            {
                var body = await reader.ReadToEndAsync();
                JObject data = JObject.Parse(body);

                 sect = data["section"]?.ToString();
              

                
            }


            SqlCommand Section = new SqlCommand();
            Section.CommandText = $@" 
                                             
				                           select SECT_CD, SECT_NAME , NOTE from HRD_SECT 
				                           INNER JOIN DictMstr dict on dict.REF_2 = SECT_NAME
				                           where SECT_NAME = '{sect}'
				                           order by SECT_CD ";


            DataTable dtSection = oCOnnDCI.Query(Section);


            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drowSection in dtSection.Rows)
                {
                    //EmployeeAttendanceReport employeeAttendanceReport = new EmployeeAttendanceReport();
                    //employeeAttendanceReport.section = drowSection["SECT"].ToString();



                    SqlCommand GroupandResult = new SqlCommand();
                    GroupandResult.CommandText = @" 
                                             SELECT DV_CD,DV_ENAME,COUNT(emp.CODE) totalEmployee,COUNT(CC_EmpCode) totalAssessment FROM DVCD_Master
                                             LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' 
                                             LEFT JOIN TR_CompetenctAssessment_DEV dev on dev.CC_EmpCode = emp.CODE and CC_ApproveStatus ='Approve' and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())
 
                                             where SECT_CD = '" + drowSection["SECT_CD"].ToString() + @"' and DV_CD <> '" + drowSection["SECT_CD"].ToString() + @"' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') 
                                             GROUP BY  DV_CD,DV_ENAME ";
                    DataTable dtGroupandResult = oCOnnDCI.Query(GroupandResult);
                    if (dtGroupandResult.Rows.Count > 0)
                    {
                        foreach (DataRow drowGroupandResul in dtGroupandResult.Rows)
                        {
                            List<IEmployee> _employeeMain = new List<IEmployee>();
                            IGroup oGroup = new IGroup();

                            oGroup.grp_name = drowGroupandResul["DV_ENAME"].ToString();
                            oGroup.grp_cd = drowGroupandResul["DV_CD"].ToString();
                            oGroup.totalEmployee = Convert.ToDecimal(drowGroupandResul["totalEmployee"]);
                            oGroup.resultEmployeeAssessment = Convert.ToDecimal(drowGroupandResul["totalAssessment"]);



                            SqlCommand findStatusEmployeeInGroup = new SqlCommand();
                            findStatusEmployeeInGroup.CommandText = @" 
                                             SELECT CODE,TNAME,TSURN,POSIT, CASE  
                                                                                  WHEN   (COUNT(CC_EmpCode) > 0) and (CC_EvaluteStatus = 'Pending')  then 'รอการ Confirm'
									                                              WHEN   (COUNT(CC_EmpCode) > 0) and (CC_ApproveStatus = 'Pending')  then 'รอการ Approve'
									                                              WHEN   (COUNT(CC_EmpCode) > 0) and CC_ApproveStatus = 'Approve'  then 'ประเมินแล้ว'
		                                                                          ELSE 'ไม่ได้ประเมิน'
	                                                                 END result
                                                                      ,[JOIN]
 
	                                         FROM Employee
                                             LEFT JOIN TR_CompetenctAssessment_DEV on CC_EmpCode = CODE   and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())
                                             where DVCD = '" + drowGroupandResul["DV_CD"].ToString() + @"' and  RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV')
                                             GROUP BY  CODE,TNAME,TSURN,POSIT ,CC_EvaluteStatus,CC_ApproveStatus ,[JOIN]";
                            DataTable dtfindStatusEmployeeInGroup = oCOnnDCI.Query(findStatusEmployeeInGroup);
                            if (dtfindStatusEmployeeInGroup.Rows.Count > 0)
                            {
                                foreach (DataRow drowfindStatusEmployeeInGroup in dtfindStatusEmployeeInGroup.Rows)
                                {
                                    IEmployee oEmployee = new IEmployee();
                                    oEmployee.fname = drowfindStatusEmployeeInGroup["TNAME"].ToString();
                                    oEmployee.lname = drowfindStatusEmployeeInGroup["TSURN"].ToString();
                                    oEmployee.code = drowfindStatusEmployeeInGroup["CODE"].ToString();
                                    oEmployee.position = drowfindStatusEmployeeInGroup["POSIT"].ToString();
                                    oEmployee.status = drowfindStatusEmployeeInGroup["result"].ToString();

                                    oEmployee.JoinDate = Convert.ToDateTime(drowfindStatusEmployeeInGroup["JOIN"]);
                                    TimeSpan diff = DateTime.Now.Date - oEmployee.JoinDate.Value.Date;
                                    double result = diff.TotalDays;

                                    var totalYears = Math.Truncate(result / 365);
                                    var totalMonths = Math.Truncate((result % 365) / 30);
                                    var remainingDays = Math.Truncate((result % 365) % 30);

                                    oEmployee.WorkingAge_TotalDay = (int)result;
                                    oEmployee.WorkingAge_Year = (int)totalYears;
                                    oEmployee.WorkingAge_Month = (int)totalMonths;
                                    oEmployee.WorkingAge_Day = (int)remainingDays;

                                    _employeeMain.Add(oEmployee);

                                }
                            }
                            oGroup.employees = _employeeMain;
                            _groupMain.Add(oGroup);

                        }

                        //employeeAttendanceReport.groups = _groupsMain;
                    }

                }
            }




            return Ok(_groupMain);
        }



        [HttpGet]
        [Route("getDataAttendanceManager/{dept}")]
        public IActionResult getDataAttendanceManager(string dept)
        {
            //List<EmployeeAttendanceReport> _EmployeeAttendanceReportMain = new List<EmployeeAttendanceReport>();
            List<IGroup> _groupMain = new List<IGroup>();

       


            SqlCommand Section = new SqlCommand();
            Section.CommandText = $@" 
                                             select SECT_CD, SECT_NAME , NOTE from HRD_DEPT dept
                                                       INNER join HRD_SECT sect on dept.DEPT_CD = sect.DEPT_CD
                                                       INNER JOIN DictMstr dict on dict.REF_2 = SECT_NAME
                                                       where dept.DEPT_NAME = '{dept}'
                                                       order by SECT_CD ";


            DataTable dtSection = oCOnnDCI.Query(Section);


            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drowSection in dtSection.Rows)
                {
                    //EmployeeAttendanceReport employeeAttendanceReport = new EmployeeAttendanceReport();
                    //employeeAttendanceReport.section = drowSection["SECT"].ToString();



                    SqlCommand GroupandResult = new SqlCommand();
                    GroupandResult.CommandText = @" 
                                             SELECT SECT_CD,SECT_NAME,COUNT(emp.CODE) totalEmployee,COUNT(CC_EmpCode) totalAssessment FROM HRD_SECT
                                             LEFT JOIN Employee emp on emp.DVCD = SECT_CD and RESIGN = '1900-01-01' 
                                             LEFT JOIN TR_CompetenctAssessment_DEV dev on dev.CC_EmpCode = emp.CODE and CC_ApproveStatus ='Approve'
 
                                             where SECT_CD = '" + drowSection["SECT_CD"].ToString() + @"'  and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') 
                                             GROUP BY  SECT_CD,SECT_NAME ";
                    DataTable dtGroupandResult = oCOnnDCI.Query(GroupandResult);
                    if (dtGroupandResult.Rows.Count > 0)
                    {
                        foreach (DataRow drowGroupandResul in dtGroupandResult.Rows)
                        {
                            List<IEmployee> _employeeMain = new List<IEmployee>();
                            IGroup oGroup = new IGroup();

                            oGroup.grp_name = drowGroupandResul["SECT_NAME"].ToString();
                            oGroup.grp_cd = drowGroupandResul["SECT_CD"].ToString();
                            oGroup.totalEmployee = Convert.ToDecimal(drowGroupandResul["totalEmployee"]);
                            oGroup.resultEmployeeAssessment = Convert.ToDecimal(drowGroupandResul["totalAssessment"]);


                            SqlCommand findStatusEmployeeInGroup = new SqlCommand();
                            findStatusEmployeeInGroup.CommandText = @" 
                                             SELECT CODE,TNAME,TSURN,POSIT, CASE  
                                        WHEN   (COUNT(CC_EmpCode) > 0) and (CC_EvaluteStatus = 'Pending')  then 'รอการ Confirm'
									                                              WHEN   (COUNT(CC_EmpCode) > 0) and (CC_ApproveStatus = 'Pending')  then 'รอการ Approve'
									                                              WHEN   (COUNT(CC_EmpCode) > 0) and CC_ApproveStatus = 'Approve'  then 'ประเมินแล้ว'
		                                                                          ELSE 'ไม่ได้ประเมิน'
	                                                                 END result
 
	                                         FROM Employee
                                             LEFT JOIN TR_CompetenctAssessment_DEV on CC_EmpCode = CODE  
                                             where DVCD = '" + drowGroupandResul["SECT_CD"].ToString() + @"' and  RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') 
                                             GROUP BY  CODE,TNAME,TSURN,POSIT ,CC_EvaluteStatus,CC_ApproveStatus";
                            DataTable dtfindStatusEmployeeInGroup = oCOnnDCI.Query(findStatusEmployeeInGroup);
                            if (dtfindStatusEmployeeInGroup.Rows.Count > 0)
                            {
                                foreach (DataRow drowfindStatusEmployeeInGroup in dtfindStatusEmployeeInGroup.Rows)
                                {
                                    IEmployee oEmployee = new IEmployee();
                                    oEmployee.fname = drowfindStatusEmployeeInGroup["TNAME"].ToString();
                                    oEmployee.lname = drowfindStatusEmployeeInGroup["TSURN"].ToString();
                                    oEmployee.code = drowfindStatusEmployeeInGroup["CODE"].ToString();
                                    oEmployee.position = drowfindStatusEmployeeInGroup["POSIT"].ToString();
                                    oEmployee.status = drowfindStatusEmployeeInGroup["result"].ToString();

                                    _employeeMain.Add(oEmployee);

                                }
                            }
                            oGroup.employees = _employeeMain;
                            _groupMain.Add(oGroup);

                        }

                        //employeeAttendanceReport.groups = _groupsMain;
                    }

                }
            }




            return Ok(_groupMain);
        }

        [HttpGet]
        [Route("getDataDashboard")]
        public IActionResult getDashboard()
        {
            int j = 0;
            int i = 0;
            int z = 0;
            // 42 = จำนวนแผนกมี 42 แผนก
            string[] LabelCharts = new string[42];
            decimal[] data = new decimal[42];
            int[] countEmployeeIsLearing = new int[42];
            int[] countTotalEmployeeInSection = new int[42];

            // bar chart 
            try
            {
                SqlCommand GroupCourse = new SqlCommand();
                GroupCourse.CommandText = @" SELECT distinct DEPT_NAME FROM HRD_DEPT ";


                DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);
                string[] temp = new string[dtGroupCourse.Rows.Count];


                if (dtGroupCourse.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtGroupCourse.Rows)
                    {

                       




                        SqlCommand findGrpBySection = new SqlCommand();
                        findGrpBySection.CommandText =$@"  
                                                     select SECT_CD, SECT_NAME , NOTE from HRD_DEPT dept
                                                       INNER join HRD_SECT sect on dept.DEPT_CD = sect.DEPT_CD
                                                       INNER JOIN DictMstr dict on dict.REF_2 = SECT_NAME
                                                       where dept.DEPT_NAME = '{drow["DEPT_NAME"].ToString().Trim()}'

                                                       order by SECT_CD";



                        DataTable dtfindGrpBySection = oCOnnDCI.Query(findGrpBySection);
                        //LabelCharts = new string[dtfindGrpBySection.Rows.Count];

                        if (dtfindGrpBySection.Rows.Count > 0)
                        {
                            foreach (DataRow drowFindGrpBySection in dtfindGrpBySection.Rows)
                            {

                                LabelCharts[z] = drowFindGrpBySection["NOTE"].ToString();
                                z++;

                                SqlCommand findGroupLoop3 = new SqlCommand();
                                findGroupLoop3.CommandText = $@"                                               
                                                   SELECT grp.SECT_CD FROM HRD_GRP grp
                                                                  INNER JOIN HRD_SECT sect on sect.SECT_CD = grp.SECT_CD
                                                                  where sect.SECT_CD = '{drowFindGrpBySection["SECT_CD"].ToString().Trim()}'

                                                                  UNION 

                                                                  SELECT GRP_CD FROM HRD_GRP grp
                                                                  INNER JOIN HRD_SECT sect on sect.SECT_CD = grp.SECT_CD
                                                                  where sect.SECT_CD = '{drowFindGrpBySection["SECT_CD"].ToString().Trim()}'";

                                findGroupLoop3.Parameters.Add(new SqlParameter("@SECTCD", drowFindGrpBySection["SECT_CD"]));
                                DataTable dtfindGroupLoop3 = oCOnnDCI.Query(findGroupLoop3);

                                if (dtfindGroupLoop3.Rows.Count > 0)
                                {
                                    string sect_cd = "";
                                    foreach (DataRow drowfindGroupLoop3 in dtfindGroupLoop3.Rows)
                                    {
                                        sect_cd += "'" + drowfindGroupLoop3["SECT_CD"] + "',";
                                    }
                                    sect_cd = sect_cd.Substring(0, sect_cd.Length - 1);


                                    // หาจำนวนพนักงานทั้งหมดในแผนก
                                    SqlCommand findPercentEmployeeLearningLoop4 = new SqlCommand();
                                    findPercentEmployeeLearningLoop4.CommandText = @"  
                                       SELECT 
                                      COUNT(CC_EmpCode) empIsEvaluted, 
                                     (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV'))  totalEmployeeInSect ,
                                      CAST(CAST((COUNT(CC_EmpCode)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @")  and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV')) as decimal(10,2)) PercentEmployeeIsEvaluted

                                     FROM TR_CompetenctAssessment_DEV
                                     INNER JOIN Employee emp on emp.CODE = CC_EmpCode  and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and RESIGN = '1900-01-01' 
                                     where emp.DVCD IN (" + sect_cd + @") and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())";

                                    DataTable dtfindPercentEmployeeLearningLoop4 = oCOnnDCI.Query(findPercentEmployeeLearningLoop4);

                                    if (dtfindPercentEmployeeLearningLoop4.Rows.Count > 0)
                                    {
                                        foreach (DataRow drowdtfindPercentEmployeeLearningLoop4 in dtfindPercentEmployeeLearningLoop4.Rows)
                                        {
                                            data[i] = (Convert.ToDecimal(drowdtfindPercentEmployeeLearningLoop4["PercentEmployeeIsEvaluted"]));
                                            countEmployeeIsLearing[i] = Convert.ToInt16(drowdtfindPercentEmployeeLearningLoop4["empIsEvaluted"]);
                                            countTotalEmployeeInSection[i] = Convert.ToInt16(drowdtfindPercentEmployeeLearningLoop4["totalEmployeeInSect"]);
                                            i++;
                                        }
                                    }




                                }


                            }



                        }


                    }
                }
            }





            catch (Exception ex)
            {
            }


            int count_empNotEvaluted = 0;
            int count_empWaitConfirm = 0;
            int count_empWaitApprove = 0;
            int count_empApprove = 0;

            // 4 card
            try
            {

                // card 1

                SqlCommand query_empNotEvaluted = new SqlCommand();
                query_empNotEvaluted.CommandText = @"   SELECT COUNT(CODE) count_empNotEvaluted FROM Employee where POSIT NOT IN ('TR','DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and RESIGN = '1900-01-01' 
                                                and CODE NOT IN (SELECT CC_EmpCode FROM TR_CompetenctAssessment_DEV where SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())) 
                    and DVCD NOT IN ('9110') ";


                DataTable dtquery_empNotEvaluted = oCOnnDCI.Query(query_empNotEvaluted);



                if (dtquery_empNotEvaluted.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtquery_empNotEvaluted.Rows)
                    {

                        count_empNotEvaluted = Convert.ToInt32(drow["count_empNotEvaluted"]);


                    }
                }


                // card 2

                SqlCommand query_empWaitConfirm = new SqlCommand();
                query_empWaitConfirm.CommandText = @"    SELECT COUNT(CC_EmpCode) empWaitConfirm FROM TR_CompetenctAssessment_DEV where CC_EvaluteStatus = 'Pending'
                                                         and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())";


                DataTable dtquery_empWaitConfirm = oCOnnDCI.Query(query_empWaitConfirm);



                if (dtquery_empWaitConfirm.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtquery_empWaitConfirm.Rows)
                    {

                        count_empWaitConfirm = Convert.ToInt32(drow["empWaitConfirm"]);


                    }
                }



                // card 3

                SqlCommand query_empWaitApprove = new SqlCommand();
                query_empWaitApprove.CommandText = @"      SELECT COUNT(CC_EmpCode) empWaitApprove FROM TR_CompetenctAssessment_DEV
                                                         where CC_EvaluteStatus = 'Confirm' and CC_ApproveStatus = 'Pending' and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE()) ";


                DataTable dtquery_empWaitApprove = oCOnnDCI.Query(query_empWaitApprove);



                if (dtquery_empWaitApprove.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtquery_empWaitApprove.Rows)
                    {

                        count_empWaitApprove = Convert.ToInt32(drow["empWaitApprove"]);


                    }
                }



                // card 4

                SqlCommand query_empApprove = new SqlCommand();
                query_empApprove.CommandText = @"SELECT COUNT(CC_EmpCode) count_empApprove FROM TR_CompetenctAssessment_DEV
                                                 where CC_EvaluteStatus = 'Confirm' and CC_ApproveStatus = 'Approve' and SUBSTRING(CC_REV,0,5) = YEAR           (GETDATE())";


                DataTable dtquery_empApprove = oCOnnDCI.Query(query_empApprove);



                if (dtquery_empApprove.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtquery_empApprove.Rows)
                    {

                        count_empApprove = Convert.ToInt32(drow["count_empApprove"]);


                    }
                }





            }
            catch (Exception ex2)
            {

            }



            // donut chart
            string[] coreLevel = new string[5];
            int[] totalEmp = new int[5];
            int k = 0;
            try
            {

                SqlCommand query_empNotEvaluted = new SqlCommand();
                query_empNotEvaluted.CommandText = @"  SELECT [CoreLevel],COUNT([CC_EmpCode]) totalEmp    
                                                       FROM [dbDCI].[dbo].[vi_TR_CompentencyAssessment_Count_EmployeeEvaluted_CoreLevel]
                                                       GROUP BY CoreLevel";


                DataTable dtquery_empNotEvaluted = oCOnnDCI.Query(query_empNotEvaluted);
                Array.Resize(ref coreLevel, dtquery_empNotEvaluted.Rows.Count);
                Array.Resize(ref totalEmp, dtquery_empNotEvaluted.Rows.Count);


                if (dtquery_empNotEvaluted.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtquery_empNotEvaluted.Rows)
                    {
                        coreLevel[k] = "LEVEL " + Convert.ToInt32(drow["CoreLevel"]).ToString();
                        totalEmp[k] = Convert.ToInt32(drow["totalEmp"]);


                        k++;
                    }
                }
            }
            catch (Exception ex3)
            {

            }



            // Donut chart
            //string[] coreLevel = new string[5];
            //int[] totalEmp = new int[5];
            //int k = 0;
            //try
            //{

            //    SqlCommand query_empNotEvaluted = new SqlCommand();
            //    query_empNotEvaluted.CommandText = $@"  SELECT  [CoreLevel] , COUNT([CODE]) totalEmp
            //                                           FROM [dbDCI].[dbo].[vi_TR_CompentencyAssessment_CoreLevel]
            //                                           GROUP BY [CoreLevel]";


            //    DataTable dtquery_empNotEvaluted = oCOnnDCI.Query(query_empNotEvaluted);
            //    Array.Resize(ref coreLevel, dtquery_empNotEvaluted.Rows.Count);
            //    Array.Resize(ref totalEmp, dtquery_empNotEvaluted.Rows.Count);


            //    if (dtquery_empNotEvaluted.Rows.Count > 0)
            //    {
            //        foreach (DataRow drow in dtquery_empNotEvaluted.Rows)
            //        {
            //            coreLevel[k] = "LEVEL " + Convert.ToInt32(drow["CoreLevel"]).ToString();
            //            totalEmp[k] = Convert.ToInt32(drow["totalEmp"]);


            //            k++;
            //        }
            //    }
            //}
            //catch (Exception ex3)
            //{

            //}

            return Ok(new
            {
                labelChart = LabelCharts,
                dataChart = data,
                countEmployeeIsEvaluted = countEmployeeIsLearing,
                countTotalEmployeeInSection = countTotalEmployeeInSection,
                coreLevel = coreLevel,
                totalEmp = totalEmp,
                count_empNotEvaluted = count_empNotEvaluted,
                count_empWaitConfirm = count_empWaitConfirm,
                count_empWaitApprove = count_empWaitApprove,
                count_empApprove = count_empApprove


            });
        }


        [HttpGet]
        [Route("getOrgChart/{dept}")]
        public IActionResult getOrgChart(string dept)
        {
            List<OrgChartDept> orgChart = new List<OrgChartDept>();



            SqlCommand getDeptCD = new SqlCommand();
            getDeptCD.CommandText = @" SELECT DEPT_CD, DEPT FROM DVCD_Master
                                      where DEPT = '" + dept + @"' and DEPT_CD != '4000'
                                      and SECT != 'DESIGN DEVELOPMENT'
                                      GROUP BY DEPT_CD,DEPT";


            DataTable dtgetDeptCD = oCOnnDCI.Query(getDeptCD);


            if (dtgetDeptCD.Rows.Count > 0)
            {
                foreach (DataRow drow in dtgetDeptCD.Rows)
                {


                    SqlCommand getDeptData = new SqlCommand();
                    getDeptData.CommandText = $@"  SELECT DEPT_CD,DEPT, STRING_AGG(ApproveBy, ',') empcode ,full_name AS GM_Evaluated_Approve
                                                    FROM 
                        (SELECT distinct DEPT_CD,dvcd.DEPT,flow.ApproveBy  
                        ,dict.NOTE + '-' + flow.ApproveBy + '-' + emp.NAME + '.' + SUBSTRING(emp.SURN,0,2) full_name
                     FROM TR_CompentencyApproveFlow flow
                     INNER JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD and DEPT_CD = '" + drow["DEPT_CD"].ToString() + @"'
                     INNER JOIN Employee emp on emp.CODE = ApproveBy
                     INNER JOIN DictMstr dict on dict.REF_2 = emp.POSIT
                      where CoreLevel IN (2,3,4,5) and flow.Dept = '" + dept + @"') flow
                        GROUP BY 
                       DEPT_CD,
                       DEPT,
                       full_name
                    ORDER BY 
                        DEPT_CD";


                    DataTable dtgetDeptData = oCOnnDCI.Query(getDeptData);


                    if (dtgetDeptData.Rows.Count > 0)
                    {
                        foreach (DataRow drow2 in dtgetDeptData.Rows)
                        {
                            List<OrgChartEmployeeApprove> emp_approve_list = new List<OrgChartEmployeeApprove>();

                            OrgChartDept depts = new OrgChartDept();

                            depts.dept_cd = drow2["DEPT_CD"].ToString();
                            depts.dept_name = drow2["DEPT"].ToString();


                            string[] dept_persons = drow2["empcode"].ToString().Split(',');
                            if (dept_persons.Length >= 0)
                            {
                                foreach (string empcode in dept_persons)
                                {   

                                    List<OrgChartSection> section_list = new List<OrgChartSection>();

                                    OrgChartEmployeeApprove orgChartEmployeeApprove = new OrgChartEmployeeApprove();
                                    orgChartEmployeeApprove.dept_person = drow2["GM_Evaluated_Approve"].ToString();

                                    SqlCommand getSectionData = new SqlCommand();
                                    getSectionData.CommandText = $@"  SELECT SECT_CD, SECT, STRING_AGG(Evaluted_Approve, ',') AS MG_Evaluated_Approve
                                    FROM (SELECT distinct SECT_CD,SECT, dict.NOTE + '-' + flow.EvalulateBy + '-' + emp.NAME + '.' + SUBSTRING(emp.SURN,0,2) Evaluted_Approve  FROM TR_CompentencyApproveFlow flow
                                    INNER JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD and DEPT_CD = '" + drow2["DEPT_CD"].ToString() + @"' 
                                    INNER JOIN Employee emp on emp.CODE = EvalulateBy
                                    INNER JOIN DictMstr dict on dict.REF_2 = emp.POSIT
                                    where CoreLevel IN (2,3,4) and flow.Dept = '" + dept + @"' and ApproveBy = '" + empcode + @"') flow
                                    GROUP BY 
                                        SECT_CD, 
                                        SECT
                                    ORDER BY 
                                        SECT_CD";

                                    DataTable dtgetSectionData = oCOnnDCI.Query(getSectionData);
                                    if (dtgetSectionData.Rows.Count > 0)
                                    {
                                        foreach (DataRow drow3 in dtgetSectionData.Rows)
                                        {
                                            List<OrgChartGroup> grp_list = new List<OrgChartGroup>();
                                            OrgChartSection sections = new OrgChartSection();

                                            sections.sect_cd = drow3["SECT_CD"].ToString();
                                            sections.sect_name = drow3["SECT"].ToString();
                                            sections.sect_person = drow3["MG_Evaluated_Approve"].ToString();


                                            SqlCommand getGroupData = new SqlCommand();
                                            getGroupData.CommandText = $@" SELECT GRP_CD, GRP, STRING_AGG(SU_Evaluted, ',') AS SU_Evaluated
                                    FROM (SELECT GRP_CD, GRP,dict.NOTE + '-' + flow.EvalulateBy + '-' + emp.NAME + '.' + SUBSTRING(emp.SURN,0,2) SU_Evaluted 
                                     FROM DVCD_Master dvcd
                                     LEFT JOIN TR_CompentencyApproveFlow flow on GRP_CD = flow.DV_CD and  CoreLevel IN (1) and flow.Dept = '" + dept + @"'
                                     LEFT JOIN Employee emp on emp.CODE = EvalulateBy
                                     LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT
                                     where  SECT_CD = '" + drow3["SECT_CD"].ToString() + @"' and SECT <> '" + drow3["SECT_CD"].ToString() + @"' and GRP_CD != '' and GRP_CD NOT IN ('1130','1140') ) flow
                                    GROUP BY 
                                        GRP_CD, 
                                        GRP
                                    ORDER BY 
                                        GRP_CD";

                                            DataTable dtgetGroupData = oCOnnDCI.Query(getGroupData);
                                            if (dtgetGroupData.Rows.Count > 0)
                                            {
                                                foreach (DataRow drow4 in dtgetGroupData.Rows)
                                                {
                                                    OrgChartGroup groups = new OrgChartGroup();
                                                    groups.grp_cd = drow4["GRP_CD"].ToString();
                                                    groups.grp_name = drow4["GRP"].ToString();
                                                    groups.grp_person = drow4["SU_Evaluated"].ToString();

                                                    grp_list.Add(groups);


                                                }
                                            }
                                            sections.grps = grp_list;
                                            section_list.Add(sections);
                                        }


                                    }
                                    orgChartEmployeeApprove.sections = section_list;
                                    emp_approve_list.Add(orgChartEmployeeApprove);
                                }

                               
                            }
                            depts.dept_persons = emp_approve_list;
                            orgChart.Add(depts);



                        }


                    }
                }

            }
            //List<OrgChartDept> orgChart_Clone = new List<OrgChartDept>();

            //if (dept == "MANUFACTURING CONTROL")
            //{
            //    foreach (OrgChartDept item_dept in orgChart)
            //    {
            //        OrgChartDept orgChartDept = new OrgChartDept();
            //        orgChartDept.sections = item_dept.sections;
            //    }
            //}

            return Ok(orgChart);
        }


        [HttpGet]
        [Route("getTIS/{level}")]
        public IActionResult getTisByLevel(int level)
        {
            string[] LabelCharts = new string[42];
            decimal[] data = new decimal[42];
            int[] countEmployeeIsLearing = new int[42];
            int[] countTotalEmployeeInSection = new int[42];
            int i = 0;

            SqlCommand GroupCourse = new SqlCommand();
            GroupCourse.CommandText = @" getDataAttendanceByDept
            SELECT COURSE_CODE,COUNT(EMPCODE) employeeIsLearn   FROM (

            SELECT
	            COURSE_CODE
	            ,EMPCODE
              FROM [dbDCI].[dbo].[TR_Trainee_Data]
              INNER JOIN Employee emp on emp.CODE = EMPCODE and RESIGN = '1900-01-01' and POSIT IN (SELECT distinct  [POSIT] FROM [dbDCI].[dbo].[vi_TR_CoreCompetency] where CoreLevel = @LEVEL)
               where COURSE_CODE IN (SELECT distinct cct.COURSE_CODE as CourseName
                                     
                                                FROM [dbDCI].[dbo].[TR_CoreCompetency] cc
                                                LEFT JOIN [dbDCI].[dbo].[TR_CoreCompetencyDet] cct on cct.CoreCode = cc.CoreCode
                                                LEFT JOIN [dbDCI].[dbo].[TR_COURSE] course on course.COURSE_CODE = cct.COURSE_CODE
                                                INNER JOIN  [dbDCI].[dbo].[Employee] e ON e.POSIT = cc.CorePosit
                                                WHERE cc.CoreLevel = @LEVEL) and EVALUATE_RESULT ='P'
              GROUP BY COURSE_CODE,EMPCODE) a

              GROUP BY COURSE_CODE ";

            GroupCourse.Parameters.Add(new SqlParameter("@LEVEL", level));

            DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);
            Array.Resize(ref LabelCharts, dtGroupCourse.Rows.Count);
            Array.Resize(ref data, dtGroupCourse.Rows.Count);


            if (dtGroupCourse.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGroupCourse.Rows)
                {
                    LabelCharts[i] = drow["COURSE_CODE"].ToString();
                    data[i] = (Convert.ToDecimal(drow["employeeIsLearn"]));
                    i++;

                }
            }

            return Ok(

                new
                {
                    labelChart = LabelCharts,
                    dataChart = data
                }

             );
        }




        [HttpPost]
        [Route("loadTIS")]
        public IActionResult loadTIS([FromBody] payloadTIS tis)
        {

            if (tis == null)
            {
                return BadRequest("tis cannot be null");
            }

            SqlCommand GroupCourse = new SqlCommand();
            GroupCourse.CommandText = @" 
            SELECT  [EMPCODE] as CODE
	           ,emp.TNAME + ' ' + emp.TSURN as TFULLNAME
	           ,emp.NAME + ' ' + emp.SURN as FULLNAME
	           ,GRPOT
	           ,emp.[JOIN]
	           ,emp.RESIGN
	           ,emp.POSIT
	           ,emp.DVCD
	           ,CASE
			        WHEN dvcd.DEPT = '' THEN dvcd.SECT
			        ELSE dvcd.DEPT
		        END DEPT

	           ,CASE
			        WHEN dvcd.SECT = '' THEN dvcd.GRP
			        ELSE dvcd.SECT
		        END DEPT
	           ,CONVERT(VARCHAR(10), schedule.SCHEDULE_START, 103) as ST_DT
	           ,CONVERT(VARCHAR(10), schedule.SCHEDULE_END, 103) as END_DT
	           ,tr.COURSE_CODE
	           ,course.COURSE_NAME
	           ,schedule.TrainerType
              ,course.COURSE_PER_PERSON
	          ,schedule.LOCATION
	          ,CONVERT(VARCHAR(8),schedule.SCHEDULE_START,108) + '-' + CONVERT(VARCHAR(8),schedule.SCHEDULE_END,108) as PRD_TIME
	          ,schedule.TRAIN_DAY
	          ,tr.EVALUATE_RESULT as EVAL

		        ,tr.POST_TEST_RESULT as EVAL_SCORE

	          ,ISNULL(schedule.MARK,0) as TOTAL_MARK

	         , CASE
		          WHEN tr.POST_TEST_RESULT != '0' THEN 'TRUE'
		          WHEN tr.POST_TEST_RESULT = '0' THEN 'FALSE'
	
	          END 
	          as HAS_TEST

          FROM [dbDCI].[dbo].[TR_Trainee_Data] tr
          LEFT JOIN [dbDCI].[dbo].[Employee] emp ON emp.CODE = tr.EMPCODE
          LEFT JOIN [dbDCI].[dbo].[TR_Schedule] schedule ON schedule.SCHEDULE_CODE = tr.SCHEDULE_CODE and STATUS = 'ACTIVE'
          LEFT JOIN [dbDCI].[dbo].[TR_COURSE] course ON course.COURSE_CODE  = tr.COURSE_CODE
          LEFT JOIN [dbDCI].[dbo].[TR_EXAM_SET] exam ON exam.EXAM_SET_CODE = tr.EXAM_SET_CODE
          LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = emp.DVCD
          where SCHEDULE_START >= @STDATE and SCHEDULE_END <= @ENDATE and course.COURSE_CODE like @COURSE ";

            GroupCourse.Parameters.Add(new SqlParameter("@COURSE", tis.courseCode == "ALL" ? "%" : tis.courseCode));
            GroupCourse.Parameters.Add(new SqlParameter("@STDATE", tis.stDate + " 00:00"));
            GroupCourse.Parameters.Add(new SqlParameter("@ENDATE", tis.enDate + " 23:59"));


            DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);

            List<TIS> TISList = new List<TIS>(); 

            if (dtGroupCourse.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGroupCourse.Rows)
                {
                    TIS tIS = new TIS();
           
                    tIS.CODE = drow["CODE"].ToString().Trim();
                    tIS.TFULLNAME = drow["TFULLNAME"].ToString();
                    tIS.FULLNAME = drow["FULLNAME"].ToString();
                    tIS.GRPOT = drow["GRPOT"].ToString();
                    tIS.JOIN = drow["JOIN"].ToString();
                    tIS.RESIGN = drow["RESIGN"].ToString();
                    tIS.POSIT = drow["POSIT"].ToString();
                    tIS.DVCD = drow["DVCD"].ToString();
                    tIS.DEPT = drow["DEPT"].ToString();
                    tIS.ST_DT = drow["ST_DT"].ToString();
                    tIS.END_DT = drow["END_DT"].ToString();
                    tIS.COURSE_CODE = drow["COURSE_CODE"].ToString();
                    tIS.COURSE_NAME = drow["COURSE_NAME"].ToString();
                    tIS.TrainerType = drow["TrainerType"].ToString();
                    tIS.COURSE_PER_PERSON = drow["COURSE_PER_PERSON"].ToString();
                    tIS.LOCATION = drow["LOCATION"].ToString();
                    tIS.PRD_TIME = drow["PRD_TIME"].ToString();
                    tIS.TRAIN_DAY = drow["TRAIN_DAY"].ToString();
                    tIS.EVAL = drow["EVAL"].ToString();
                    tIS.EVAL_SCORE = drow["EVAL_SCORE"].ToString();
                    tIS.TOTAL_MARK = drow["TOTAL_MARK"].ToString();
                    tIS.HAS_TEST = drow["HAS_TEST"].ToString();

                    TISList.Add(tIS);


                }
            }

            return Ok(TISList);
        }




        [HttpGet]
        [Route("CourseCode")]
        public IActionResult getCourseCode()
        {

            int i = 0;

            SqlCommand GroupCourse = new SqlCommand();
            GroupCourse.CommandText = @" 
                                          SELECT distinct [COURSE_CODE]
                                          FROM [dbDCI].[dbo].[TR_COURSE] ";

   


            DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);

            string[] cc = new string[dtGroupCourse.Rows.Count + 1];
            cc[0] = "ALL";
            List<TIS> TISList = new List<TIS>();

            if (dtGroupCourse.Rows.Count > 0)
            {   

                foreach (DataRow drow in dtGroupCourse.Rows)
                {
                    cc[i+1] = drow["COURSE_CODE"].ToString();
                    i++;

                }
            }

            return Ok(cc);
        }


        [HttpGet]
        [Route("getTrainingToDay")]

        public IActionResult getTrainingToDays()
        {
            List<CalendarClass> calendarClasses = new List<CalendarClass>();

            try
            {
                SqlCommand TrainingRecord = new SqlCommand();
                TrainingRecord.CommandText = @" SELECT  
                                         (SELECT  [COURSE_CODE] FROM [dbDCI].[dbo].[TR_COURSE] WHERE ID = T.COURSE_ID) COURSE_CODE
                                        ,(SELECT  COURSE_NAME FROM [dbDCI].[dbo].[TR_COURSE] WHERE ID = T.COURSE_ID) COURSE_NAME
				                          ,[TRAINER],[LOCATION]
				                        ,[SCHEDULE_START],[SCHEDULE_END]
              
            
                                    FROM [dbDCI].[dbo].[TR_Schedule] T
                                    WHERE STATUS = 'ACTIVE' and DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) <= SCHEDULE_START and DATEADD(MONTH, DATEDIFF(MONTH, -1, GETDATE()), 0) >= SCHEDULE_START  and STATUS = 'ACTIVE'
                                    ORDER BY SCHEDULE_START ASC  ";


                DataTable dtTrainingRecord = oCOnnDCI.Query(TrainingRecord);
                if (dtTrainingRecord.Rows.Count > 0)
                {
                    foreach (DataRow row in dtTrainingRecord.Rows)
                    {


                        CalendarClass calendarClass = new CalendarClass();
                        calendarClass.course_code = row["COURSE_CODE"].ToString();
                        calendarClass.course_name = row["COURSE_NAME"].ToString();
                        calendarClass.trainer = row["TRAINER"].ToString();
                        calendarClass.location = row["LOCATION"].ToString();
                        calendarClass.scst_date = Convert.ToDateTime(row["SCHEDULE_START"]);
                        calendarClass.scen_date = Convert.ToDateTime(row["SCHEDULE_END"]);

                        calendarClasses.Add(calendarClass);

                    }
                }



            }



            catch (Exception ex)
            {
            }


            return Ok(calendarClasses);


        }


        [HttpPost]
        [Route("findTraineeByCourse")]



        [HttpGet]
        [Route("getOragaiztionTree")]
        public IActionResult getOragaiztionTree()
        {


            List<Depts> data = oragaiztionSrv.getDept();

            return Ok(data);

        }

        [NonAction]
        public IActionResult findTraineeByCourse(payloadTIS tis)
        {
            List<TraineeSchedule> _tisList = new List<TraineeSchedule>();

            try
            {
                SqlCommand TrainingRecord = new SqlCommand();
                TrainingRecord.CommandText = @$" 
                  
                      SELECT dvcd.DEPT , dvcd.SECT , dvcd.GRP , emp.CODE , emp.TNAME + ' ' + emp.TSURN [NAME], emp.POSIT [POSIT] FROM TR_Trainee_Data tr
                      INNER JOIN Employee emp on emp.CODE = tr.EMPCODE
                      INNER JOIN DVCD_Master dvcd on dvcd.DV_CD = emp.DVCD
                      where SCHEDULE_CODE IN (
                      select s.SCHEDULE_CODE from TR_Schedule s
                      INNER JOIN TR_COURSE c on c.ID = s.COURSE_ID
                      where CONVERT(VARCHAR, SCHEDULE_START, 23) = '{tis.stDate}' and c.COURSE_CODE = '{tis.courseCode}') and tr.STATUS IN ('ACTIVE')
                     ";


                DataTable dtTrainingRecord = oCOnnDCI.Query(TrainingRecord);
                if (dtTrainingRecord.Rows.Count > 0)
                {
                    foreach (DataRow row in dtTrainingRecord.Rows)
                    {


                        TraineeSchedule trainee = new TraineeSchedule();

                        trainee.dept = row["DEPT"].ToString();
                        trainee.sect = row["SECT"].ToString();
                        trainee.grp = row["GRP"].ToString();
                        trainee.empCode = row["CODE"].ToString();
                        trainee.empName = row["NAME"].ToString();
                        trainee.posit = row["POSIT"].ToString();


                        _tisList.Add(trainee);

                    }
                }



            }



            catch (Exception ex)
            {
            }


            return Ok(_tisList);


        }
    }
}
