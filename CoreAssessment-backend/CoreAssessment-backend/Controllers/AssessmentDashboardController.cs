using CoreAssessment_backend.Model.DashboardBarCharts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CoreAssessment_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssessmentDashboardController : ControllerBase
    {
        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");


        [HttpGet]
        [Route("getAssessmentDashboardBarChart")]

        public IActionResult DashboardBarChart()
        {
            int i = 0;
           
            decimal total_employee = 0;
            decimal total_Fullscore_employee = 0;
            decimal sum_employee = 0;
            decimal percent_total = 0;
            string[] coreLevel = { "'OP','OP.S','LE','LE.S'",
                                   "'FO','TE','TE.S','SF'",
                                   "'EN','EN.S'",
                                   "'SE','SS','ST','SU'",
                                   "'MG','AMG'"

                                 };


            string[] courseCode = {"CC 001 จิตสำนึกด้านความปลอดภัย (Safety Awareness)",
                                "CC 002 ความสามารถในการปรับตัว (Professional Adaptability)",
                                "CC 003 การผลิตแบบไดกิ้นที่เป็นเลิศ (Excellent PDS)",
                                "CC 004 จิตสำนึกด้านคุณภาพที่เป็นเลิศ (Excellent Quality Awareness)",
                                "CC 005 การพัฒนาอย่างต่อเนื่อง (Development)",
                                "MC 001 การบริหารจัดการผลงาน (Performance Management)",
                                "MC 002 การบริหารจัดการโดยยึดคนเป็นศูนย์กลาง",
                                "MC 003 การบริหารกลยุทธ์เชิงรุก (Provactive Strategy Management)"
            };




            // solution = ( score_employee * 100 ) / ( total_employee * total_score )
            List<DashboardBarChart> resut_dashboard = new List<DashboardBarChart>();

            try
            {

                while (i <= 5)
                {
                    int j = 0;
                    DashboardBarChart dashboardBarModel = new DashboardBarChart();
                    List<SubDashboardBarChart> result_score = new List<SubDashboardBarChart>();
                    // total_employee
                    SqlCommand sql_selectCountTotalEmployee = new SqlCommand();
                    sql_selectCountTotalEmployee.CommandText = @"SELECT COUNT(CODE)  total_employee FROM  [dbDCI].[dbo].[Employee]
                                                                WHERE  RESIGN = '1900-01-01' AND POSIT IN (" + coreLevel[i] + @")";


                    DataTable dtTotalEmployee = oCOnnDCI.Query(sql_selectCountTotalEmployee);

                    if (dtTotalEmployee.Rows.Count > 0)
                    {
                        foreach (DataRow drow in dtTotalEmployee.Rows)
                        {
                            total_employee = Convert.ToInt32(drow["total_employee"]);
                            //total_employee.Add(Convert.ToInt32(drow["total_employee"]));
                        }
                    }

                    // total_full_score
                    SqlCommand sql_selectCountTotalScore = new SqlCommand();
                    sql_selectCountTotalScore.CommandText = @" SELECT [Indicator_Level]
                                                              ,COUNT([Indicator_CC]) * 5 as total_score
                                                              ,[Indicator_CourseName]

                                                               FROM [dbDCI].[dbo].[TR_Indicator]

                                                               GROUP BY Indicator_CC,Indicator_CourseName,[Indicator_Level]
                                                               HAVING Indicator_Level = " + (i+1) + " order by [Indicator_CC]\r\n";


                    DataTable dtTotalScore = oCOnnDCI.Query(sql_selectCountTotalScore);

                    if (dtTotalScore.Rows.Count > 0)
                    {
                        foreach (DataRow drow in dtTotalScore.Rows)
                        {
                            
                            dashboardBarModel.CoreLevel = i + 1;
                            //dashboardBarModel.Course_code = courseCode[i];

                            total_Fullscore_employee = Convert.ToInt32(drow["total_score"]);

                             //score_total_employee
                             SqlCommand sql_selectSumEmployee = new SqlCommand();
                             sql_selectSumEmployee.CommandText = @" SELECT Indicator_Level,
	                                                      emp.POSIT
	                                                      ,indicator.Indicator_CourseName
                                                          ,SUM([Score]) as your_score

                                                  FROM [dbDCI].[dbo].[TR_CompetenctAssessmentDetail]
                                                  LEFT JOIN [dbDCI].[dbo].[TR_Indicator] indicator on indicator.Indicator_ID = Indicator
                                                  LEFT JOIN [dbDCI].[dbo].[Employee] emp on emp.CODE = Empcode

                                                  GROUP BY indicator.Indicator_CourseName,emp.POSIT,Indicator_Level,indicator.Indicator_CC
                                                  HAVING Indicator_Level = " + (i+1) + @" and indicator.Indicator_CourseName = @Indicator_CourseName
                                                  order by indicator.Indicator_CC";

                            sql_selectSumEmployee.Parameters.Add(new SqlParameter("@Indicator_CourseName", drow["Indicator_CourseName"]));

                            DataTable dtSumEmployeeScore = oCOnnDCI.Query(sql_selectSumEmployee);

                            if (dtSumEmployeeScore.Rows.Count > 0)
                            {
                                foreach (DataRow drow2 in dtSumEmployeeScore.Rows)
                                {
                                    SubDashboardBarChart subDashboardModel = new SubDashboardBarChart();
                                    sum_employee = Convert.ToDecimal(drow2["your_score"]);
                                    percent_total = (sum_employee * 100) / (total_employee * total_Fullscore_employee);
                                    //total_employee.Add(Convert.ToInt32(drow["total_score"]));
                                    subDashboardModel.CourseCode = courseCode[j].Substring(0, 6);
                                    subDashboardModel.Score = Math.Round(percent_total,2);
                                    
                                    result_score.Add(subDashboardModel);
                                }

                            }
                            else
                            {
                                SubDashboardBarChart subDashboardModel = new SubDashboardBarChart();
                                percent_total = 0;
                                subDashboardModel.Score = percent_total;
                                subDashboardModel.CourseCode = courseCode[j].Substring(0,6);

                                result_score.Add(subDashboardModel);
                            }
                            dashboardBarModel.Score = result_score;
                            j++;

                        }
                        resut_dashboard.Add(dashboardBarModel);

                    }



                    i++;
                }

            

            }

            catch(Exception ex) 
            {
            }
            return Ok(resut_dashboard);

        }



       
    }
}


