using CoreAssessment_backend.Model;
using CoreAssessment_backend.Model.DashboardEmployee;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.DataClassification;
using System.Data;
using System.Reflection.Emit;
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
        [Route("getAssessmentList/{position}/{position_number}")]
        public IActionResult getAssessmentList(string position , int position_number)
        {
            //string position = "";
            string positions = "";
            string dvcd = "";
            string[] supervisor_level = { "SE", "SS", "ST", "SU" };
            string[] maneger_level = { "MG", "AM" };
            string[] genralManeger_level = { "GM", "AGM" };

            SqlCommand sqlSelect_Dvcd = new SqlCommand();

            List<AssessmentList> asList = new List<AssessmentList>();

            if (genralManeger_level.Contains(position))
            {
                positions = "'MG','AM'"; // ตำแหน่งที่สามารถเห้นได้
                sqlSelect_Dvcd.CommandText = @"SELECT  [DV_CD] FROM [dbDCI].[dbo].[DVCD_Master] 
                                          WHERE [DV_HDV_CD] = @DVCD";


            }
            else if (maneger_level.Contains(position))
            {
                positions = "'SE','SS','ST','SU'";
                sqlSelect_Dvcd.CommandText = @"SELECT  [DV_CD] FROM [dbDCI].[dbo].[DVCD_Master] 
                                          WHERE [SECT_CD] = @DVCD";

            }
            else if (supervisor_level.Contains(position))

            {
                positions = "'LE','LE.S','OP.S','FO','TE','TE.S','SF','EN','EN.S'";
                sqlSelect_Dvcd.CommandText = @"SELECT  [DV_CD] FROM [dbDCI].[dbo].[DVCD_Master] 
                                          WHERE [GRP_CD] = @DVCD";
            }

            sqlSelect_Dvcd.Parameters.Add(new SqlParameter("@DVCD", position_number));

            DataTable dtDvcd = oCOnnDCI.Query(sqlSelect_Dvcd);

            if (dtDvcd.Rows.Count > 0)
            {
                foreach (DataRow dr in dtDvcd.Rows)
                {
                    dvcd += "'" + dr["DV_CD"].ToString() + "',";
                
                }
                dvcd = dvcd.Substring(0, dvcd.Length - 1);
            }



            //SqlCommand sqlSelect = new SqlCommand();
            //sqlSelect.CommandText = @"SELECT [EvaluteYear],[EmpCode],emp.NAME + ' ' + emp.SURN as Name
	           // ,emp.POSIT,emp.[JOIN],dvcd.DEPT,dvcd.DV_ENAME,[CoreLevel],[Scroe],[EvaluteBy],[EvaluteDate],[ApproveStatus]
            //    FROM [dbDCI].[dbo].[TR_CompetenctAssessment]
            //    LEFT JOIN [dbDCI].[dbo].[Employee] emp ON emp.CODE = EmpCode
            //    LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
            //    LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
            //    WHERE emp.";

            SqlCommand sqlSelect_employee = new SqlCommand();
            sqlSelect_employee.CommandText = @" SELECT [EvaluteYear],[EmpCode],emp.NAME + ' ' + emp.SURN as Name
                                                ,emp.POSIT,emp.[JOIN],dvcd.DEPT,dvcd.DV_ENAME,[CoreLevel],[Scroe],[EvaluteBy],[EvaluteDate],[ApproveStatus]
                                                FROM [dbDCI].[dbo].[TR_CompetenctAssessment]
                                                LEFT JOIN [dbDCI].[dbo].[Employee] emp ON emp.CODE = EmpCode
                                                LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                                LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT

                                                WHERE  DVCD IN (" + dvcd + @") AND RESIGN = '1900-01-01' AND POSIT IN (" + positions + @")";
        

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
                    asInfo.ApproveStatus = drow["ApproveStatus"].ToString();

                    asList.Add(asInfo);



                }

            }

            return Ok(asList);
        }

        // กราฟ
        [HttpGet]
        [Route("getAssessmentList/{level}/{empcode}/{year}")]
        public IActionResult getAssessmentListByEmpcode(int level,string empcode, string year)
        {

            List<Dashboard> DashboardList = new List<Dashboard>();

            SqlCommand sqlSelect_CourseNames = new SqlCommand();


            sqlSelect_CourseNames.CommandText = @" SELECT distinct [Indicator_CourseName],[Indicator_CC] FROM [dbDCI].[dbo].[TR_Indicator] WHERE Indicator_Level = ('" + level + "') order by Indicator_CC";
            DataTable dtCourseName = oCOnnDCI.Query(sqlSelect_CourseNames);
            if(dtCourseName.Rows.Count > 0)
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
                            dbSC.Pass = Math.Round((Convert.ToDecimal(dtdashboard["total_score"].ToString()) * 100) / total_scroe);
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
            sqlEmployeeAssessment.CommandText = @"SELECT [EvaluteYear],[EmpCode],[CoreLevel],[Scroe],[ApproveStatus],[EvaluteBy]
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
                                                        SET [ApproveStatus] = 'finish',[ApproveBy] = @APPBY , [ApproveDate] = GETDATE()                                                       
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

    }








    }

