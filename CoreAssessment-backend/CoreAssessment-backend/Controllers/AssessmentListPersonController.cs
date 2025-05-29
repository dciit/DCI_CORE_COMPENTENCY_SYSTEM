using CoreAssessment_backend.Model;
using CoreAssessment_backend.Model.DashboardBarCharts;
using CoreAssessment_backend.Model.DashboardEmployee;
using CoreAssessment_backend.Model.EvalutedList;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.DataClassification;
using System.Data;
using System.Net.Mail;
using System.Reflection.Emit;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using static System.Collections.Specialized.BitVector32;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreAssessment_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssessmentListPersonController : ControllerBase
    {
        // GET: api/<AssessmentListPersonController>
        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");


        [HttpGet]
        [Route("getCounterBadge/{empcode}")]
        public IActionResult getCounterBadge(string empcode)
        {

            int index = 0;
            int[] conterBadge = new int[2] { 0, 0 };
            string[] status = { "Pending", "Confirm" };
            string sqlTextCommand = "";





            // รหัสนี้ประเมินใครไปแล้วบ้าง

            foreach (string st in status)
            {



                if (st == "Pending")
                {
                    //sqlTextCommand = @"SELECT COUNT(*) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] 
                    //                        where Empcode = (SELECT distinct EmpCode FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] 
                    //                        where EvalulateBy = @EMPCODE) and EvaluteStatus = 'Pending'";

                    //sqlTextCommand = @"SELECT COUNT(*) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] 
                    //                        where EvaluteBy = @EMPCODE and EvaluteStatus = 'Pending'";

                    sqlTextCommand = @"SELECT COUNT(EmpCode) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] core
                                       INNER JOIN Employee emp on emp.CODE = core.EmpCode
                                       LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                       where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where EvaluteBy = @EMPCODE ) and EvaluteStatus = 'Pending'";
                }
                else
                {
                    //sqlTextCommand = @"SELECT COUNT(*) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] 

                    //                            WHERE  ApproveBy = @EMPCODE  and ApproveStatus = 'Confirm' ";
                    sqlTextCommand = @"SELECT COUNT(EmpCode) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] core
                                       INNER JOIN Employee emp on emp.CODE = core.EmpCode
                                       LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                       where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where ApproveBy = @EMPCODE ) and EvaluteStatus = 'Confirm'";

                }

                SqlCommand sqlgetBadge = new SqlCommand();
                sqlgetBadge.CommandText = sqlTextCommand;

                sqlgetBadge.Parameters.Add(new SqlParameter("@EMPCODE", empcode));
                DataTable dtConterBadge = oCOnnDCI.Query(sqlgetBadge);
                if (dtConterBadge.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtConterBadge.Rows)
                    {

                        conterBadge[index] = Convert.ToInt32(drow["EvalutedCount"]);

                    }

                }

                index++;

            }




            return Ok(conterBadge);
        }




        [HttpGet]
        [Route("getCounterBadgeDev/{empcode}")]
        public IActionResult getCounterBadgeDev(string empcode)
        {

            int index = 0;
            int[] conterBadge = new int[2] { 0, 0 };
            string[] status = { "Pending", "Confirm" };
            string sqlTextCommand = "";

            string sqlCon = "";

            if (checkPositionInCoreLevelOne(empcode) > 0)
            {
                sqlCon = "";

            }
            else
            {
                sqlCon = "and CC_CoreLevel != '1'";

            }


            // รหัสนี้ประเมินใครไปแล้วบ้าง

            foreach (string st in status)
            {



                if (st == "Pending")
                {
                    //sqlTextCommand = @"SELECT COUNT(*) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] 
                    //                        where Empcode = (SELECT distinct EmpCode FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] 
                    //                        where EvalulateBy = @EMPCODE) and EvaluteStatus = 'Pending'";

                    //sqlTextCommand = @"SELECT COUNT(*) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment] 
                    //                        where EvaluteBy = @EMPCODE and EvaluteStatus = 'Pending'";
                    //where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where EvalulateBy = @EMPCODE ) and CC_EvaluteStatus = 'Pending'";

                    sqlTextCommand = @"SELECT COUNT(CC_EmpCode) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] core
                                       INNER JOIN Employee emp on emp.CODE = core.CC_EmpCode
                                       LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                       where CC_EvaluteBy = @EMPCODE  and CC_EvaluteStatus = 'Pending'"
                    ;

                }
                //where emp.DVCD IN(SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where ApproveBy = @EMPCODE) and CC_ApproveStatus != 'Approve'";

                else
                {

                    string sqlStringCommand = "";
                    string[] mg_approve = { "MG", "AM" };
                    string[] gm_approve = { "GM", "SGM", "AGM", "AG" };
                    string position = "";

                    SqlCommand sqlSelect_Position = new SqlCommand();
                    sqlSelect_Position.CommandText = @" 

	                SELECT POSIT FROM Employee
                    where CODE = '" + empcode + "'";
                    DataTable dtPosition = oCOnnDCI.Query(sqlSelect_Position);
                    if (dtPosition.Rows.Count > 0)
                    {
                        foreach (DataRow drow in dtPosition.Rows)
                        {
                            position = drow["POSIT"].ToString();
                        }
                    }

                    if ((mg_approve.Contains(position)))
                    {

                        sqlStringCommand = "and CC_CoreLevel = '1' ";

                    }
                    else if ((gm_approve.Contains(position)))
                    {
                        sqlStringCommand = "";
                    }

                    // หา core level จากผลการประเมิน




                    sqlTextCommand = $@"SELECT COUNT(CC_EmpCode) as EvalutedCount FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] core
                                          INNER JOIN Employee emp on emp.CODE = core.CC_EmpCode
                                          LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                          where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where ApproveBy = @EMPCODE) 
                                        and  CC_ApproveStatus != 'Approve' {sqlCon} {sqlStringCommand}";



                    //CC_EvaluteStatus = 'Confirm'";

                }

                SqlCommand sqlgetBadge = new SqlCommand();
                sqlgetBadge.CommandText = sqlTextCommand;

                sqlgetBadge.Parameters.Add(new SqlParameter("@EMPCODE", empcode));
                DataTable dtConterBadge = oCOnnDCI.Query(sqlgetBadge);
                if (dtConterBadge.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtConterBadge.Rows)
                    {

                        conterBadge[index] = Convert.ToInt32(drow["EvalutedCount"]);

                    }

                }

                index++;

            }




            return Ok(conterBadge);
        }




        [HttpGet]
        [Route("getAssessmentList/{empcode}/{position}")]
        public IActionResult getAssessmentList(string empcode, string position)
        {

            List<AssessmentList> asList = new List<AssessmentList>();


            // รหัสนี้ประเมินใครไปแล้วบ้าง


            //SqlCommand sqlSelect_employee = new SqlCommand();
            //sqlSelect_employee.CommandText = @" SELECT [EvaluteYear],[EmpCode],emp.NAME + ' ' + emp.SURN as Name
            //                                    ,emp.POSIT,emp.[JOIN],dvcd.DEPT,dvcd.DV_ENAME,[CoreLevel],[Scroe],[EvaluteBy],[EvaluteDate],[Status]
            //                                    FROM [dbDCI].[dbo].[TR_CompetenctAssessment]
            //                                    LEFT JOIN [dbDCI].[dbo].[Employee] emp ON emp.CODE = EmpCode
            //                                    LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
            //                                    LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT        
            //                                    WHERE  EvaluteBy = @EMPCODE and Status = 'Pending'";

            //SqlCommand sqlSelect_employee = new SqlCommand();
            //sqlSelect_employee.CommandText = @" SELECT [EvaluteYear],[EmpCode],emp.NAME + ' ' + emp.SURN as Name
            //                                    ,emp.POSIT,emp.[JOIN],dvcd.DEPT,dvcd.DV_ENAME,[CoreLevel],[Scroe],[EvaluteBy],[EvaluteDate],[EvaluteStatus]
            //                                    ,[EvaluteBy],[EvaluteDate],[CreateBy],[CreateDate],[ApproveStatus],[ApproveBy],[ApproveDate]
            //                                    FROM [dbDCI].[dbo].[TR_CompetenctAssessment]
            //                                    LEFT JOIN [dbDCI].[dbo].[Employee] emp ON emp.CODE = EmpCode
            //                                    LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
            //                                    LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT        
            //                                    WHERE  Empcode = (SELECT distinct EmpCode FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where EvaluteBy = @EMPCODE)  and (EvaluteStatus ='Pending' or EvaluteStatus ='Confirm')";



            SqlCommand sqlSelect_employee = new SqlCommand();
            sqlSelect_employee.CommandText = @" SELECT [EvaluteYear],[EmpCode],emp.NAME + ' ' + emp.SURN as Name
                                               ,emp.POSIT,emp.[JOIN],dvcd.DEPT,dvcd.DV_ENAME,[CoreLevel],[Scroe],[EvaluteBy],[EvaluteDate],[EvaluteStatus]
                                               ,[EvaluteBy],[EvaluteDate],[CreateBy],[CreateDate],[ApproveStatus],[ApproveBy],[ApproveDate] 
                                               FROM [dbDCI].[dbo].[TR_CompetenctAssessment] core
                                               INNER JOIN Employee emp on emp.CODE = core.EmpCode
                                               LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                               where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where EvaluteBy = @EMPCODE )  ";


            sqlSelect_employee.Parameters.Add(new SqlParameter("@EMPCODE", empcode.Split(':')[0]));


            DataTable dtEmp = oCOnnDCI.Query(sqlSelect_employee);
            if (dtEmp.Rows.Count > 0)
            {
                foreach (DataRow drow in dtEmp.Rows)
                {
                    AssessmentList asInfo = new AssessmentList();

                    asInfo.EvaluteYear = drow["EvaluteYear"].ToString();
                    asInfo.EmpCode = drow["EmpCode"].ToString();
                    asInfo.Name = drow["Name"].ToString();
                    asInfo.Posit = drow["POSIT"].ToString();
                    asInfo.Dept = drow["DEPT"].ToString();
                    asInfo.DvName = drow["DV_ENAME"].ToString();
                    asInfo.CoreLevel = drow["CoreLevel"].ToString();
                    asInfo.Scroce = drow["Scroe"].ToString();
                    asInfo.EvaluteDate = Convert.ToDateTime(drow["EvaluteDate"].ToString());
                    asInfo.EvaluteBy = drow["EvaluteBy"].ToString();
                    asInfo.EvaluteStatus = drow["EvaluteStatus"].ToString();
                    asInfo.ApproveDate = Convert.ToDateTime(drow["ApproveDate"].ToString() == "" ? DateTime.Now : Convert.ToDateTime(drow["ApproveDate"].ToString()));
                    asInfo.ApproveBy = drow["ApproveBy"].ToString();
                    asInfo.ApproveStatus = drow["ApproveStatus"].ToString();

                    asList.Add(asInfo);



                }

            }

            return Ok(asList);

        }




        [HttpGet]
        [Route("getAssessmentApprove/{empcode}/{position}")]
        public IActionResult getAssessmentApprove(string empcode, string position)
        {


            List<AssessmentList> asList = new List<AssessmentList>();

            string[] mg_approve = { "MG", "AM" };
            string[] gm_approve = { "GM", "SGM", "AGM", "AG" };


            // หา core level จากผลการประเมิน


            SqlCommand sqlSelect_findLevel = new SqlCommand();
            sqlSelect_findLevel.CommandText = @" 

	        SELECT [CC_CoreLevel]
            FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] core
            INNER JOIN Employee emp on emp.CODE = core.[CC_EmpCode]
            LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
            where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where ApproveBy = @EMPCODE) and [CC_EvaluteStatus] = 'Confirm'";
            sqlSelect_findLevel.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

            DataTable dtFindLevel = oCOnnDCI.Query(sqlSelect_findLevel);

            DataRow[] coreLevel = dtFindLevel.Select("CC_CoreLevel = '1'");

            if (coreLevel.Count() > 0) // ถ้ามี sup mg จะ approve core lv1
            {
                string sqlStringCommand = "";
                if ((mg_approve.Contains(position)))
                {

                    sqlStringCommand = "CC_CoreLevel = '1' ";

                }
                else if ((gm_approve.Contains(position)))
                {
                    sqlStringCommand = "CC_CoreLevel != '1' ";
                    //sqlStringCommand = "emp2.POSIT IN ('AM','AMG','MG','AG','AGM','GM','SGM')";
                }

                SqlCommand sqlSelect_employee = new SqlCommand();
                sqlSelect_employee.CommandText = $@"


                                                SELECT CC_REV,[CC_EmpCode],emp.NAME + ' ' + emp.SURN as CC_Name
                                               ,emp.POSIT as CC_POSIT,emp.[JOIN],dvcd.DEPT as CC_DEPT,dvcd.DV_ENAME as CC_DV_ENAME,[CC_CoreLevel],[CC_EvaluteBy],[CC_EvaluteDate],[CC_EvaluteStatus]
                                               ,[CC_CreateBy],[CC_CreateDate],[CC_ApproveStatus],[CC_ApproveBy],[CC_ApproveDate] 
                                               FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] core
                                               INNER JOIN Employee emp on emp.CODE = core.[CC_EmpCode]
                                               LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                               where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where ApproveBy = @EMPCODE and {sqlStringCommand} )  and [CC_EvaluteStatus] = 'Confirm' and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())";


                sqlSelect_employee.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

                DataTable dtEmp = oCOnnDCI.Query(sqlSelect_employee);
                if (dtEmp.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtEmp.Rows)
                    {
                        AssessmentList asInfo = new AssessmentList();

                        asInfo.EvaluteYear = drow["CC_REV"].ToString();
                        asInfo.EmpCode = drow["CC_EmpCode"].ToString().Trim();
                        asInfo.Name = drow["CC_Name"].ToString();
                        asInfo.Posit = drow["CC_POSIT"].ToString();
                        asInfo.Dept = drow["CC_DEPT"].ToString();
                        asInfo.DvName = drow["CC_DV_ENAME"].ToString();
                        asInfo.CoreLevel = drow["CC_CoreLevel"].ToString();
                        asInfo.EvaluteDate = Convert.ToDateTime(drow["CC_EvaluteDate"].ToString());
                        asInfo.EvaluteBy = drow["CC_EvaluteBy"].ToString();
                        asInfo.EvaluteStatus = drow["CC_EvaluteStatus"].ToString();
                        asInfo.ApproveDate = Convert.ToDateTime(drow["CC_ApproveDate"].ToString() == "" ? null : Convert.ToDateTime(drow["CC_ApproveDate"].ToString()));
                        asInfo.ApproveBy = drow["CC_ApproveBy"].ToString();
                        asInfo.ApproveStatus = drow["CC_ApproveStatus"].ToString();


                        asList.Add(asInfo);



                    }

                }



            }

            else
            {
                SqlCommand sqlSelect_employee = new SqlCommand();
                sqlSelect_employee.CommandText = @"


                                                SELECT CC_REV,[CC_EmpCode],emp.NAME + ' ' + emp.SURN as CC_Name
                                               ,emp.POSIT as CC_POSIT,emp.[JOIN],dvcd.DEPT as CC_DEPT,dvcd.DV_ENAME as CC_DV_ENAME,[CC_CoreLevel],[CC_EvaluteBy],[CC_EvaluteDate],[CC_EvaluteStatus]
                                               ,[CC_CreateBy],[CC_CreateDate],[CC_ApproveStatus],[CC_ApproveBy],[CC_ApproveDate] 
                                               FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] core
                                               INNER JOIN Employee emp on emp.CODE = core.[CC_EmpCode]
                                               LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                               where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where ApproveBy = @EMPCODE )  and [CC_EvaluteStatus] = 'Confirm'";


                sqlSelect_employee.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

                DataTable dtEmp = oCOnnDCI.Query(sqlSelect_employee);
                if (dtEmp.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtEmp.Rows)
                    {
                        AssessmentList asInfo = new AssessmentList();

                        asInfo.EvaluteYear = drow["CC_REV"].ToString();
                        asInfo.EmpCode = drow["CC_EmpCode"].ToString().Trim();
                        asInfo.Name = drow["CC_Name"].ToString();
                        asInfo.Posit = drow["CC_POSIT"].ToString();
                        asInfo.Dept = drow["CC_DEPT"].ToString();
                        asInfo.DvName = drow["CC_DV_ENAME"].ToString();
                        asInfo.CoreLevel = drow["CC_CoreLevel"].ToString();
                        asInfo.EvaluteDate = Convert.ToDateTime(drow["CC_EvaluteDate"].ToString());
                        asInfo.EvaluteBy = drow["CC_EvaluteBy"].ToString();
                        asInfo.EvaluteStatus = drow["CC_EvaluteStatus"].ToString();
                        asInfo.ApproveDate = Convert.ToDateTime(drow["CC_ApproveDate"].ToString() == "" ? null : Convert.ToDateTime(drow["CC_ApproveDate"].ToString()));
                        asInfo.ApproveBy = drow["CC_ApproveBy"].ToString();
                        asInfo.ApproveStatus = drow["CC_ApproveStatus"].ToString();


                        asList.Add(asInfo);



                    }

                }
            }



            return Ok(asList);

        }





        // กราฟ
        [HttpGet]
        [Route("getAssessmentListByEmployee/{level}/{empcode}/{year}")]
        public IActionResult getAssessmentListByEmpcode(int level, string empcode, string year)
        {

            List<Dashboard> DashboardList = new List<Dashboard>();

            SqlCommand sqlSelect_CourseNames = new SqlCommand();


            sqlSelect_CourseNames.CommandText = @" SELECT distinct [Indicator_CourseName],[Indicator_CC] FROM [dbDCI].[dbo].[TR_Indicator] WHERE Indicator_Level = ('" + level + "') order by Indicator_CC";
            DataTable dtCourseName = oCOnnDCI.Query(sqlSelect_CourseNames);
            if (dtCourseName.Rows.Count > 0)
            {
                foreach (DataRow drow in dtCourseName.Rows)
                {
                    List<Dashboard_score> dashboardScroeList = new List<Dashboard_score>();
                    Dashboard Dashboard = new Dashboard();
                    Dashboard.CourseName = drow["Indicator_CourseName"].ToString();


                    SqlCommand sqlDashboard = new SqlCommand();

                    sqlDashboard.CommandText = @"SELECT  EvaluteYear,assessment.EmpCode
                                                ,COUNT(detail.Score) as total_choice,SUM(detail.Score) as total_score,indi.Indicator_CourseName  
                                                FROM [dbDCI].[dbo].[TR_CompetenctAssessment] assessment
                                                LEFT JOIN [dbDCI].[dbo].[TR_Indicator] indi on indi.Indicator_Level = CoreLevel
                                                LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessmentDetail] detail on detail.Indicator = indi.Indicator_ID
                                                GROUP BY EvaluteYear,assessment.EmpCode,indi.[Indicator_CourseName]
                                                HAVING indi.[Indicator_CourseName] = @COURSENAME and EvaluteYear = @YEAR and assessment.EmpCode = @CODE";


                    sqlDashboard.Parameters.Add(new SqlParameter("@COURSENAME", Dashboard.CourseName));
                    sqlDashboard.Parameters.Add(new SqlParameter("@YEAR", year));
                    sqlDashboard.Parameters.Add(new SqlParameter("@CODE", empcode));
                    sqlDashboard.CommandTimeout = 180;
                    DataTable dtDashboards = oCOnnDCI.Query(sqlDashboard);
                    if (dtDashboards.Rows.Count > 0)
                    {
                        foreach (DataRow dtdashboard in dtDashboards.Rows)
                        {
                            Dashboard_score dbSC = new Dashboard_score();
                            decimal total_scroe = Math.Round(Convert.ToDecimal(dtdashboard["total_choice"].ToString()) * 5); // จำนวนข้อ * คะแนนเต็ม

                            if (dtdashboard["total_score"].ToString() == "")
                            {
                                dbSC.Pass = 0;
                            }
                            else
                            {
                                dbSC.Pass = Math.Round((Convert.ToDecimal(dtdashboard["total_score"].ToString()) * 100) / total_scroe);
                                //dbSC.Pass = (Convert.ToDecimal(dtdashboard["total_score"].ToString()) * 100) / total_scroe;

                            }
                            dbSC.NotPass = 100 - dbSC.Pass;

                            dashboardScroeList.Add(dbSC);


                        }

                        Dashboard.Scorce = dashboardScroeList;
                    }
                    DashboardList.Add(Dashboard);
                }


            }

            return Ok(DashboardList);
        }

        [HttpPost]
        [Route("SaveApproveEmployee")]
        public IActionResult SaveApproveEmployee(ApproveData approve)
        {



            SqlCommand sqlEmployeeAssessment = new SqlCommand();
            sqlEmployeeAssessment.CommandText = @"SELECT [EvaluteYear],[EmpCode],[CoreLevel],[Scroe],[Status],[EvaluteBy]
                                                 ,[EvaluteDate],[CreateBy],[CreateDate]
                                                 FROM [dbDCI].[dbo].[TR_CompetenctAssessment]
                                                 WHERE EvaluteYear = @YEAR AND  EmpCode = @CODE";
            sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@YEAR", approve.Year));
            sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@CODE", approve.Empcode));

            DataTable dtCheckEmployeeIsAssessment = oCOnnDCI.Query(sqlEmployeeAssessment);


            if (dtCheckEmployeeIsAssessment.Rows.Count > 0)
            {
                // อัพเดทข้อมูล
                SqlCommand sqlIndicator_main_update = new SqlCommand();

                sqlIndicator_main_update.CommandText = @"UPDATE [dbDCI].[dbo].[TR_CompetenctAssessment] 
                                                        SET [Status] = 'Hold',[ApproveBy] = @APPBY , [ApproveDate] = GETDATE()                                                       
                                                        WHERE [EvaluteYear] = @YEAR AND [EmpCode] = @CODE";

                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@YEAR", approve.Year));
                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@CODE", approve.Empcode));
                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@APPBY", approve.ApproveBy));
                oCOnnDCI.ExecuteCommand(sqlIndicator_main_update);

                return Ok((new { statusConfirm = true }));
            }
            else
            {
                return Ok((new { statusConfirm = false }));

            }






        }


        [HttpPost]
        [Route("ChangeStatusApprove")]
        public IActionResult ChangeStatusApprove(UpdateStatusApprove[] ustatusApprove)
        {

            foreach (UpdateStatusApprove data in ustatusApprove)
            {
                SqlCommand sqlEmployeeAssessment = new SqlCommand();
                sqlEmployeeAssessment.CommandText = @"UPDATE [dbDCI].[dbo].[TR_CompetenctAssessment_Dev]
                                                      SET [CC_EvaluteStatus] = @STATUS ,CC_ApproveStatus = @ApproveStatus, CC_ApproveBy = @APPBY ,CC_ApproveDate = @APPDATE 
                                                       WHERE CC_EmpCode = @CODE and CC_CoreLevel = @CORE ";
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@YEAR",  data.evaluteYear));
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@CODE", data.empCode));
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@CORE", data.coreLevel));    
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@STATUS", data.evaluteStatus == "Pending" ? "Confirm" : "Pending"));
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@ApproveStatus", data.evaluteStatus == "Pending" ? "Pedding" : "Finish"));
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@APPBY", data.ApproveBy == "APPROVE" ? data.ApproveBy : DBNull.Value));
                //sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@APPDATE",  data.evaluteStatus == "Confirm" ? DateTime.Now : DBNull.Value));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@YEAR", data.evaluteYear));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@CODE", data.empCode));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@CORE", data.coreLevel));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@STATUS", data.evaluteStatus == "Pending" ? "Confirm" : "Confirm"));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@ApproveStatus", data.evaluteStatus == "Confirm" ? "Approve" : "Pending"));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@APPBY", data.evaluteStatus == "Confirm" ? data.approveBy : "-"));
                sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@APPDATE", data.evaluteStatus == "Confirm" ? DateTime.Now : DBNull.Value));




                oCOnnDCI.ExecuteCommand(sqlEmployeeAssessment);

            }




            if (ustatusApprove.FirstOrDefault().evaluteStatus == "Pending")
            {
                string employee_evaluted = ustatusApprove.FirstOrDefault().evaluteBy;
                string employee_approve = "";

                // check status confirm and approve
                SqlCommand sqlFindEmail = new SqlCommand();
                sqlFindEmail.CommandText = @"
                                        SELECT distinct EvalulateBy,ApproveBy FROM TR_CompentencyApproveFlow
                                        where EvalulateBy = @CODE";

                sqlFindEmail.Parameters.Add(new SqlParameter("@CODE", ustatusApprove.FirstOrDefault().evaluteBy));
                DataTable dtsqlFindEmail = oCOnnDCI.Query(sqlFindEmail);
                if (dtsqlFindEmail.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtsqlFindEmail.Rows)
                    {
                        employee_approve = drow["ApproveBy"].ToString();

                    }
                }

                sendEmailConfirm(employee_evaluted, employee_approve, ustatusApprove);

            }
            else if (ustatusApprove.FirstOrDefault().evaluteStatus == "Confirm")
            {
                string approve = ustatusApprove.FirstOrDefault().approveBy;
                sendEmailApprove(approve, ustatusApprove);

            }


            return Ok((new { statusConfirm = true }));
        }



        [HttpGet]
        [Route("getAssessmentListDev/{Assessor}")]
        public IActionResult getCoreCompentencyEvaluted(string Assessor)
        {

            List<AssessmentList> assessmentLists = new List<AssessmentList>();

            SqlCommand sqlSelect_CoreCompentencyEvaluted = new SqlCommand();

            sqlSelect_CoreCompentencyEvaluted.CommandText = @"SELECT 
                                               [CC_REV]
                                              ,[CC_EmpCode]
                                              ,emp.NAME + ' ' + emp.SURN as CC_Name
                                              ,emp.POSIT CC_POSIT
                                              ,dvcd.DEPT CC_DEPT
                                              ,dvcd.DV_ENAME CC_DV_ENAME
                                              ,[CC_CoreLevel]
                                              ,[CC_EvaluteStatus]
                                              ,[CC_EvaluteBy]
                                              ,[CC_EvaluteDate]
                                              ,[CC_ApproveStatus]
                                              ,[CC_ApproveBy]
                                              ,[CC_ApproveDate]
                                              ,[CC_CreateDate]
                                              ,[CC_CreateBy]
                                          FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] dev
                                          INNER JOIN Employee emp on emp.CODE = dev.CC_EmpCode
                                          LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                          where emp.DVCD IN ( SELECT distinct DV_CD FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] where CC_EvaluteBy = @EMPCODE )  and (CC_EvaluteStatus = 'Pending' or CC_EvaluteStatus = 'Confirm')   and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())";

            sqlSelect_CoreCompentencyEvaluted.Parameters.Add(new SqlParameter("@EMPCODE", Assessor));
            DataTable dtoreCompentencyEvaluted = oCOnnDCI.Query(sqlSelect_CoreCompentencyEvaluted);
            if (dtoreCompentencyEvaluted.Rows.Count > 0)
            {
                foreach (DataRow drow in dtoreCompentencyEvaluted.Rows)
                {

                    AssessmentList asInfo = new AssessmentList();

                    asInfo.EvaluteYear = drow["CC_REV"].ToString();
                    asInfo.EmpCode = drow["CC_EmpCode"].ToString().Trim();
                    asInfo.Name = drow["CC_Name"].ToString();
                    asInfo.Posit = drow["CC_POSIT"].ToString();
                    asInfo.Dept = drow["CC_DEPT"].ToString();
                    asInfo.DvName = drow["CC_DV_ENAME"].ToString();
                    asInfo.CoreLevel = drow["CC_CoreLevel"].ToString();
                    asInfo.EvaluteDate = Convert.ToDateTime(drow["CC_EvaluteDate"].ToString());
                    asInfo.EvaluteBy = drow["CC_EvaluteBy"].ToString();
                    asInfo.EvaluteStatus = drow["CC_EvaluteStatus"].ToString();
                    asInfo.ApproveDate = Convert.ToDateTime(drow["CC_ApproveDate"].ToString() == "" ? null : Convert.ToDateTime(drow["CC_ApproveDate"].ToString()));
                    asInfo.ApproveBy = drow["CC_ApproveBy"].ToString();
                    asInfo.ApproveStatus = drow["CC_ApproveStatus"].ToString();

                    assessmentLists.Add(asInfo);
                }

            }




            return Ok(assessmentLists);
        }


        [NonAction]
        private void sendEmailConfirm(string evaluted, string approve, UpdateStatusApprove[] ustatusApprove)
        {
            int i = 0;
            string[] gm_approve = { "GM", "AGM", "SGM", "AG" };
            string[] mg_approve = { "MG", "AM" };
            string[] ss_assessment = { "SU", "SS", "SE", "ST" };

            foreach (UpdateStatusApprove item in ustatusApprove)
            {

                SqlCommand sqlNameEvaluted = new SqlCommand();

                sqlNameEvaluted.CommandText = @" 
                 SELECT   CC_EmpCode + TNAME + ' ' + TSURN name_emp , 
                 (SELECT  CC_EvaluteBy +  ' ' + TNAME + ' ' + TSURN  FROM Employee where CODE = CC_EvaluteBy) evalute_name FROM TR_CompetenctAssessment_DEV
                 LEFT JOIN  Employee emp on emp.CODE = CC_EmpCode 
                 where emp.CODE = @EMPCODE";

                sqlNameEvaluted.Parameters.Add(new SqlParameter("@EMPCODE", item.empCode.Trim()));
                DataTable dtsqlNameEvaluted = oCOnnDCI.Query(sqlNameEvaluted);

                if (dtsqlNameEvaluted.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtsqlNameEvaluted.Rows)
                    {
                        ustatusApprove[i].empCode = drow["name_emp"].ToString();
                        ustatusApprove[i].evaluteBy = drow["evalute_name"].ToString();
                        i++;
                    }
                }
            }

            SqlCommand sqlFindEmail = new SqlCommand();

            sqlFindEmail.CommandText = @"SELECT MAIL,POSIT  FROM Employee
                                          where CODE = @CODE1 or CODE = @CODE2";

            sqlFindEmail.Parameters.Add(new SqlParameter("@CODE1", evaluted));
            sqlFindEmail.Parameters.Add(new SqlParameter("@CODE2", approve));
            //sqlFindEmail.Parameters.Add(new SqlParameter("@CODE1", "
            //210"));
            //sqlFindEmail.Parameters.Add(new SqlParameter("@CODE2", "41210"));

            DataTable dtsqlFindEmail = oCOnnDCI.Query(sqlFindEmail);

            if (dtsqlFindEmail.Rows.Count > 0)
            {
                foreach (DataRow drow in dtsqlFindEmail.Rows)
                {

                    MailMessage mail = new MailMessage();
                    SmtpClient SmtpServer = new SmtpClient("smtp.dci.daikin.co.jp");
                    //SmtpServer.EnableSsl = true;
                    SmtpServer.Port = 25;
                    SmtpServer.UseDefaultCredentials = false;
                    SmtpServer.Credentials = new System.Net.NetworkCredential("phatcharaphon.f@dci.daikin.co.jp", "Pfit_4423"); // ***use valid credentials***

                    mail.From = new MailAddress("dci-noreply@dci.daikin.co.jp");
                    //mail.To.Add(drow["MAIL"].ToString());
                    //mail.To.Add("phatcharaphon.f@dci.daikin.co.jp,wannaporn.w@dci.daikin.co.jp");
                    mail.To.Add("phatcharaphon.f@dci.daikin.co.jp");
                    mail.Subject = "สรุปผลการประเมิน Core compentency assessment (Knowledge) ประจำปี " + ustatusApprove.FirstOrDefault().evaluteYear.Substring(0, 4);
                    mail.IsBodyHtml = true;
                    mail.Priority = MailPriority.High;
                    string htmlTableStart = "<table style=\"border-collapse:collapse; text-align:center; width:100%;\" >";
                    string htmlTableEnd = "</table>";
                    string htmlHeaderRowStart = "<tr style =\"background-color:#6FA1D2; color:#ffffff;\">";
                    string htmlHeaderRowEnd = "</tr>";
                    string htmlTrStart = "<tr style =\"color:#555555;\">";
                    string htmlTrEnd = "</tr>";
                    string htmlTdStart = "<td style=\" border-color:#5c87b2; border-style:solid; border-width:thin; padding: 5px;\">";
                    string htmlTdEnd = "</td>";

                    // ตอนกด approve 

                    //mail.Body = @"<p>Report ประจำวัน :  <a>" + ustatusApprove.FirstOrDefault().evaluteYear + "</a></p>";
                    if (ss_assessment.Contains(drow["POSIT"].ToString().Trim()))
                    {
                        mail.Body += @"<h3>ท่านได้ทำการ Confirm ประเมิน Core compentency assessment (Knowledge) ของพนักงานในสังกัดแล้ว ดังนี้</h3>";

                    }
                    else if (mg_approve.Contains(drow["POSIT"].ToString().Trim()))
                    {
                        DataRow[] filterData = dtsqlFindEmail.Select("POSIT = 'SS' or POSIT = 'SE' or POSIT = 'SU' or POSIT = 'ST'");
                        if (filterData.Count() > 0)
                        {
                            mail.Body += @"<h3>ขอให้ท่านทำการ Approve รายการประเมิน Core compentency assessment (Knowledge) ดังนี้</h3>";

                        }
                        else
                        {
                            mail.Body += @"<h3>ท่านได้ทำการ Confirm ประเมิน Core compentency assessment (Knowledge) ของพนักงานในสังกัดแล้ว ดังนี้</h3>";

                        }



                    }
                    else if (gm_approve.Contains(drow["POSIT"].ToString().Trim()))
                    {
                        mail.Body += @"<h3>ขอให้ท่านทำการ Approve รายการประเมิน Core compentency assessment (Knowledge) ดังนี้</h3>";


                    }

                    mail.Body += htmlTableStart;
                    mail.Body += htmlHeaderRowStart;
                    mail.Body += htmlTdStart + "รอบการประเมิน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "รหัสพนักงาน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "core level พนักงาน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "ผู้ประเมิน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "สถานะผู้ประเมิน" + htmlTdEnd;



                    mail.Body += htmlHeaderRowEnd;



                    foreach (UpdateStatusApprove data in ustatusApprove)
                    {
                        mail.Body = mail.Body + htmlTrStart;
                        mail.Body = mail.Body + htmlTdStart + data.evaluteYear + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + data.empCode + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + data.coreLevel + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + data.evaluteBy + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + "Confirm" + htmlTdEnd;





                        mail.Body = mail.Body + htmlTrEnd;
                    }

                    mail.Body = mail.Body + htmlTableEnd;

                    if (ss_assessment.Contains(drow["POSIT"].ToString().Trim()))
                    {
                        mail.Body += @"<h4>สามารถติดตามผลการ Approve ได้ที่ : <a>http://dciweb2.dci.daikin.co.jp/CASAPP/</a></h4>";

                    }

                    else if (mg_approve.Contains(drow["POSIT"].ToString().Trim()))
                    {
                        DataRow[] filterData = dtsqlFindEmail.Select("POSIT = 'SS' or POSIT = 'SE' or POSIT = 'SU' or POSIT = 'ST'");
                        if (filterData.Count() > 0)
                        {
                            mail.Body += @"<h4>Approve ผลการประเมินที่ : <a>http://dciweb2.dci.daikin.co.jp/CASAPP/</a></h4>";

                        }
                        else
                        {
                            mail.Body += @"<h4>สามารถติดตามผลการ Approve ได้ที่ : <a>http://dciweb2.dci.daikin.co.jp/CASAPP/</a></h4>";

                        }
                    }
                    else
                    {
                        mail.Body += @"<h4>Approve ผลการประเมินที่ : <a>http://dciweb2.dci.daikin.co.jp/CASAPP/</a></h4>";

                    }

                    try
                    {
                        SmtpServer.Send(mail);
                        mail.Dispose();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());

                    }

                }

            }


        }

        [NonAction]
        private void sendEmailApprove(string approve, UpdateStatusApprove[] ustatusApprove)
        {
            int i = 0;
            foreach (UpdateStatusApprove item in ustatusApprove)
            {

                SqlCommand sqlNameEvaluted = new SqlCommand();

                sqlNameEvaluted.CommandText = @" 
                 SELECT   CC_EmpCode + TNAME + ' ' + TSURN name_emp , 
                 (SELECT  CC_EvaluteBy +  ' ' + TNAME + ' ' + TSURN  FROM Employee where CODE = @APPROVE_CODE) evalute_name FROM TR_CompetenctAssessment_DEV
                 LEFT JOIN  Employee emp on emp.CODE = CC_EmpCode 
                 where emp.CODE = @EMPCODE";

                sqlNameEvaluted.Parameters.Add(new SqlParameter("@EMPCODE", item.empCode));
                sqlNameEvaluted.Parameters.Add(new SqlParameter("@APPROVE_CODE", approve));

                DataTable dtsqlNameEvaluted = oCOnnDCI.Query(sqlNameEvaluted);

                if (dtsqlNameEvaluted.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtsqlNameEvaluted.Rows)
                    {
                        ustatusApprove[i].empCode = drow["name_emp"].ToString();
                        ustatusApprove[i].evaluteBy = drow["evalute_name"].ToString();
                        i++;
                    }
                }
            }

            int j = 0;

            SqlCommand sqlFindEmail = new SqlCommand();

            sqlFindEmail.CommandText = @"SELECT MAIL FROM Employee
                                          where CODE = @CODE1 ";

            sqlFindEmail.Parameters.Add(new SqlParameter("@CODE1", approve));

            DataTable dtsqlFindEmail = oCOnnDCI.Query(sqlFindEmail);

            if (dtsqlFindEmail.Rows.Count > 0)
            {
                foreach (DataRow drow in dtsqlFindEmail.Rows)
                {

                    MailMessage mail = new MailMessage();
                    SmtpClient SmtpServer = new SmtpClient("smtp.dci.daikin.co.jp");
                    //SmtpServer.EnableSsl = true;
                    SmtpServer.Port = 25;
                    SmtpServer.UseDefaultCredentials = false;
                    SmtpServer.Credentials = new System.Net.NetworkCredential("phatcharaphon.f@dci.daikin.co.jp", "Pfit_4423"); // ***use valid credentials***

                    mail.From = new MailAddress("dci-noreply@dci.daikin.co.jp");
                    mail.To.Add(drow["MAIL"].ToString());
                    //mail.To.Add("phatcharaphon.f@dci.daikin.co.jp,wannaporn.w@dci.daikin.co.jp");
                    //mail.To.Add("phatcharaphon.f@dci.daikin.co.jp");
                    mail.Subject = "สรุปผลการประเมิน Core compentency assessment (Knowledge) ประจำปี " + ustatusApprove.FirstOrDefault().evaluteYear.Substring(0, 4);
                    mail.IsBodyHtml = true;
                    mail.Priority = MailPriority.High;
                    string htmlTableStart = "<table style=\"border-collapse:collapse; text-align:center; width:100%;\" >";
                    string htmlTableEnd = "</table>";
                    string htmlHeaderRowStart = "<tr style =\"background-color:#6FA1D2; color:#ffffff;\">";
                    string htmlHeaderRowEnd = "</tr>";
                    string htmlTrStart = "<tr style =\"color:#555555;\">";
                    string htmlTrEnd = "</tr>";
                    string htmlTdStart = "<td style=\" border-color:#5c87b2; border-style:solid; border-width:thin; padding: 5px;\">";
                    string htmlTdEnd = "</td>";

                    // ตอนกด approve 



                    mail.Body = @"<h3>ท่านได้ทำการ Approve การประเมิน Core compentency assessment (Knowledge) เรียบร้อย</h3>";

                    mail.Body += htmlTableStart;
                    mail.Body += htmlHeaderRowStart;
                    mail.Body += htmlTdStart + "รอบการประเมิน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "รหัสพนักงาน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "core level พนักงาน" + htmlTdEnd;
                    mail.Body += htmlTdStart + "ผู้อนุมัติ" + htmlTdEnd;
                    mail.Body += htmlTdStart + "สถานะผู้อนุมัติ" + htmlTdEnd;



                    mail.Body += htmlHeaderRowEnd;



                    foreach (UpdateStatusApprove data in ustatusApprove)
                    {
                        mail.Body = mail.Body + htmlTrStart;
                        mail.Body = mail.Body + htmlTdStart + data.evaluteYear + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + data.empCode + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + data.coreLevel + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + data.evaluteBy + htmlTdEnd;
                        mail.Body = mail.Body + htmlTdStart + "Approve" + htmlTdEnd;
                        //mail.Body = mail.Body + htmlTdStart + data.approveBy + htmlTdEnd;
                        //mail.Body = mail.Body + htmlTdStart + data.approveStatus + htmlTdEnd;




                        mail.Body = mail.Body + htmlTrEnd;
                    }
                    mail.Body = mail.Body + htmlTableEnd;
                    mail.Body += @"<h4>สามารถดูรายละเอียดเพิ่มเติมได้ที่ : <a>http://dciweb2.dci.daikin.co.jp/CASAPP/</a></h4>";

                    //Attachment attachment;
                    //attachment = new Attachment(_PATH);
                    //mail.Attachments.Add(attachment);
                    try
                    {
                        SmtpServer.Send(mail);
                        mail.Dispose();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());

                    }
                    j++;
                }

            }


        }




        [HttpGet]
        [Route("groupCountEmployeeAssessment/{empcode}/{dept}")]
        public IActionResult groupCountEmployeeAssessmentByDept(string empcode, string dept)
        {

            List<GroupCountEmployeeAssessmentByDept> groupCountEmployeeAssessmentByDeptList = new List<GroupCountEmployeeAssessmentByDept>();



            string sqlCon = "";

            if (checkPositionInCoreLevelOne(empcode) > 0)
            {
                sqlCon = "";

            }
            else
            {
                sqlCon = "and CC_CoreLevel != '1'";

            }


            DataTable dtSection = new DataTable();
            DataTable dtSectionIsAssessment = new DataTable();
            // พนักงานที่รอการประเมิน

            SqlCommand Section = new SqlCommand();
            Section.CommandText = $@" 
                                     SELECT DEPT_CD, DEPT,COUNT(CC_EmpCode) TotalWaitEmployeeAssessment ,COUNT(CODE) TotalEmployee FROM DVCD_Master
                                     LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','TR','GM','SGM','AG','AGM','PD')
                                     LEFT JOIN TR_CompetenctAssessment_DEV dev on emp.CODE = CC_EmpCode  and CC_ApproveStatus = 'Pending'  {sqlCon}
                                     where DEPT_CD IN (" + dept + @") and SECT_CD IN (SELECT  distinct dvcd.SECT_CD FROM TR_CompentencyApproveFlow flow
                                     inner JOIN DVCD_Master dvcd on dvcd.DV_CD = flow.DV_CD and (EvalulateBy = " + empcode + @" or ApproveBy = (" + empcode + @")))
                                     and SECT != 'DESIGN DEVELOPMENT'  
                                     GROUP BY DEPT_CD,DEPT
                                     order by DEPT_CD ";


            dtSection = oCOnnDCI.Query(Section);


            // พนักงานที่ประเมินแล้ว


            SqlCommand SectionIsAssessment = new SqlCommand();
            SectionIsAssessment.CommandText = $@" 
                                     SELECT DEPT_CD, DEPT,COUNT(CC_EmpCode) TotalEmployeeIsAssessment ,COUNT(CODE) TotalEmployee FROM DVCD_Master
                                     LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','TR','GM','SGM','AG','AGM','PD')
                                     LEFT JOIN TR_CompetenctAssessment_DEV dev on emp.CODE = CC_EmpCode and CC_ApproveStatus = 'Approve'  {sqlCon} and SUBSTRING(dev.CC_REV,0,5) = YEAR(GETDATE())
                                     where DEPT_CD IN (" + dept + @") and SECT_CD IN (SELECT  distinct dvcd.SECT_CD FROM TR_CompentencyApproveFlow flow
                                     inner JOIN DVCD_Master dvcd on dvcd.DV_CD = flow.DV_CD and (EvalulateBy = " + empcode + @" or ApproveBy = (" + empcode + @")))
                                     and SECT != 'DESIGN DEVELOPMENT'
                                     GROUP BY DEPT_CD,DEPT
                                     order by DEPT_CD ";


            dtSectionIsAssessment = oCOnnDCI.Query(SectionIsAssessment);



            DataTable dtEmployeeAssessment = new DataTable();

            dtEmployeeAssessment.Columns.Add("DEPT_CD", typeof(string));
            dtEmployeeAssessment.Columns.Add("DEPT", typeof(string));
            dtEmployeeAssessment.Columns.Add("TotalEmployeeIsAssessment", typeof(decimal));
            dtEmployeeAssessment.Columns.Add("TotalEmployee", typeof(decimal));
            dtEmployeeAssessment.Columns.Add("TotalWaitEmployeeAssessment", typeof(decimal));
            int i = 0;



            foreach (DataRow section in dtSection.Rows)
            {
                DataRow dtNewDatatable = dtEmployeeAssessment.NewRow();

                dtNewDatatable["DEPT"] = section["DEPT"].ToString();
                dtNewDatatable["DEPT_CD"] = section["DEPT_CD"].ToString();
                dtNewDatatable["TotalEmployeeIsAssessment"] = Convert.ToDecimal(dtSectionIsAssessment.Rows[i]["TotalEmployeeIsAssessment"]);
                dtNewDatatable["TotalEmployee"] = Convert.ToDecimal(section["TotalEmployee"]);
                dtNewDatatable["TotalWaitEmployeeAssessment"] = Convert.ToDecimal(section["TotalWaitEmployeeAssessment"]);

                dtEmployeeAssessment.Rows.Add(dtNewDatatable);



                i++;

            }


            if (dtEmployeeAssessment.Rows.Count > 0)
            {
                foreach (DataRow drowSection in dtEmployeeAssessment.Rows)
                {
                    GroupCountEmployeeAssessmentByDept groupCountEmployeeAssessmentByDept = new GroupCountEmployeeAssessmentByDept();
                    groupCountEmployeeAssessmentByDept.dept_cd = drowSection["DEPT_CD"].ToString();
                    groupCountEmployeeAssessmentByDept.dept_name = drowSection["DEPT"].ToString();
                    groupCountEmployeeAssessmentByDept.total_Employee_is_assessment = Convert.ToDecimal(drowSection["TotalEmployeeIsAssessment"]);
                    groupCountEmployeeAssessmentByDept.total_Employee = Convert.ToDecimal(drowSection["TotalEmployee"]);
                    groupCountEmployeeAssessmentByDept.total_Employee_wait_assessment = Convert.ToDecimal(drowSection["TotalWaitEmployeeAssessment"]);




                    groupCountEmployeeAssessmentByDeptList.Add(groupCountEmployeeAssessmentByDept);
                }
            }

            return Ok(groupCountEmployeeAssessmentByDeptList);
        }



        [HttpGet]
        [Route("groupCountEmployeeAssessmentByDept/{empcode}/{dept}")]
        public IActionResult groupCountEmployeeAssessmentBySection(string empcode, string dept)
        {

            List<GroupCountEmployeeAssessmentBySection> groupCountEmployeeAssessmentBySections = new List<GroupCountEmployeeAssessmentBySection>();



            string sqlCon = "";

            if (checkPositionInCoreLevelOne(empcode) > 0)
            {
                sqlCon = "";

            }
            else
            {
                sqlCon = "and CC_CoreLevel != '1'";

            }


            //SqlCommand sqlSelect_employee = new SqlCommand();
            //sqlSelect_employee.CommandText = $@" SELECT DV_ENAME FROM DVCD_Master
            //                                     WHERE DV_CD = {dept}";

            //DataTable dtEmp = oCOnnDCI.Query(sqlSelect_employee);
            //if (dtEmp.Rows.Count > 0)
            //{
            //    foreach (DataRow drow in dtEmp.Rows)
            //    {
            //        dept = drow["DV_ENAME"].ToString();
            //    }
            //}

            //string group = "";

            //if (dept == "ADMINISTRATION")
            //{
            //    group = "'1100','1200','1300','1400','1500','1600'";

            //}
            //else if (dept == "CORPORATE COMPLIANCE")
            //{
            //    group = "'8200'";
            //}
            //else if (dept == "DESIGN DEVELOPMENT")
            //{
            //    group = "'10100','10200','10300'";
            //}
            //else if (dept == "ENGINEERING")
            //{
            //    group = "'3100','3200','3300'";

            //}
            //else if (dept == "MAINTENANCE")
            //{
            //    group = "'13100','13200','13400'";

            //}
            //else if (dept == "MANUFACTURING CONTROL")
            //{
            //    group = "'11100','11200','11300','11400','11500','11600','11700','11800'";

            //}
            //else if (dept == "PROCUREMENT")
            //{
            //    group = "'2100','2700','2800'";

            //}
            //else if (dept == "PRODUCTION")
            //{
            //    group = "'40100','40300','40400','40500'";

            //}
            //else if (dept == "PRODUCTION CONTROL")
            //{
            //    group = "'7100','7200'";
            //}
            //else if (dept == "QUALITY CONTROL")
            //{
            //    group = "'5100','5300','5500','5600'";

            //}
            //else if (dept == "SAFETY")
            //{
            //    group = "'6100'";

            //}
            //else if (dept == "TECHNOLOGY DEVELOPMENT")
            //{
            //    group = "'12100','12200','12300'";
            //}

            DataTable dtSection = new DataTable();
            DataTable dtSectionIsAssessment = new DataTable();
            // พนักงานที่รอการประเมิน

            SqlCommand Section = new SqlCommand();
            Section.CommandText = $@" 
                                     SELECT SECT_CD, SECT,COUNT(CC_EmpCode) TotalWaitEmployeeAssessment ,COUNT(CODE) TotalEmployee FROM DVCD_Master
                                     LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','TR')
                                     LEFT JOIN TR_CompetenctAssessment_DEV dev on emp.CODE = CC_EmpCode  and CC_ApproveStatus = 'Pending' {sqlCon}
                                     where DEPT_CD = '" + dept + @"' and SECT !='' and SECT_CD IN (SELECT  distinct dvcd.SECT_CD FROM TR_CompentencyApproveFlow flow
                                            inner JOIN DVCD_Master dvcd on dvcd.DV_CD = flow.DV_CD and (EvalulateBy = '" + empcode + @"' or ApproveBy = '" + empcode + @"'))
                                     and SECT != 'DESIGN DEVELOPMENT'
                                     GROUP BY SECT_CD,SECT
                                     order by SECT_CD ";


            dtSection = oCOnnDCI.Query(Section);


            // พนักงานที่ประเมินแล้ว


            SqlCommand SectionIsAssessment = new SqlCommand();
            SectionIsAssessment.CommandText = $@" 
                                     SELECT SECT_CD, SECT,COUNT(CC_EmpCode) TotalEmployeeIsAssessment ,COUNT(CODE) TotalEmployee FROM DVCD_Master
                                     LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','TR')
                                     LEFT JOIN TR_CompetenctAssessment_DEV dev on emp.CODE = CC_EmpCode and CC_ApproveStatus = 'Approve'  {sqlCon} and SUBSTRING(dev.CC_REV,0,5) = YEAR(GETDATE())
                                     where DEPT_CD = '" + dept + @"' and SECT !='' and SECT_CD IN (SELECT  distinct dvcd.SECT_CD FROM TR_CompentencyApproveFlow flow
 inner JOIN DVCD_Master dvcd on dvcd.DV_CD = flow.DV_CD and (EvalulateBy = '" + empcode + @"' or ApproveBy = '" + empcode + @"'))
                                     and SECT != 'DESIGN DEVELOPMENT'
                                     GROUP BY SECT_CD,SECT
                                     order by SECT_CD ";


            dtSectionIsAssessment = oCOnnDCI.Query(SectionIsAssessment);



            DataTable dtEmployeeAssessment = new DataTable();

            dtEmployeeAssessment.Columns.Add("SECT_CD", typeof(string));
            dtEmployeeAssessment.Columns.Add("SECT", typeof(string));
            dtEmployeeAssessment.Columns.Add("TotalEmployeeIsAssessment", typeof(decimal));
            dtEmployeeAssessment.Columns.Add("TotalEmployee", typeof(decimal));
            dtEmployeeAssessment.Columns.Add("TotalWaitEmployeeAssessment", typeof(decimal));
            int i = 0;



            foreach (DataRow section in dtSection.Rows)
            {
                DataRow dtNewDatatable = dtEmployeeAssessment.NewRow();

                dtNewDatatable["SECT"] = section["SECT"].ToString();
                dtNewDatatable["SECT_CD"] = section["SECT_CD"].ToString();
                dtNewDatatable["TotalEmployeeIsAssessment"] = Convert.ToDecimal(dtSectionIsAssessment.Rows[i]["TotalEmployeeIsAssessment"]);
                dtNewDatatable["TotalEmployee"] = Convert.ToDecimal(section["TotalEmployee"]);
                dtNewDatatable["TotalWaitEmployeeAssessment"] = Convert.ToDecimal(section["TotalWaitEmployeeAssessment"]);

                dtEmployeeAssessment.Rows.Add(dtNewDatatable);



                i++;

            }


            if (dtEmployeeAssessment.Rows.Count > 0)
            {
                foreach (DataRow drowSection in dtEmployeeAssessment.Rows)
                {
                    GroupCountEmployeeAssessmentBySection groupCountEmployeeAssessmentBySection = new GroupCountEmployeeAssessmentBySection();
                    groupCountEmployeeAssessmentBySection.sect_cd = drowSection["SECT_CD"].ToString();
                    groupCountEmployeeAssessmentBySection.sect_name = drowSection["SECT"].ToString();
                    groupCountEmployeeAssessmentBySection.total_Employee_is_assessment = Convert.ToDecimal(drowSection["TotalEmployeeIsAssessment"]);
                    groupCountEmployeeAssessmentBySection.total_Employee = Convert.ToDecimal(drowSection["TotalEmployee"]);
                    groupCountEmployeeAssessmentBySection.total_Employee_wait_assessment = Convert.ToDecimal(drowSection["TotalWaitEmployeeAssessment"]);




                    groupCountEmployeeAssessmentBySections.Add(groupCountEmployeeAssessmentBySection);
                }
            }

            return Ok(groupCountEmployeeAssessmentBySections);
        }




        [HttpGet]
        [Route("groupCountEmployeeAssessmentByGroup/{empcode}/{section}")]
        public IActionResult groupCountEmployeeAssessmentByGroup(string empcode, string section)
        {
            string sqlCon = "";

            if (checkPositionInCoreLevelOne(empcode) > 0)
            {
                sqlCon = "";

            }
            else
            {
                sqlCon = "and CC_CoreLevel != '1'";

            }

            List<GroupCountEmployeeAssessmentByGroup> groupCountEmployeeAssessmentByGroup = new List<GroupCountEmployeeAssessmentByGroup>();

            SqlCommand sqlSelect_employee = new SqlCommand();
            sqlSelect_employee.CommandText = $@"  SELECT DV_CD,DV_ENAME,COUNT(CC_EmpCode) TotalWaitEmployeeAssessment ,COUNT(CODE) TotalEmployee FROM DVCD_Master
                                                 LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','TR')
                                                  LEFT JOIN TR_CompetenctAssessment_DEV dev on emp.CODE = CC_EmpCode and CC_ApproveStatus = 'Pending' {sqlCon}
                                                 where SECT_CD = '" + section + @"' and DV_CD <> '" + section + @"' 
                                                 GROUP BY DV_CD,DV_ENAME
                                                 order by DV_CD";
            DataTable dtGroup = oCOnnDCI.Query(sqlSelect_employee);




            SqlCommand sqlSelect_is_assessment = new SqlCommand();
            sqlSelect_is_assessment.CommandText = $@"  SELECT DV_CD,DV_ENAME,COUNT(CC_EmpCode) TotalEmployeeIsAssessment ,COUNT(CODE) TotalEmployee FROM DVCD_Master
                                                 LEFT JOIN Employee emp on emp.DVCD = DV_CD and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','TR')
                                                  LEFT JOIN TR_CompetenctAssessment_DEV dev on emp.CODE = CC_EmpCode and CC_ApproveStatus = 'Approve' {sqlCon} and SUBSTRING(dev.CC_REV,0,5) = YEAR(GETDATE())
                                                 where SECT_CD = '" + section + @"' and DV_CD <> '" + section + @"' 
                                                 GROUP BY DV_CD,DV_ENAME
                                                 order by DV_CD";

            DataTable dtIsAssessment = oCOnnDCI.Query(sqlSelect_is_assessment);




            DataTable dtGroupIsAssessment = new DataTable();
            dtGroupIsAssessment.Columns.Add("DV_CD", typeof(string));
            dtGroupIsAssessment.Columns.Add("DV_ENAME", typeof(string));
            dtGroupIsAssessment.Columns.Add("TotalEmployeeIsAssessment", typeof(decimal));
            dtGroupIsAssessment.Columns.Add("TotalEmployee", typeof(decimal));
            dtGroupIsAssessment.Columns.Add("TotalWaitEmployeeAssessment", typeof(decimal));
            int i = 0;



            foreach (DataRow group in dtGroup.Rows)
            {
                DataRow dtNewDatatable = dtGroupIsAssessment.NewRow();

                dtNewDatatable["DV_CD"] = group["DV_CD"].ToString();
                dtNewDatatable["DV_ENAME"] = group["DV_ENAME"].ToString();
                dtNewDatatable["TotalEmployeeIsAssessment"] = Convert.ToDecimal(dtIsAssessment.Rows[i]["TotalEmployeeIsAssessment"]);
                dtNewDatatable["TotalEmployee"] = Convert.ToDecimal(group["TotalEmployee"]);
                dtNewDatatable["TotalWaitEmployeeAssessment"] = Convert.ToDecimal(group["TotalWaitEmployeeAssessment"]);

                dtGroupIsAssessment.Rows.Add(dtNewDatatable);



                i++;

            }


            if (dtGroupIsAssessment.Rows.Count > 0)
            {
                foreach (DataRow drowGroup in dtGroupIsAssessment.Rows)
                {
                    GroupCountEmployeeAssessmentByGroup groupCountEmployeeAssessmentBySection = new GroupCountEmployeeAssessmentByGroup();
                    groupCountEmployeeAssessmentBySection.group_cd = drowGroup["DV_CD"].ToString();
                    groupCountEmployeeAssessmentBySection.group_name = drowGroup["DV_ENAME"].ToString();
                    groupCountEmployeeAssessmentBySection.total_Employee_is_assessment = Convert.ToDecimal(drowGroup["TotalEmployeeIsAssessment"]);
                    groupCountEmployeeAssessmentBySection.total_Employee = Convert.ToDecimal(drowGroup["TotalEmployee"]);
                    groupCountEmployeeAssessmentBySection.total_Employee_wait_assessment = Convert.ToDecimal(drowGroup["TotalWaitEmployeeAssessment"]);




                    groupCountEmployeeAssessmentByGroup.Add(groupCountEmployeeAssessmentBySection);
                }
            }
            return Ok(groupCountEmployeeAssessmentByGroup);
        }




        [HttpGet]
        [Route("getEmployeeAssessmentByGroup/{empcode}/{group}")]
        public IActionResult getEmployeeAssessmentByGroup(string empcode, string group)
        {
            string sqlCon = "";

            if (checkPositionInCoreLevelOne(empcode) > 0)
            {
                sqlCon = "";

            }
            else
            {
                sqlCon = "and CC_CoreLevel != '1'";

            }

            List<AssessmentList> asList = new List<AssessmentList>();



            SqlCommand sqlSelect_group = new SqlCommand();
            sqlSelect_group.CommandText = $@" SELECT CC_REV,[CC_EmpCode],emp.NAME + ' ' + emp.SURN as CC_Name
                                               ,emp.POSIT as CC_POSIT,emp.[JOIN],dvcd.DEPT as CC_DEPT,dvcd.DV_ENAME as CC_DV_ENAME,
                                                [CC_CoreLevel],[CC_EvaluteBy],[CC_EvaluteDate],[CC_EvaluteStatus]  
                                               ,[CC_CreateBy],[CC_CreateDate],[CC_ApproveStatus],[CC_ApproveBy],[CC_ApproveDate] 
                                                FROM  TR_CompetenctAssessment_DEV 
                                                inner join Employee emp on emp.DVCD = @GRP and emp.CODE = CC_EmpCode 
                                                 LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                                 where   [CC_EvaluteStatus] = 'Confirm'  {sqlCon}  and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())";


            sqlSelect_group.Parameters.Add(new SqlParameter("@GRP", group));

            DataTable dtGroup = oCOnnDCI.Query(sqlSelect_group);
            if (dtGroup.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGroup.Rows)
                {
                    AssessmentList asInfo = new AssessmentList();

                    asInfo.EvaluteYear = drow["CC_REV"].ToString();
                    asInfo.EmpCode = drow["CC_EmpCode"].ToString().Trim();
                    asInfo.Name = drow["CC_Name"].ToString();
                    asInfo.Posit = drow["CC_POSIT"].ToString();
                    asInfo.Dept = drow["CC_DEPT"].ToString();
                    asInfo.DvName = drow["CC_DV_ENAME"].ToString();
                    asInfo.CoreLevel = drow["CC_CoreLevel"].ToString();
                    asInfo.EvaluteDate = Convert.ToDateTime(drow["CC_EvaluteDate"].ToString());
                    asInfo.EvaluteBy = drow["CC_EvaluteBy"].ToString();
                    asInfo.EvaluteStatus = drow["CC_EvaluteStatus"].ToString();
                    asInfo.ApproveDate = Convert.ToDateTime(drow["CC_ApproveDate"].ToString() == "" ? null : Convert.ToDateTime(drow["CC_ApproveDate"].ToString()));
                    asInfo.ApproveBy = drow["CC_ApproveBy"].ToString();
                    asInfo.ApproveStatus = drow["CC_ApproveStatus"].ToString();


                    asList.Add(asInfo);
                }
            }
            return Ok(asList);
        }

        [NonAction]
        public int checkPositionInCoreLevelOne(string emp)
        {

            SqlCommand sqlSelect_group = new SqlCommand();
            sqlSelect_group.CommandText = @" SELECT [DV_CD],[Group],[CoreLevel]
                                          ,[EvalulateBy],a.POSIT,[ApproveBy],b.POSIT
                                          ,[CreateDate],[CreateBy],[Dept]
                                          FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]
                                          LEFT JOIN Employee a on a.CODE = EvalulateBy 
                                          LEFT JOIN Employee b on b.CODE = ApproveBy 
                                        where CoreLevel = '1' 
			                            and (CASE
			                            WHEN a.POSIT IN ('AM','MG','AMG','GM','AG','AGM') or  b.POSIT IN ('AM','MG','AMG','GM','AG','AGM') THEN 1
			                            ELSE 0 
		                            END ) > 0 and (EvalulateBy = '" + emp + @"' or ApproveBy ='" + emp + @"')";


            DataTable dtGroup = oCOnnDCI.Query(sqlSelect_group);

            return dtGroup.Rows.Count;
        }

    }
}





