using CoreAssessment_backend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.DataClassification;
using System.Data;
using System.Reflection.Emit;
using System.Text.RegularExpressions;

namespace CoreAssessment_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssessmentPersonController : ControllerBase
    {
        // GET: AssessmentPersonController  


        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");




        [HttpGet]
        [Route("getEmployeeIndicator/{empcode}")]
        public IActionResult getEmployee(string empcode)
        {
            SqlCommand sqlSelect = new SqlCommand();
            Employee emp = new Employee();
            sqlSelect.CommandText = @"SELECT [CODE],[NAME],[SURN],[POSIT],dvcd.DEPT as DEPT,dvcd.DV_ENAME as SECT,[JOIN]
   
                                      FROM [dbDCI].[dbo].[Employee]
                                      LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd ON dvcd.DV_CD = DVCD
                                      WHERE CODE = @CODE AND RESIGN ='1900-01-01'";
            sqlSelect.Parameters.Add(new SqlParameter("@CODE", empcode));

            sqlSelect.CommandTimeout = 180;
            DataTable dtEmp = oCOnnDCI.Query(sqlSelect);

            if (dtEmp.Rows.Count > 0)
            {
                foreach (DataRow drow in dtEmp.Rows)
                {
                    
                    emp.Code = drow["CODE"].ToString();
                    emp.Name = drow["NAME"].ToString();
                    emp.Surn = drow["Surn"].ToString();
                    emp.Posit = drow["POSIT"].ToString();
                    emp.Dept = drow["DEPT"].ToString();
                    emp.Sect = drow["SECT"].ToString();
                    emp.JoinDate = Convert.ToDateTime(drow["JOIN"].ToString());
                
                   

                }

            }

            return Ok(emp);
        }
        [HttpGet]
        [Route("getSection/{section}")]
        public IActionResult getSection(string section)
        {
            SqlCommand sqlSelect = new SqlCommand();
            List<Section> section_list = new List<Section>();

            sqlSelect.CommandText = @"SELECT  * FROM [dbDCI].[dbo].[DVCD_Master]
                                      where  DV_HDV_CD = @SEC and DV_CD <> @SEC";

            sqlSelect.Parameters.Add(new SqlParameter("@SEC", section));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Section sec = new Section();

                    sec.Dv_name = drow["DV_ENAME"].ToString();
                    sec.Grp_cd = drow["DV_CD"].ToString();

                    section_list.Add(sec);

                }

            }

            return Ok(section_list);
        }



        [HttpGet]
        [Route("getGroup/{group}")]
        public IActionResult getGroup(string group)
        {
            SqlCommand sqlSelect = new SqlCommand();
            List<Section> section_list = new List<Section>();

            sqlSelect.CommandText = @"SELECT  * FROM [dbDCI].[dbo].[DVCD_Master]
                                      where  SECT_CD = @SEC";

            sqlSelect.Parameters.Add(new SqlParameter("@SEC", group));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Section sec = new Section();

                    sec.Dv_name = drow["DV_ENAME"].ToString();
                    sec.Grp_cd = drow["GRP_CD"].ToString();

                    section_list.Add(sec);

                }

            }

            return Ok(section_list);
        }



        [HttpGet]
        [Route("getEmployee/{section}/{group}/{level}")]
        public IActionResult getEmployee(int level, string section, string group)
        {

            string posittion = "";


            if (level == 1)
            {
                posittion = "'LE','LE.S','OP.S'";
                

            }
            else if (level == 2)
            {
                posittion = "'FO','TE','TE.S','SF'";
            }
            else if (level == 3)
            {
                posittion = "'EN','EN.S'";

            }
            else if (level == 4)
            {
                posittion = "'SE','SS','ST','SU'";
            }
            else if (level == 5)
            {
                posittion = "'MG','AM'";
                group = section;

            }


            SqlCommand sqlSelect = new SqlCommand();
            List<Employee> Employee_list = new List<Employee>();

            //sqlSelect.CommandText = @"SELECT * FROM [dbDCI].[dbo].[Employee] emp
            //LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
            //LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment] cta on cta.[EmpCode] = emp.CODE
            //WHERE POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01'";

            //sqlSelect.CommandText = @"SELECT CODE,NAME + ' ' + SURN as NAME, POSIT ,
            //                        CASE
            //                         WHEN (SELECT COUNT([EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment] WHERE [EmpCode] = CODE ) > 0 THEN 'TRUE'
            //                     ELSE 'FALSE'
            //                        END as STATUS
            //                        FROM [dbDCI].[dbo].[Employee] emp
            //                        LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
            //                        LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment] cta on cta.[EmpCode] = emp.CODE
            //                        WHERE POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01'";
            sqlSelect.CommandText = @"SELECT CODE,NAME + ' ' + SURN as NAME, POSIT ,[P_GRADE],
                                    CASE
	                                    WHEN (SELECT COUNT([EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment] WHERE [EmpCode] = CODE AND [ApproveStatus] = 'complete' ) > 0 THEN 'TRUE'
	                                ELSE 'FALSE'
                                    END as STATUS
                                    FROM [dbDCI].[dbo].[Employee] emp
                                    LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
                                    LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment] cta on cta.[EmpCode] = emp.CODE
                                    WHERE POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01'
                                    order by [P_GRADE] desc";

            sqlSelect.Parameters.Add(new SqlParameter("@DVCD", group));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Employee emp = new Employee();

                    emp.Code = drow["CODE"].ToString();
                    emp.Name = drow["NAME"].ToString();
                    emp.Posit = drow["POSIT"].ToString();
                    emp.Status = Convert.ToBoolean(drow["STATUS"]);
                    emp.Grade = drow["P_GRADE"].ToString() ;

                    Employee_list.Add(emp);

                }

            }

            return Ok(Employee_list);
        }







        [HttpGet]
        [Route("getIndicator/{section}/{group}/{level}/{empcode}")]
        public IActionResult getDataIndicatorList(int level, string section, string group, string empcode)

        {
            int total_choice = 0;
            SqlCommand sqlIndicator_Head = new SqlCommand();
            List<IndicatorHead> indicator_head = new List<IndicatorHead>();

            sqlIndicator_Head.CommandText = @" SELECT distinct [Indicator_CourseName],[Indicator_CC]
                                       FROM [dbDCI].[dbo].[TR_Indicator]
                                       WHERE [Indicator_Level] = @LEVEL
                                       order by Indicator_CC";

            sqlIndicator_Head.Parameters.Add(new SqlParameter("@LEVEL", level));



            DataTable dtIndicator_head = oCOnnDCI.Query(sqlIndicator_Head);

            if (dtIndicator_head.Rows.Count > 0)
            {
                foreach (DataRow drow in dtIndicator_head.Rows)
                {
                    IndicatorHead indicator = new IndicatorHead();


                    indicator.Indicator_Name = drow["Indicator_CourseName"].ToString();

                    indicator_head.Add(indicator);

                }

            }



            SqlCommand sqlIndicator_detail = new SqlCommand();
            List<IndicatorHead> indicator_detail = new List<IndicatorHead>();

            sqlIndicator_detail.CommandText = @" SELECT [Indicator_ID],[Indicator_Level],[Indicator_Category],[Indicator_CourseName],[Indicator_CC]
                                       FROM [dbDCI].[dbo].[TR_Indicator]
                                       WHERE Indicator_Level = @LEVEL
                                       order by Indicator_CC";

            sqlIndicator_detail.Parameters.Add(new SqlParameter("@LEVEL", level));


            DataTable dtIndicator_detail = oCOnnDCI.Query(sqlIndicator_detail);

            if (dtIndicator_detail.Rows.Count > 0)
            {
                foreach (DataRow drow in dtIndicator_detail.Rows)
                {
                    IndicatorHead indicator = new IndicatorHead();

                    indicator.Indicator_ID = int.Parse(drow["Indicator_ID"].ToString());
                    indicator.Indicator_Name = drow["Indicator_CourseName"].ToString();
                    indicator.Indicator_Category = drow["Indicator_Category"].ToString();

                    indicator_detail.Add(indicator);

                }

            }


            SqlCommand sqlCourseCode = new SqlCommand();
            List<CourseCodeDataTable> cc_list = new List<CourseCodeDataTable>();

            sqlCourseCode.CommandText = @"SELECT cc.[CorePosit],cc.[CoreLevel],cc.CoreNameEN,cct.COURSE_CODE,course.COURSE_NAME  as CourseName
                                      , e.POSIT
                                        ,CASE WHEN (SELECT COUNT(*) CNT FROM [dbDCI].[dbo].[TR_Trainee_Data] S WHERE S.COURSE_CODE = cct.COURSE_CODE AND S.EVALUATE_RESULT = 'P' AND S.EMPCODE = @EMPCODE  ) > 0 THEN 'PASS' ELSE 'FAIL' END [Status]
                                      ,( SELECT COUNT(scc.[CoreNameEN])
                                      FROM [dbDCI].[dbo].[TR_CoreCompetency] scc
                                      LEFT JOIN [dbDCI].[dbo].[TR_CoreCompetencyDet] scct on scct.CoreCode = scc.CoreCode
                                      LEFT JOIN [dbDCI].[dbo].[TR_COURSE] scourse on scourse.COURSE_CODE = scct.COURSE_CODE
                                      WHERE Course_Status = 'ACTIVE' AND scct.CoreCode = cct.CoreCode 
                                      ) No
                                    FROM [dbDCI].[dbo].[TR_CoreCompetency] cc
                                    LEFT JOIN [dbDCI].[dbo].[TR_CoreCompetencyDet] cct on cct.CoreCode = cc.CoreCode
                                    LEFT JOIN [dbDCI].[dbo].[TR_COURSE] course on course.COURSE_CODE = cct.COURSE_CODE
                                    INNER JOIN  [dbDCI].[dbo].[Employee] e ON e.POSIT = cc.CorePosit and e.CODE = @EMPCODE
                                    WHERE CoreLevel = @LEVEL
	                                ";

            sqlCourseCode.Parameters.Add(new SqlParameter("@EMPCODE", empcode));
            sqlCourseCode.Parameters.Add(new SqlParameter("@LEVEL", level));


            DataTable  CourseCodeDatatable = oCOnnDCI.Query(sqlCourseCode);

            if (CourseCodeDatatable.Rows.Count > 0)
            {
                foreach (DataRow drow in CourseCodeDatatable.Rows)
                {
                    CourseCodeDataTable ccDt = new CourseCodeDataTable();

                    ccDt.CoreLevel = int.Parse(drow["CoreLevel"].ToString());
                    ccDt.CourseNameEn = drow["CoreNameEN"].ToString();
                    ccDt.CourseCode = drow["COURSE_CODE"].ToString();
                    ccDt.Status = drow["Status"].ToString();

                    cc_list.Add(ccDt);

                }

            }

            // ดึง คำอธิบายหัวข้อการประเมิน และ รหัสวิชาในหัวข้อ SPEED แต่ละ core level
            List<IndicatorDataTable> indicatorDataTable = new List<IndicatorDataTable>();

            foreach (var head in indicator_head)
            {
                List<IndicatorDetail> indicatorDetail = new List<IndicatorDetail>();
                List<CourseCodeDetail> courseCodeDetail = new List<CourseCodeDetail>();
                IndicatorDataTable Dt_indicator = new IndicatorDataTable();

                Dt_indicator.Indicator_CourseName = head.Indicator_Name;
               
                foreach (var detail in indicator_detail)
                {
                    if(head.Indicator_Name == detail.Indicator_Name)
                    {
                        IndicatorDetail inDetail = new IndicatorDetail();
                        inDetail.Indicator_Id = detail.Indicator_ID;
                        inDetail.Indicator_DetailCourseName = detail.Indicator_Category;
                        total_choice++;
                        indicatorDetail.Add(inDetail);

                    }
                    Dt_indicator.Indicator_Category = indicatorDetail;
                }

                foreach (var cc in cc_list)
                {
                    if (head.Indicator_Name == cc.CourseNameEn)
                    {
                        CourseCodeDetail ccDetail = new CourseCodeDetail();
                        ccDetail.CourseCode = cc.CourseCode;
                        ccDetail.Status = cc.Status;
                        courseCodeDetail.Add(ccDetail);

                    }
                    Dt_indicator.Indicator_CourseCode = courseCodeDetail;

                }

                indicatorDataTable.Add(Dt_indicator);
            }


            return Ok(new { indicatorDataTables = indicatorDataTable,total_choice = total_choice });
        }



        [HttpPost]
        [Route("saveAssessmentDetail")]

        public IActionResult saveAssessmentDetail(IndicatorSubRecord sub)
        {

            SqlCommand sqlIndicator_detail_select = new SqlCommand();

            sqlIndicator_detail_select.CommandText = @" SELECT  [Year],[Empcode],[Indicator],[Score],[CreateDate],[CreateBy]
                                                 FROM [dbDCI].[dbo].[TR_CompetenctAssessmentDetail]
                                                 WHERE Year = @YEAR AND Empcode = @EmpCode AND Indicator = @INDICATOR";

            sqlIndicator_detail_select.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
            sqlIndicator_detail_select.Parameters.Add(new SqlParameter("@EmpCode", sub.EmpCode));
            sqlIndicator_detail_select.Parameters.Add(new SqlParameter("@INDICATOR", sub.IndicatorDetail_Id));

            DataTable dtIndicator_detail = oCOnnDCI.Query(sqlIndicator_detail_select);

            if (dtIndicator_detail.Rows.Count > 0)
            {
                SqlCommand sqlIndicator_detail_update = new SqlCommand();

                sqlIndicator_detail_update.CommandText = @" UPDATE [dbDCI].[dbo].[TR_CompetenctAssessmentDetail]
                                                         SET Score = @SCORE 
                                                         WHERE Year = @YEAR AND Empcode = @EmpCode AND Indicator = @INDICATOR ";

                sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
                sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@EmpCode", sub.EmpCode ));
                sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@INDICATOR", sub.IndicatorDetail_Id));
                sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@SCORE", sub.Scroce));


                oCOnnDCI.ExecuteCommand(sqlIndicator_detail_update);

                return Ok();
            }
            else
            {
              
                SqlCommand sqlIndicator_detail_insert = new SqlCommand();

                sqlIndicator_detail_insert.CommandText = @" INSERT INTO [dbDCI].[dbo].[TR_CompetenctAssessmentDetail] 
                                                     ([Year],[Empcode],[Indicator],[Score],[CreateDate],[CreateBy])
                                                     VALUES (@YEAR, @EMPCODE, @Indicator, @SCORE, GETDATE(),@CREATEBY);";

                sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
                sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@EMPCODE", sub.EmpCode));
                sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@Indicator", sub.IndicatorDetail_Id));
                sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@SCORE", sub.Scroce));
                sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@CREATEBY", sub.IndicatorBy));
                oCOnnDCI.ExecuteCommand(sqlIndicator_detail_insert);

                return Ok();
            }




        }

        [HttpPost]
        [Route("saveAssessmentMain")]
        public IActionResult saveAssessmentMain(IndicatorMainRecord main)
        {
            // หา Total Score

            decimal total_score = 0;
            decimal emp_percentScore = 0;

            SqlCommand sqlIndicator_find_total= new SqlCommand();
            sqlIndicator_find_total.CommandText = @"SELECT (COUNT(Indicator_Level) * 5) as TotalScore
                                                  FROM [dbDCI].[dbo].[TR_Indicator]
                                                  WHERE Indicator_Level = @LEVEL";
            sqlIndicator_find_total.Parameters.Add(new SqlParameter("@LEVEL", main.CoreLevel));

            DataTable dtIndicator_Find_Total = oCOnnDCI.Query(sqlIndicator_find_total);

            foreach (DataRow findScore in dtIndicator_Find_Total.Rows)
            {
                total_score = Convert.ToDecimal(findScore["TotalScore"]);
            }


            // เช็คว่า พนักงานคนนี้ มีการใส่คะแนนหรือยัง

            SqlCommand sqlIndicator_detail_count_score = new SqlCommand();

            sqlIndicator_detail_count_score.CommandText = @" SELECT SUM(Score) as yourScroce
                                                            FROM [dbDCI].[dbo].[TR_CompetenctAssessmentDetail]
                                                            WHERE Year = @YEAR AND Empcode = @EmpCode ";
            sqlIndicator_detail_count_score.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
            sqlIndicator_detail_count_score.Parameters.Add(new SqlParameter("@EmpCode", main.Empcode));

            DataTable dtIndicator_count_score = oCOnnDCI.Query(sqlIndicator_detail_count_score);
            if (dtIndicator_count_score.Rows.Count > 0)
            {
                foreach (DataRow findScore in dtIndicator_count_score.Rows)
                {
                    // คำนวณ เปอร์เซ็นต์คะแนนที่ได้
                    emp_percentScore = Math.Round(((Convert.ToDecimal(findScore["yourScroce"]) * 100) / total_score));
                }
            }
            else
            {
                return Ok((new { statusConfirm = false }));
            }


            // เช็คว่าพนักงานคนนี้มีการประเมินแล้วหรือยัง

            SqlCommand sqlEmployeeAssessment = new SqlCommand();
            sqlEmployeeAssessment.CommandText = @"SELECT [EvaluteYear],[EmpCode],[CoreLevel],[Scroe],[ApproveStatus],[EvaluteBy]
                                                 ,[EvaluteDate],[CreateBy],[CreateDate]
                                                 FROM [dbDCI].[dbo].[TR_CompetenctAssessment]
                                                 WHERE EvaluteYear = @YEAR AND  EmpCode = @CODE";
            sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
            sqlEmployeeAssessment.Parameters.Add(new SqlParameter("@CODE", main.Empcode));

            DataTable dtCheckEmployeeIsAssessment = oCOnnDCI.Query(sqlEmployeeAssessment);


            if (dtCheckEmployeeIsAssessment.Rows.Count > 0)
            {
                // อัพเดทข้อมูล
                SqlCommand sqlIndicator_main_update = new SqlCommand();

                sqlIndicator_main_update.CommandText = @"UPDATE [dbDCI].[dbo].[TR_CompetenctAssessment] 
                                                        SET [Scroe] = @SCORE ,[EvaluteBy] = @EVALUTEDBY,
                                                        [CreateBy] = @CREATEBY , [EvaluteDate] = GETDATE()
                                                        
                                                        WHERE [EvaluteYear] = @YEAR AND [EmpCode] = @CODE  ";

                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@CODE", main.Empcode));
                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@SCORE", emp_percentScore));
                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@EVALUTEDBY", main.IndicatorBy));
                sqlIndicator_main_update.Parameters.Add(new SqlParameter("@CREATEBY", main.IndicatorBy));
                oCOnnDCI.ExecuteCommand(sqlIndicator_main_update);

                return Ok((new { statusConfirm = true }));
            }
            else
            {



                // เพิ่มข้อมูล
                SqlCommand sqlIndicator_main_insert = new SqlCommand();

                sqlIndicator_main_insert.CommandText = @"INSERT INTO [dbDCI].[dbo].[TR_CompetenctAssessment] 
                                                     ([EvaluteYear],[EmpCode],[CoreLevel],[Scroe],[ApproveStatus],[EvaluteBy],[EvaluteDate],[CreateBy],[CreateDate])
                                                     VALUES (@YEAR, @EMPCODE, @CORELEVEL, @SCORE,'pendding', @EVALUTEDBY,GETDATE(),@CREATEBY,GETDATE());";


                sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
                sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@EMPCODE", main.Empcode));
                sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CORELEVEL", main.CoreLevel));
                sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@SCORE", emp_percentScore));
                sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@EVALUTEDBY", main.IndicatorBy));
                sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CREATEBY", main.IndicatorBy));
                oCOnnDCI.ExecuteCommand(sqlIndicator_main_insert);

                return Ok((new { statusConfirm = true }));

            }
               
            }

            


        }



    }



