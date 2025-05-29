using CoreAssessment_backend.Model;
using CoreAssessment_backend.Model.Admin;
using CoreAssessment_backend.Model.AssessmentEmployee;
using CoreAssessment_backend.Model.EmployeeFlowLogin;
using CoreAssessment_backend.Model.HistoryTrainning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.DataClassification;
using Microsoft.Identity.Client;
using System.Data;
using System.Linq;
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
        [Route("getEmployeeEvalute/{empcode}")]
        public IActionResult getEmployeeFlowLogin(string empcode)
        {

            //empcode = "13361";
            //empcode = "40898";
            //empcode = "13257";
            //empcode = "14766";


            string dept = "";
            string sect = "";
            string grp = "";


            // get Dept สำหรับ GM
            SqlCommand sqlSelect_Dvcd = new SqlCommand();
            sqlSelect_Dvcd.CommandText = @"  SELECT distinct dept.DEPT_CD
            FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] tr
            INNER JOIN [dbDCI].[dbo].[HRD_GRP] dvcd on dvcd.GRP_CD = tr.DV_CD
            INNER JOIN [dbDCI].[dbo].[HRD_SECT] sect on sect.SECT_CD = dvcd.SECT_CD
            INNER JOIN [dbDCI].[dbo].[HRD_DEPT] dept on dept.DEPT_CD = sect.DEPT_CD

              WHERE EvalulateBy = @CODE or ApproveBy = @CODE ";
            sqlSelect_Dvcd.Parameters.Add(new SqlParameter("@CODE", empcode));

            sqlSelect_Dvcd.CommandTimeout = 180;
            DataTable dtEmp = oCOnnDCI.Query(sqlSelect_Dvcd);

            //int[] dvcd = new int[dtEmp.Rows.Count];

            if (dtEmp.Rows.Count > 0)
            {
                foreach (DataRow drow in dtEmp.Rows)
                {


                    dept += "" + Convert.ToInt32(drow["DEPT_CD"]) + ",";


                }

                dept = dept.Substring(0, dept.Length - 1);


            }



            // get SECT สำหรับ MG
            SqlCommand sqlSelect_Section = new SqlCommand();
            sqlSelect_Section.CommandText = @" SELECT distinct dvcd.SECT_CD
                 
              FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] tr
              LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd on dvcd.GRP_CD = tr.DV_CD

              WHERE EvalulateBy = @CODE";
            sqlSelect_Section.Parameters.Add(new SqlParameter("@CODE", empcode));

            sqlSelect_Section.CommandTimeout = 180;
            DataTable dtSection = oCOnnDCI.Query(sqlSelect_Section);


            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {

                    sect += "" + Convert.ToInt32(drow["SECT_CD"]) + ",";


                }

                sect = sect.Substring(0, sect.Length - 1);


            }




            // get SECT สำหรับ SS
            SqlCommand sqlSelect_Group = new SqlCommand();
            sqlSelect_Group.CommandText = @" SELECT distinct dvcd.GRP_CD
                 
              FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] tr
              LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd on dvcd.GRP_CD = tr.DV_CD

             WHERE EvalulateBy = @CODE";
            sqlSelect_Group.Parameters.Add(new SqlParameter("@CODE", empcode));

            sqlSelect_Section.CommandTimeout = 180;
            DataTable dtGroup = oCOnnDCI.Query(sqlSelect_Group);

            //int[] dvcd = new int[dtEmp.Rows.Count];

            if (dtGroup.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGroup.Rows)
                {

                    grp = "" + Convert.ToInt32(drow["GRP_CD"]) + "";


                }



            }


            return Ok(new { employeeLoginDept = dept, employeeLoginSect = sect, employeeLoginGroup = grp });
        }


        [HttpGet]
        [Route("getcoreLevelByEmployee/{empcode}/{group}/{posit}")]
        public IActionResult getcoreLevelByEmployee(string empcode,string group, string posit)
        {
            // ดึง core Level

            string[] coreLevel4 = { "SE", "SS", "ST", "SU" };
            string[] coreLevel5_MG = { "MG", "AMG","AM" };
            string[] coreLevel5_GM = { "GM", "SGM", "AGM","AG" };


            SqlCommand sqlSelect_Level = new SqlCommand();

            //if (coreLevel4.Contains(posit))
            //{
            //    sqlSelect_Level.CommandText = @" SELECT [CoreLevel]
            //    FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]

            //    WHERE DV_CD = @DVCD and CoreLevel < 2 ";
            //}
            //else if (coreLevel5_MG.Contains(posit))
            //{

            //    sqlSelect_Level.CommandText = @" SELECT [CoreLevel]
            //    FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]

            //    WHERE DV_CD = @DVCD and CoreLevel < 5 ";

            //}

            //else if (coreLevel5_GM.Contains(posit))
            //{
            //    sqlSelect_Level.CommandText = @" SELECT [CoreLevel]
            //    FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]

            //    WHERE DV_CD = @DVCD ";
            //}

            //{
            sqlSelect_Level.CommandText = @" SELECT [CoreLevel]
                FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]

                WHERE EvalulateBy = @EMPCODE  and DV_CD = @DVCD";
            sqlSelect_Level.Parameters.Add(new SqlParameter("@DVCD", group));
            sqlSelect_Level.Parameters.Add(new SqlParameter("@EMPCODE", empcode));


            sqlSelect_Level.CommandTimeout = 180;
            DataTable dtEmpCoreLv = oCOnnDCI.Query(sqlSelect_Level);

            int[] coreLevel = new int[dtEmpCoreLv.Rows.Count];
            int i = 0;
            if (dtEmpCoreLv.Rows.Count > 0)
            {
                foreach (DataRow drow in dtEmpCoreLv.Rows)
                {
                 
                  coreLevel[i] = Convert.ToInt32(drow["CoreLevel"]) - 1;

                    


                    i++;

                }

                //coreLv = coreLv.Substring(0, coreLv.Length - 1);

            }

            return Ok(coreLevel);

        }


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
        [Route("getDept/{dept}")]
        public IActionResult getDept(string dept)
        {
            SqlCommand sqlSelect = new SqlCommand();
            List<Dept> Dept_list = new List<Dept>();
            //(" + Condition + @")
            sqlSelect.CommandText = @"SELECT 
                                      [DV_CD],
                                      [DV_ENAME]
  
                                      FROM [dbDCI].[dbo].[DVCD_Master]
                                      where  DV_CD IN (" + dept + @") ";



            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Dept depts = new Dept();

                    depts.Dvcd = drow["DV_CD"].ToString();
                    depts.Dept_name = drow["DV_ENAME"].ToString();


                    Dept_list.Add(depts);

                }

            }

            return Ok(Dept_list);
        }





        [HttpGet]
        [Route("getSection/{position}/{section}")]
        public IActionResult getSection(string position, string section)
        {
            SqlCommand sqlSelect = new SqlCommand();
            List<Section> section_list = new List<Section>();



            string[] GRP = { "SE", "SS", "ST", "SU", "MG", "AMG","AM" };
            string[] SECT = { "GM", "SGM","AG" };

            if (GRP.Contains(position))
            {
                sqlSelect.CommandText = @"SELECT  * FROM [dbDCI].[dbo].[DVCD_Master] dvcdMst
                                      INNER JOIN TR_CompentencyApproveFlow flow on flow.DV_CD = dvcdMst.DV_CD
                                      where  DV_HDV_CD IN (" + section + @") and dvcdMst.DV_CD NOT IN (" + section + @")";
            }
            else
            {
                //sqlSelect.CommandText = @"SELECT  * FROM [dbDCI].[dbo].[DVCD_Master]

                //                          where  DV_HDV_CD IN (" + section + @") and DV_CD NOT IN (" + section + @")";

                sqlSelect.CommandText = $@"
                                        SELECT distinct SECT_CD,SECT  FROM [dbDCI].[dbo].[DVCD_Master] dvcd
                                        INNER JOIN [dbDCI].[dbo].[TR_CompentencyApproveFlow] tr on tr.DV_CD = dvcd.GRP_CD
                                        where  DEPT_CD IN ({section}) and dvcd.DV_CD NOT IN ({section}) and dvcd.DV_CD IN (SELECT DV_CD
                                         FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]
                                        where (EvalulateBy = {position}) AND DV_CD != '1130' 
                                        GROUP BY DV_CD,[Group])
                                        order by SECT_CD";
            }
            //where(EvalulateBy = { position} or ApproveBy = { position }) AND DV_CD != '1130'



            sqlSelect.Parameters.Add(new SqlParameter("@SEC", section));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Section sec = new Section();

                    //sec.Dv_name = drow["DV_ENAME"].ToString();
                    //sec.Grp_cd = drow["DV_CD"].ToString();

                    sec.Dv_name = drow["SECT"].ToString();
                    sec.Grp_cd = drow["SECT_CD"].ToString();

                    section_list.Add(sec);

                }

            }

            return Ok(section_list);
        }


        [HttpGet]
        [Route("getGroup/{empcode}/{group}")]
        public IActionResult getGroup(string empcode ,string group)
        {
            SqlCommand sqlSelect = new SqlCommand();
            List<Section> section_list = new List<Section>();



            sqlSelect.CommandText = @"SELECT  d.DV_CD,d.DV_ENAME FROM [dbDCI].[dbo].[DVCD_Master] d
                                      INNER JOIN [dbDCI].[dbo].[TR_CompentencyApproveFlow] f on f.DV_CD =  d.DV_CD  and f.EvalulateBy = @EMPCODE
                                      where  DV_HDV_CD IN (" + group + @") and d.DV_CD NOT IN (" + group + @")
                                      GROUP BY d.DV_CD,d.DV_ENAME";

            sqlSelect.Parameters.Add(new SqlParameter("@SEC", group));
            sqlSelect.Parameters.Add(new SqlParameter("@EMPCODE", empcode));


            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Section  sec = new Section();

                    sec.Dv_name = drow["DV_ENAME"].ToString();
                    sec.Grp_cd = drow["DV_CD"].ToString();

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

            //group = group.Substring(1, group.Length - 2);

            if (level == 1)
            {
                posittion = "'OP','LE','LE.S','OP.S'";


            }
            else if (level == 2)
            {
                posittion = "'FO','TE','TE.S','SF','TR'";
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
                posittion = "'MG','AMG','AM'";
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
	                                    WHEN (SELECT COUNT([EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment] WHERE [EmpCode] = CODE AND [EvaluteStatus] IN ('Pending')) > 0 THEN 0
										WHEN (SELECT COUNT([EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment] WHERE [EmpCode] = CODE AND [EvaluteStatus] IN ('Confirm','Approve') and EvaluteYear = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 1
										ELSE 0
                                    END as STATUS
                                    ,ISNULL(cta.EvaluteStatus,'NONE') as STATUS_2 , emp.[JOIN]
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
                    emp.Status_2 = drow["STATUS_2"].ToString();
                    emp.Grade = drow["P_GRADE"].ToString();
                    emp.JoinDate = Convert.ToDateTime(drow["JOIN"]);
                    TimeSpan diff = DateTime.Now.Date - emp.JoinDate.Value.Date;
                    double result = diff.TotalDays;

                    var totalYears = Math.Truncate(result / 365);
                    var totalMonths = Math.Truncate((result % 365) / 30);
                    var remainingDays = Math.Truncate((result % 365) % 30);

                    emp.WorkingAge_TotalDay = (int)result;
                    emp.WorkingAge_Year = (int)totalYears;
                    emp.WorkingAge_Month = (int)totalMonths;
                    emp.WorkingAge_Day = (int)remainingDays;

                    Employee_list.Add(emp);

                }

            }

            return Ok(Employee_list);
        }




        [HttpGet]
        [Route("getEmployeeDev/{empcode}/{section}/{group}/{level}")]
        public IActionResult getEmployeeDev(string empcode,int level, string section, string group)
        {

            string posittion = "";

            //group = group.Substring(1, group.Length - 2);

            if (level == 1)
            {
                posittion = "'OP','LE','LE.S','OP.S'";


            }
            else if (level == 2)
            {
                posittion = "'FO','TE','TE.S','SF','TR'";
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
                posittion = "'MG','AMG','AM'";
                group = section;

            }


            SqlCommand sqlSelect = new SqlCommand();
            List<Employee> Employee_list = new List<Employee>();

            sqlSelect.CommandText = @"SELECT emp.CODE,NAME + ' ' + SURN as NAME, POSIT ,[P_GRADE],NOTE as FPOSIT ,
                                        CASE
                                        WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Pending')) > 0 THEN 0
            	WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Confirm','Approve') and SUBSTRING([CC_REV],0,5) = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 1
            	ELSE 0
                                       END as STATUS
                                       ,ISNULL(cta.[CC_EvaluteStatus],'NONE') as STATUS_2 , emp.[JOIN]
                                       FROM [dbDCI].[dbo].[Employee] emp
                                       LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
                                       LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
            LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT and DICT_STATUS = 'ACTIVE'
                                       WHERE POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01'
                                       order by [P_GRADE] desc";
            sqlSelect.Parameters.Add(new SqlParameter("@DVCD", group));

            //   sqlSelect.CommandText = @"SELECT emp.CODE,NAME + ' ' + SURN as NAME, POSIT ,[P_GRADE],NOTE as FPOSIT ,
            //                            CASE
            //                            WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Pending')) > 0 THEN 0
            //	WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Confirm','Approve') and SUBSTRING([CC_REV],0,5) = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 1
            //	ELSE 0
            //                           END as STATUS
            //                           ,ISNULL(cta.[CC_EvaluteStatus],'NONE') as STATUS_2 , emp.[JOIN]
            //                           FROM [dbDCI].[dbo].[Employee] emp
            //                           LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
            //                           LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
            //LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT and DICT_STATUS = 'ACTIVE'
            //                           WHERE POSIT IN (" + posittion + @") and DVCD IN (SELECT DV_CD FROM TR_CompentencyApproveFlow where EvalulateBy =  @EMPCODE)  AND RESIGN = '1900-01-01'
            //                           order by [P_GRADE] desc";

            //   sqlSelect.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    Employee emp = new Employee();

                    emp.Code = drow["CODE"].ToString();
                    emp.Name = drow["NAME"].ToString();
                    emp.Posit = drow["FPOSIT"].ToString().ToUpper();
                    emp.Status = Convert.ToBoolean(drow["STATUS"]);
                    emp.Status_2 = drow["STATUS_2"].ToString();
                    emp.Grade = drow["P_GRADE"].ToString();
                    emp.JoinDate = Convert.ToDateTime(drow["JOIN"]);
                    TimeSpan diff = DateTime.Now.Date - emp.JoinDate.Value.Date;
                    double result = diff.TotalDays;

                    var totalYears = Math.Truncate(result / 365);
                    var totalMonths = Math.Truncate((result % 365) / 30);
                    var remainingDays = Math.Truncate((result % 365) % 30);

                    emp.WorkingAge_TotalDay = (int)result;
                    emp.WorkingAge_Year = (int)totalYears;
                    emp.WorkingAge_Month = (int)totalMonths;
                    emp.WorkingAge_Day = (int)remainingDays;

                    Employee_list.Add(emp);

                }

            }

            return Ok(Employee_list);
        }

        [HttpGet]
        [Route("editSelectAssessment/{rev}/{code}")]
        public IActionResult editSelectAssessment(string rev, string code)
        {
            SqlCommand sqlSelect = new SqlCommand();
            List<IndicatorSubRecordDev> subEmployeeAssessment = new List<IndicatorSubRecordDev>();


            sqlSelect.CommandText = @"SELECT *
                                             FROM [dbDCI].[dbo].[TR_CompetenctAssessmentDetail_DEV]
                                             where [CD_Rev] = @REV and [CD_EmpCode] = @EMPCODE";

            sqlSelect.Parameters.Add(new SqlParameter("@REV", rev.Trim()));
            sqlSelect.Parameters.Add(new SqlParameter("@EMPCODE", code));


            DataTable dtSub = oCOnnDCI.Query(sqlSelect);

            if (dtSub.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSub.Rows)
                {
                    IndicatorSubRecordDev _subRecordDev = new IndicatorSubRecordDev();
                    _subRecordDev.CD_Gap = Convert.ToInt16(drow["CD_Gap"]);
                    _subRecordDev.CD_EmpCode = drow["CD_EmpCode"].ToString();
                    _subRecordDev.CD_Comment = drow["CD_Comment"].ToString();
                    _subRecordDev.CD_Name = drow["CD_CCName"].ToString();
                    _subRecordDev.CD_Rev = drow["CD_Rev"].ToString();
                    _subRecordDev.CD_ExpectedScore = Convert.ToInt16(drow["CD_ExpectedScore"]);
                    _subRecordDev.CD_ActualScore = Convert.ToInt16(drow["CD_ActualScore"]);

                    subEmployeeAssessment.Add(_subRecordDev);

                }

            }

            return Ok(subEmployeeAssessment);
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

            // ถ้าพนักงานประเมินแล้ว
            SqlCommand sqlIndicator_detail = new SqlCommand();
            List<IndicatorHead> indicator_detail = new List<IndicatorHead>();

            sqlIndicator_detail.CommandText = @" SELECT [Indicator_ID],[Indicator_Level],[Indicator_Category],[Indicator_CourseName],[Indicator_CC],
                                   CASE 
									   WHEN trDetail.Score > 0 THEN trDetail.Score
									ELSE 0
								   END as Score
                                   FROM [dbDCI].[dbo].[TR_Indicator]
                                   LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessmentDetail] trDetail  on trDetail.Indicator = Indicator_ID and trDetail.Empcode = @EMPCODE
                                   WHERE Indicator_Level = @LEVEL  
                                   order by Indicator_CC";

            sqlIndicator_detail.Parameters.Add(new SqlParameter("@LEVEL", level));
            sqlIndicator_detail.Parameters.Add(new SqlParameter("@EMPCODE", empcode));



            DataTable dtIndicator_detail = oCOnnDCI.Query(sqlIndicator_detail);

            if (dtIndicator_detail.Rows.Count > 0)
            {
                foreach (DataRow drow in dtIndicator_detail.Rows)
                {
                    IndicatorHead indicator = new IndicatorHead();

                    indicator.Indicator_ID = int.Parse(drow["Indicator_ID"].ToString());
                    indicator.Indicator_Name = drow["Indicator_CourseName"].ToString();
                    indicator.Indicator_Category = drow["Indicator_Category"].ToString();
                    indicator.Scroe = int.Parse(drow["Score"].ToString());

                    indicator_detail.Add(indicator);

                }

            }
            // ถ้ายังไม่ได้ประเมิน
            else
            {
                SqlCommand sqlIndicator_detail_notEvaluted = new SqlCommand();

                sqlIndicator_detail_notEvaluted.CommandText = @" SELECT [Indicator_ID],[Indicator_Level],[Indicator_Category],[Indicator_CourseName],[Indicator_CC]
                                       FROM [dbDCI].[dbo].[TR_Indicator]
                                       WHERE Indicator_Level = @LEVEL
                                       order by Indicator_CC";

                sqlIndicator_detail_notEvaluted.Parameters.Add(new SqlParameter("@LEVEL", level));


                DataTable dtIndicator_detail_notEvaluted = oCOnnDCI.Query(sqlIndicator_detail_notEvaluted);

                if (dtIndicator_detail_notEvaluted.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtIndicator_detail_notEvaluted.Rows)
                    {
                        IndicatorHead indicator = new IndicatorHead();

                        indicator.Indicator_ID = int.Parse(drow["Indicator_ID"].ToString());
                        indicator.Indicator_Name = drow["Indicator_CourseName"].ToString();
                        indicator.Indicator_Category = drow["Indicator_Category"].ToString();
                        indicator.Scroe = 0;

                        indicator_detail.Add(indicator);

                    }

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


            DataTable CourseCodeDatatable = oCOnnDCI.Query(sqlCourseCode);

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
                    if (head.Indicator_Name == detail.Indicator_Name)
                    {
                        IndicatorDetail inDetail = new IndicatorDetail();
                        inDetail.Indicator_Id = detail.Indicator_ID;
                        inDetail.Indicator_DetailCourseName = detail.Indicator_Category;
                        inDetail.Scroe = detail.Scroe;
                        inDetail.Status = cc_list.Where(x => x.CourseNameEn == detail.Indicator_Name && x.Status == "FAIL").Count() > 0 ? "FAIL" : "PASS";
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





            return Ok(new { indicatorDataTables = indicatorDataTable, total_choice = total_choice });
        }



        [HttpGet]
        [Route("getPerviousScroe/{empcode}")]
        public IActionResult getPerviousScroe(string empcode)
        {
            int perviousScore = 0;
            SqlCommand sqlPerviousScroe = new SqlCommand();
            sqlPerviousScroe.CommandText = @"SELECT ISNULL(SUM(Score),(SELECT SUM(Score) FROM [dbDCI].[dbo].[TR_CompetenctAssessmentDetail] where 
             Year =@YEAR and Empcode = @EMPCODE)) as PerviousScroe  FROM [dbDCI].[dbo].[TR_CompetenctAssessmentDetail]
             where [CreateDate] not in (select max([CreateDate]) from [dbDCI].[dbo].[TR_CompetenctAssessmentDetail]
	         where  Year = @YEAR and Empcode = @EMPCODE) and Year = @YEAR and Empcode = @EMPCODE";

            sqlPerviousScroe.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
            sqlPerviousScroe.Parameters.Add(new SqlParameter("@EMPCODE", empcode));



            DataTable dtPerviousScroe = oCOnnDCI.Query(sqlPerviousScroe);

            if (dtPerviousScroe.Rows.Count > 0)
            {
                foreach (DataRow drow in dtPerviousScroe.Rows)
                {

                    perviousScore = Convert.ToInt16(drow["PerviousScroe"]);

                }

            }

            return Ok(new { perviousScore = perviousScore });

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
                sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@EmpCode", sub.EmpCode));
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

            SqlCommand sqlIndicator_find_total = new SqlCommand();
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
                    if (findScore["yourScroce"].ToString() == "")
                    {
                        emp_percentScore = 0;
                    }
                    else
                    {
                        emp_percentScore = Math.Round(((Convert.ToDecimal(findScore["yourScroce"]) * 100) / total_score));

                    }
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
                // เช็ค REV

                SqlCommand sqlIndicator_check_rev = new SqlCommand();

                sqlIndicator_check_rev.CommandText = @"SELECT  [CODE]
                                                      FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                                      where GETDATE() BETWEEN ST_DATE and EN_DATE and STATUS != 0";
                DataTable dtCheckREV = oCOnnDCI.Query(sqlIndicator_check_rev);

                if (dtCheckREV.Rows.Count > 0)
                {
                    // เพิ่มข้อมูล

                    foreach (DataRow drCheckREV in dtCheckREV.Rows)
                    {
                        SqlCommand sqlIndicator_main_insert = new SqlCommand();

                        sqlIndicator_main_insert.CommandText = @"INSERT INTO [dbDCI].[dbo].[TR_CompetenctAssessment] 
                                                     ([REV],[EvaluteYear],[EmpCode],[CoreLevel],[Scroe],[EvaluteStatus],[EvaluteBy],[EvaluteDate],[CreateBy],[CreateDate])
                                                     VALUES (@REV,@YEAR, @EMPCODE, @CORELEVEL, @SCORE,'Pending', @EVALUTEDBY,GETDATE(),@CREATEBY,GETDATE());";

                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@REV", drCheckREV["CODE"]));
                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@YEAR", DateTime.Now.ToString("yyyy")));
                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@EMPCODE", main.Empcode));
                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CORELEVEL", main.CoreLevel));
                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@SCORE", emp_percentScore));
                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@EVALUTEDBY", main.IndicatorBy));
                        sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CREATEBY", main.IndicatorBy));
                        oCOnnDCI.ExecuteCommand(sqlIndicator_main_insert);


                    }
                    return Ok((new { statusConfirm = true }));

                }
                else
                {
                    return Ok((new { statusConfirm = false }));

                }






            }

        }




        // ค้นหาด้วยรหัสพนักงาน เพือหา แผนกที่สามารถประเมินได้

        [HttpGet]
        [Route("getDVCD/{empcode}")]
        public IActionResult getDVCD(string empcode)
        {


            List<EmpDvcd> EmpDvcd_list = new List<EmpDvcd>();

            string dvcd = "";
            string empPoistion = "";
            string sqlCommandText = "";



            string[] LV1 = { "LE", "LE.S", "OP.S" };
            string[] LV2 = { "FO", "TE", "TE.S", "SF" };
            string[] LV3 = { "EN", "EN.S" };
            string[] LV4 = { "MG", "AM" };
            string[] LV5 = { "GM", "SGM" };



            SqlCommand sqlSelectEmployee = new SqlCommand();

            sqlSelectEmployee.CommandText = @"SELECT POSIT,DVCD FROM [dbDCI].[dbo].[Employee] emp
                                         WHERE emp.CODE = @CODE AND RESIGN = '1900-01-01'";

            sqlSelectEmployee.Parameters.Add(new SqlParameter("@CODE", empcode));

            DataTable dtEmp = oCOnnDCI.Query(sqlSelectEmployee);

            if (dtEmp.Rows.Count > 0)
            {
                foreach (DataRow drow in dtEmp.Rows)
                {

                    empPoistion = drow["POSIT"].ToString();
                    dvcd = drow["DVCD"].ToString();
                }

            }


            if (LV5.Contains(empPoistion))
            {

                sqlCommandText = @"SELECT   [DV_CD],[DV_ENAME]
                                    FROM [dbDCI].[dbo].[DVCD_Master]
                                    WHERE DEPT_CD = @DVCD";

            }
            else if (LV4.Contains(empPoistion))
            {
                sqlCommandText = @"SELECT   [DV_CD],[DV_ENAME]
                                    FROM [dbDCI].[dbo].[DVCD_Master]
                                    WHERE SECT_NAME = @DVCD";
            }
            else if (LV3.Contains(empPoistion))
            {
                sqlCommandText = @"SELECT   [DV_CD],[DV_ENAME]
                                    FROM [dbDCI].[dbo].[DVCD_Master]
                                    WHERE GRP_NAME = @DVCD";

            }



            SqlCommand sqlFindDvcd = new SqlCommand();
            sqlFindDvcd.CommandText = sqlCommandText;
            sqlFindDvcd.Parameters.Add(new SqlParameter("@DVCD", dvcd));

            DataTable dtDVCD = oCOnnDCI.Query(sqlFindDvcd);

            if (dtDVCD.Rows.Count > 0)
            {
                foreach (DataRow drow in dtDVCD.Rows)
                {
                    EmpDvcd empDvcd = new EmpDvcd();
                    empDvcd.DVCD = drow["DV_CD"].ToString();
                    empDvcd.DVCD_NAME = drow["DV_ENAME"].ToString();

                    EmpDvcd_list.Add(empDvcd);
                }

            }


            return Ok(EmpDvcd_list);
        }


        // ค้นหาด้วยเลข DVCD เพือหา พนักงานในแผนก

        [HttpGet]
        [Route("getEmployeeData/{dvcd}")]
        public IActionResult getEmployeeData(string dvcd)
        {


            SqlCommand sqlSelect = new SqlCommand();
            List<EmployeeDVCD> EmployeeDVCD_list = new List<EmployeeDVCD>();


            sqlSelect.CommandText = @"SELECT CODE,NAME + ' ' + SURN as NAME, POSIT ,[P_GRADE]                                  
                                    FROM [dbDCI].[dbo].[Employee] emp
                                    LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT

                                    WHERE DVCD = @DVCD AND RESIGN = '1900-01-01' and WSTS <> 'M'
                                    order by [P_GRADE] desc";

            sqlSelect.Parameters.Add(new SqlParameter("@DVCD", dvcd));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    EmployeeDVCD empDVCD = new EmployeeDVCD();

                    empDVCD.Code = drow["CODE"].ToString();
                    empDVCD.Name = drow["NAME"].ToString();
                    empDVCD.Posit = drow["POSIT"].ToString();
                    empDVCD.Grade = drow["P_GRADE"].ToString();

                    EmployeeDVCD_list.Add(empDVCD);

                }

            }

            return Ok(EmployeeDVCD_list);
        }

        // ค้นหาด้วยรหัสพนักงาน เพือหา ประวัติการอบรม

        [HttpGet]
        [Route("getTrainningHistory/{empcode}")]
        public IActionResult getHistoryTrainning(string empcode)
        {


            SqlCommand sqlSelecttrainessHistory = new SqlCommand();
            List<TraineesHistory> TraineesHistoryDataPayload = new List<TraineesHistory>();


            sqlSelecttrainessHistory.CommandText = @"SELECT c.COURSE_CODE, c.COURSE_NAME
                                                    ,s.SCHEDULE_START, s.SCHEDULE_END ,TRAIN_DAY  as HOURS
                                                    ,t.EVALUATE_RESULT
                                  FROM [dbDCI].[dbo].[TR_Trainee_Data] t
                                  INNER JOIN [dbDCI].[dbo].[TR_Schedule] s on t.SCHEDULE_CODE = s.SCHEDULE_CODE
                                  INNER JOIN [dbDCI].[dbo].[TR_COURSE] c on s.COURSE_ID = c.ID
                                  WHERE t.EMPCODE = @CODE and s.STATUS = 'ACTIVE'
                                  ORDER BY s.SCHEDULE_START desc";

            sqlSelecttrainessHistory.Parameters.Add(new SqlParameter("@CODE", empcode));

            DataTable dtSection = oCOnnDCI.Query(sqlSelecttrainessHistory);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {
                    TraineesHistory trainessHistory = new TraineesHistory();

                    trainessHistory.COURSE_NAME = drow["COURSE_CODE"].ToString() + " : " + drow["COURSE_NAME"].ToString();
                    trainessHistory.SCHEDULE_DATE = Convert.ToDateTime(drow["SCHEDULE_START"]).ToString("dd/MM/yy") + " - " + Convert.ToDateTime(drow["SCHEDULE_END"]).ToString("dd/MM/yy");
                    trainessHistory.HOURS = drow["HOURS"].ToString();
                    trainessHistory.RESULT = drow["EVALUATE_RESULT"].ToString();

                    TraineesHistoryDataPayload.Add(trainessHistory);

                }

            }

            return Ok(TraineesHistoryDataPayload);
        }



        [HttpGet]
        [Route("getRunningCodeREV")]
        public IActionResult getRunningCodeREV()
        {


            string ym = DateTime.Now.ToString("yyyyMM");
            string runningNo = "";
            char runningChar = 'A';




            SqlCommand sqlGetDefalutRuningNO = new SqlCommand();

            sqlGetDefalutRuningNO.CommandText = @"SELECT  RIGHT(CODE,1) as CODE
                                                      FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                                      order by CDATE desc";

            DataTable dtDefalutRunning = oCOnnDCI.Query(sqlGetDefalutRuningNO);
            if (dtDefalutRunning.Rows.Count > 0)
            {
                foreach (DataRow drow in dtDefalutRunning.Rows)
                {
                    runningChar = Convert.ToChar(drow["CODE"].ToString());
                }

                runningChar = (char)(runningChar + 1);
                runningNo = DateTime.Now.ToString("yyyyMM") + runningChar;


            }
            else
            {
                runningNo = DateTime.Now.ToString("yyyyMM") + runningChar;
            }

            return Ok(runningNo);

        }





        [HttpPost]
        [Route("saveREV")]
        public IActionResult saveREV(CompentencyRoundREV Rev)
        {
            SqlCommand sqlCheckActive = new SqlCommand();

            sqlCheckActive.CommandText = @"SELECT [CODE],[ST_DATE],[EN_DATE],[STATUS],[UDATE],[CDATE]
                                           FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                           where STATUS = 1";


            DataTable dtCheck = oCOnnDCI.Query(sqlCheckActive);
            if (dtCheck.Rows.Count > 0)
            {
                return Ok(new { status = "NG" });
            }
            else
            {
                SqlCommand sqlGetDefalutRuningNO = new SqlCommand();

                sqlGetDefalutRuningNO.CommandText = @"INSERT INTO [dbDCI].[dbo].[TR_CompetenctAssessment] 
                                                     ([CODE],[ST_DATE],[EN_DATE],[STATUS],[UDATE],[CDATE])
                                                     VALUES (@CODE,@STDATE, @ENDATE, @STATUS, GETDATE(),GETDATE());";

                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@CODE", Rev.code));
                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@STDATE", Rev.stDate));
                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@ENDATE", Rev.enDate));
                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@STATUS", Rev.status));
                oCOnnDCI.ExecuteCommand(sqlGetDefalutRuningNO);

                return Ok(new { status = "OK" });

            }



        }

        [HttpGet]
        [Route("getEditREV/{code}")]
        public IActionResult getEditREV(string code)
        {

            CompentencyRoundREV compentencyRoundREV = new CompentencyRoundREV();

            SqlCommand sqlGetDefalutRuningNO = new SqlCommand();

            sqlGetDefalutRuningNO.CommandText = @"SELECT  * FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                                  WHERE CODE = @CODE ";

            sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@CODE", code));

            DataTable dtDefalutRunning = oCOnnDCI.Query(sqlGetDefalutRuningNO);
            if (dtDefalutRunning.Rows.Count > 0)
            {
                foreach (DataRow drow in dtDefalutRunning.Rows)
                {
                    compentencyRoundREV.code = drow["CODE"].ToString();
                    compentencyRoundREV.stDate = Convert.ToDateTime(drow["ST_DATE"]).ToString("yyyy-MM-dd HH:mm:ss");
                    compentencyRoundREV.enDate = Convert.ToDateTime(drow["EN_DATE"]).ToString("yyyy-MM-dd HH:mm:ss");
                    compentencyRoundREV.status = Convert.ToBoolean(drow["STATUS"]);
                }

            }
            return Ok(compentencyRoundREV);



        }

        [HttpPost]
        [Route("EditREV")]
        public IActionResult EditREV(CompentencyRoundREV Rev)
        {

            SqlCommand sqlCheckActive = new SqlCommand();

            sqlCheckActive.CommandText = @"SELECT [CODE],[ST_DATE],[EN_DATE],[STATUS],[UDATE],[CDATE]
                                           FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                           where STATUS = 1 and CODE != @CODE";
            sqlCheckActive.Parameters.Add(new SqlParameter("@CODE", Rev.code));


            DataTable dtCheck = oCOnnDCI.Query(sqlCheckActive);
            if (dtCheck.Rows.Count > 0)
            {
                return Ok(new { status = "NG" });
            }
            else
            {
                SqlCommand sqlGetDefalutRuningNO = new SqlCommand();

                sqlGetDefalutRuningNO.CommandText = @"UPDATE [dbDCI].[dbo].[TR_CompentencyREV] 
                                                      SET ST_DATE = @STDATE , EN_DATE = @ENDATE , STATUS = @STATUS
                                                      WHERE CODE = @CODE";

                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@CODE", Rev.code));
                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@STDATE", Rev.stDate));
                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@ENDATE", Rev.enDate));
                sqlGetDefalutRuningNO.Parameters.Add(new SqlParameter("@STATUS", Rev.status));
                oCOnnDCI.ExecuteCommand(sqlGetDefalutRuningNO);

                return Ok(new { status = "OK" });




            }
        }



        [HttpGet]
        [Route("getCompentencyAssessmentForm/{level}/{empcode}")]
        public IActionResult getCompentencyAssessmentForm(string level, string empcode)
        {


            Dictionary<string, string[]> cc = new Dictionary<string, string[]>()

            {
                { "CC001", new string[] { "จิตสำนึกด้านความปลอดภัย (Safety Awareness)", "SAFETY AND ENVIRONMENT AWARENESS" } },
                { "CC002", new string[] { "ความสามารถในการปรับตัว (Professional Adaptabillity)", "PROFESSIONAL ADAPTABILITY" } },
                { "CC003", new string[] { "การผลิตแบบไดกิ้นที่เป็นเลิศ (Excellent PDS)", "EXCELLENT PDS" } },
                { "CC004", new string[] { "จิตสำนึกด้านคุณภาพที่เป็นเลิศ (Excellent Quality Awareness)","EXCELLENT QUALITY AWARENESS"} },
                { "CC005", new string[] { "การพัฒนาอย่างต่อเนื่อง (Development)", "DEVELOPMENT" } }

            };

            List<CoreCompentency> assessmentList = new List<CoreCompentency>();


            foreach (var item in cc)
            {

                // column 1

                int i = 0;

                CoreCompentency coreCompentency = new CoreCompentency();
                coreCompentency.cc_name = item.Key;
                coreCompentency.cc_desc = item.Value[0];


                List<Knowledge> knowledges = new List<Knowledge>();


                // column 2

                SqlCommand sqlSelectMainIndicator = new SqlCommand();

                sqlSelectMainIndicator.CommandText = @"SELECT  [Indicator_Level]
                                                      ,[Indicator_CC]
                                                      ,[Indicator_Main]
                                                      FROM [dbDCI].[dbo].[TR_Indicator_Main]
                                                      where Indicator_CC = @CC and Indicator_Level = @LEVEL";

                sqlSelectMainIndicator.Parameters.Add(new SqlParameter("@LEVEL", level));
                sqlSelectMainIndicator.Parameters.Add(new SqlParameter("@CC", item.Key));

                DataTable dtgetCC = oCOnnDCI.Query(sqlSelectMainIndicator);
                if (dtgetCC.Rows.Count > 0)
                {

                    foreach (DataRow dr in dtgetCC.Rows)
                    {
                        coreCompentency.cc_title = dr["Indicator_Main"].ToString();

                        List<SubBehavior> behavior_list = new List<SubBehavior>();


                        SqlCommand sqlSelectSubIndicator = new SqlCommand();
                        sqlSelectSubIndicator.CommandText = @"SELECT [Indicator_Level],[Indicator_CC],[Indicator_Category]
                                                                FROM [dbDCI].[dbo].[TR_Indicator]
                                                             where Indicator_Level = @LEVEL and Indicator_CC = @CC";

                        sqlSelectSubIndicator.Parameters.Add(new SqlParameter("@LEVEL", level));
                        sqlSelectSubIndicator.Parameters.Add(new SqlParameter("@CC", item.Key));
                        DataTable dtgetSubBB = oCOnnDCI.Query(sqlSelectSubIndicator);

                        if (dtgetSubBB.Rows.Count > 0)
                        {
                            foreach (DataRow drSub in dtgetSubBB.Rows)
                            {
                                SubBehavior subBehavior = new SubBehavior();
                                subBehavior.sub_name = drSub["Indicator_Category"].ToString();
                                behavior_list.Add(subBehavior);
                            }
                        }

                        coreCompentency.cc_Behavior = behavior_list;

                    }


                }


                // column 3



                SqlCommand sqlSelectFindKnowledge = new SqlCommand();

                sqlSelectFindKnowledge.CommandText = @"
                                    SELECT cc.CoreNameEN,course.COURSE_NAME  as CourseName
                                        ,CASE WHEN (SELECT COUNT(*) CNT FROM [dbDCI].[dbo].[TR_Trainee_Data] S WHERE S.COURSE_CODE = cct.COURSE_CODE AND S.EVALUATE_RESULT = 'P' AND S.EMPCODE = @CODE  ) > 0 THEN 'PASS' ELSE 'FAIL' END [Status]
                                    
                                    FROM [dbDCI].[dbo].[TR_CoreCompetency] cc
                                    LEFT JOIN [dbDCI].[dbo].[TR_CoreCompetencyDet] cct on cct.CoreCode = cc.CoreCode
                                    LEFT JOIN [dbDCI].[dbo].[TR_COURSE] course on course.COURSE_CODE = cct.COURSE_CODE
                                    INNER JOIN  [dbDCI].[dbo].[Employee] e ON e.POSIT = cc.CorePosit and e.CODE = @CODE
                                    WHERE cc.CoreLevel = @LEVEL and CoreNameEN = @CC";

                sqlSelectFindKnowledge.Parameters.Add(new SqlParameter("@CODE", empcode));
                sqlSelectFindKnowledge.Parameters.Add(new SqlParameter("@LEVEL", level));
                sqlSelectFindKnowledge.Parameters.Add(new SqlParameter("@CC", item.Value[1]));

                DataTable dtgelKL = oCOnnDCI.Query(sqlSelectFindKnowledge);
                if (dtgelKL.Rows.Count > 0)
                {
                    List<Knowledge> knowledges1 = new List<Knowledge>();

                    foreach (DataRow dr in dtgelKL.Rows)
                    {

                        Knowledge knowledge = new Knowledge();
                        knowledge.kl_name = dr["CourseName"].ToString();
                        knowledge.kl_status = dr["Status"].ToString();
                        knowledges1.Add(knowledge);


                    }


                    coreCompentency.cc_knowledge = knowledges1;
                }


                // column 4

                SqlCommand sqlSelectFindSkill = new SqlCommand();

                sqlSelectFindSkill.CommandText = @"
                                   SELECT [CC_SKILL]
                                    FROM [dbDCI].[dbo].[TR_KPI]
                                    where CC_NO = @CC and CC_LEVEL = @LEVEL ";

                sqlSelectFindSkill.Parameters.Add(new SqlParameter("@LEVEL", level));
                sqlSelectFindSkill.Parameters.Add(new SqlParameter("@CC", item.Key));

                DataTable dtgelSK = oCOnnDCI.Query(sqlSelectFindSkill);
                if (dtgelSK.Rows.Count > 0)
                {

                    string[] skills = new string[dtgelSK.Rows.Count];
                    foreach (DataRow dr in dtgelSK.Rows)
                    {


                        skills[i] = dr["CC_SKILL"].ToString();
                        coreCompentency.cc_skill = skills;

                        i++;
                    }



                }

                assessmentList.Add(coreCompentency);

            }



            return Ok(assessmentList);

        }
        [NonAction]
        public DataTable findSkillByEmployee(string empcode, string level)
        {

            SqlCommand sqlSelectSkill = new SqlCommand();
            sqlSelectSkill.CommandText = @"  SELECT cc.CoreNameEN,course.COURSE_NAME  as CourseName
                                        ,CASE WHEN (SELECT COUNT(*) CNT FROM [dbDCI].[dbo].[TR_Trainee_Data] S WHERE S.COURSE_CODE = cct.COURSE_CODE AND S.EVALUATE_RESULT = 'P' AND S.EMPCODE = '
210'  ) > 0 THEN 'PASS' ELSE 'FAIL' END [Status]
                                    
                                    FROM [dbDCI].[dbo].[TR_CoreCompetency] cc
                                    LEFT JOIN [dbDCI].[dbo].[TR_CoreCompetencyDet] cct on cct.CoreCode = cc.CoreCode
                                    LEFT JOIN [dbDCI].[dbo].[TR_COURSE] course on course.COURSE_CODE = cct.COURSE_CODE
                                    INNER JOIN  [dbDCI].[dbo].[Employee] e ON e.POSIT = cc.CorePosit and e.CODE = @CODE
                                    WHERE CoreLevel = @LEVEL ";

            sqlSelectSkill.Parameters.Add(new SqlParameter("@LEVEL", level));
            sqlSelectSkill.Parameters.Add(new SqlParameter("@CODE", empcode));

            DataTable dtgetCC = oCOnnDCI.Query(sqlSelectSkill);

            return dtgetCC;
        }




        [HttpPost]
        [Route("saveIndicatorCompentenctSubDev")]

        public IActionResult saveIndicatorCompentenctSubDev(List<IndicatorSubRecordDev> sub)
        {

            SqlCommand sqlIndicator_detail_select = new SqlCommand();

            sqlIndicator_detail_select.CommandText = @"SELECT  [CC_REV],[CC_EmpCode]
                                                  FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV]

                                                  WHERE CC_REV = @CC_REV  AND CC_EmpCode = @EMPCODE";

            sqlIndicator_detail_select.Parameters.Add(new SqlParameter("@CC_REV", sub.FirstOrDefault().CD_Rev));
            sqlIndicator_detail_select.Parameters.Add(new SqlParameter("@EmpCode", sub.FirstOrDefault().CD_EmpCode));

            DataTable dtIndicator_detail = oCOnnDCI.Query(sqlIndicator_detail_select);

            if (dtIndicator_detail.Rows.Count > 0)
            {


                foreach (IndicatorSubRecordDev item in sub)
                {
                    SqlCommand sqlIndicator_detail_update = new SqlCommand();

                    sqlIndicator_detail_update.CommandText = @" UPDATE [dbDCI].[dbo].[TR_CompetenctAssessmentDetail_Dev]
                                                         SET CD_Comment = @COMMENT 
                                                         WHERE CD_Rev = @CD_Rev AND CD_EmpCode = @CD_EmpCode AND CD_CCName = @CD_CCName ";

                    sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@CD_REV", item.CD_Rev));
                    sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@CD_EmpCode", item.CD_EmpCode.Trim()));
                    sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@CD_CCName", item.CD_Name));
                    sqlIndicator_detail_update.Parameters.Add(new SqlParameter("@COMMENT", item.CD_Comment));


                    oCOnnDCI.ExecuteCommand(sqlIndicator_detail_update);

                }
                return Ok((new { statusConfirm = false }));

            }
            else
            {

                foreach (IndicatorSubRecordDev item in sub)
                {

                    SqlCommand sqlIndicator_detail_insert = new SqlCommand();

                    sqlIndicator_detail_insert.CommandText = @" INSERT INTO [dbDCI].[dbo].[TR_CompetenctAssessmentDetail_Dev] 
                                                     ([CD_Rev],[CD_CCName],[CD_EmpCode],[CD_ExpectedScore],[CD_ActualScore],[CD_Gap],CD_Comment,CD_Assessor,CD_CreateDate)
                                                     VALUES (@CD_REV,@CDName,@EmpCode,@ExpectScore,@ActualScore,@Gap, @COMMENT, @CREATEBY,GETDATE());";

                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@CD_REV", item.CD_Rev));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@EmpCode", item.CD_EmpCode.Trim()));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@CDName", item.CD_Name));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@ExpectScore", item.CD_ExpectedScore));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@ActualScore", item.CD_ActualScore));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@Gap", item.CD_Gap));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@COMMENT", item.CD_Comment));
                    sqlIndicator_detail_insert.Parameters.Add(new SqlParameter("@CREATEBY", item.CD_Assessor));
                    oCOnnDCI.ExecuteCommand(sqlIndicator_detail_insert);
                }
                return Ok((new { statusConfirm = true }));

            }




        }



        [HttpPost]
        [Route("saveIndicatorCompentenctMainDev")]

        public IActionResult saveIndicatorCompentenctMainDev(IndicatorMainRecordDev main)
        {
            SqlCommand sqlIndicator_check_rev = new SqlCommand();

            sqlIndicator_check_rev.CommandText = @"SELECT  [CODE]
                                                      FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                                      where GETDATE() BETWEEN ST_DATE and EN_DATE and STATUS != 0";
            DataTable dtCheckREV = oCOnnDCI.Query(sqlIndicator_check_rev);

            if (dtCheckREV.Rows.Count > 0)
            {
                // เพิ่มข้อมูล

                foreach (DataRow drCheckREV in dtCheckREV.Rows)
                {
                    SqlCommand sqlIndicator_main_insert = new SqlCommand();

                    sqlIndicator_main_insert.CommandText = @"INSERT INTO [dbDCI].[dbo].[TR_CompetenctAssessment_Dev] 
                                                     ([CC_REV],[CC_EmpCode],[CC_CoreLevel],[CC_EvaluteStatus],[CC_EvaluteBy],[CC_EvaluteDate],[CC_ApproveStatus],[CC_ApproveBy],
                                                            [CC_ApproveDate],[CC_CreateDate],[CC_CreateBy])
                                                     VALUES (@CC_REV,@CC_EmpCode, @CC_CoreLevel, @CC_EvaluteStatus, @CC_EvaluteBy,GETDATE(),null,null,GETDATE(),GETDATE(),@CC_CreateBy);";

                    sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CC_REV", drCheckREV["CODE"].ToString().Trim()));
                    sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CC_EmpCode", main.CC_EmpCode.Trim()));
                    sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CC_CoreLevel", main.CC_CoreLevel));
                    sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CC_EvaluteStatus", main.CC_EvaluteStatus));
                    sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CC_EvaluteBy", main.CC_EvaluteBy));
                    sqlIndicator_main_insert.Parameters.Add(new SqlParameter("@CC_CreateBy", main.CC_EvaluteBy));
                    oCOnnDCI.ExecuteCommand(sqlIndicator_main_insert);


                }

                return Ok((new { statusConfirm = true }));

            }
            else
            {
                return Ok((new { statusConfirm = false }));

            }

        }



        [HttpGet]
        [Route("getREVAssessment")]
        public IActionResult getREVAssessment()
        {
            string code = "";
            Int64 timerCountDown = 0;
            DateTime endDate = DateTime.Now;
            SqlCommand sqlGetRevAssessment = new SqlCommand();

            sqlGetRevAssessment.CommandText = @"SELECT  [CODE] , DATEDIFF_BIG(MILLISECOND, GETDATE(), [EN_DATE]) AS DateDiff ,EN_DATE
                                                      FROM [dbDCI].[dbo].[TR_CompentencyREV]
                                                      where GETDATE() BETWEEN ST_DATE and EN_DATE and STATUS != 0";

            DataTable dtgetREV = oCOnnDCI.Query(sqlGetRevAssessment);
            foreach (DataRow dr in dtgetREV.Rows)
            {
                 code = dr["CODE"].ToString();
                 timerCountDown = Convert.ToInt64(dr["DateDiff"]);
                 endDate = Convert.ToDateTime(dr["EN_DATE"]);
            }

            return Ok(new { code = code , timerCountDown = timerCountDown , endDate = endDate });
        }



        [HttpGet]
        [Route("checkEmployeeContinuousEvaluted/{empcode}/{level}/{section}/{group}")]
        public IActionResult checkEmployeeContinuousEvaluted(string empcode, int level, string section, string group)
        {
            string evaluteContinousEmpcode = "";
            string evaluteContinousStatus = "";
            int countEmployee = 0;
            int empCountAssessment = 0;

            string posittion = "";


            if (level == 1)
            {
                posittion = "'OP','LE','LE.S','OP.S'";


            }
            else if (level == 2)
            {
                posittion = "'FO','TE','TE.S','SF','TR'";
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
                posittion = "'MG','AMG','AM'";
                group = section;

            }


            SqlCommand sqlSelect = new SqlCommand();
            List<Employee> Employee_list = new List<Employee>();

            sqlSelect.CommandText = @"SELECT TOP(1) emp.CODE,
                                        CASE
                                        WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Pending')) > 0 THEN 1
            	WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Confirm','Approve') and SUBSTRING([CC_REV],0,5) = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 2
            	ELSE 0
                                       END as STATUS
                                       ,ISNULL(cta.[CC_EvaluteStatus],'NONE') as STATUS_2 
                                         
                                        
                                        
									   	,(SELECT count(emp.CODE) empCount
                                      
                                       FROM [dbDCI].[dbo].[Employee] emp
                                       LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
                                       LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
            LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT and DICT_STATUS = 'ACTIVE'
                                       WHERE  POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01' 
                                        and  (CASE
											WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Pending')) > 0 THEN 1
            								WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Confirm','Approve') and SUBSTRING([CC_REV],0,5) = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 2
            								ELSE 0
                                       END) >= 1) empCountAssessment








                                           ,(SELECT count(emp.CODE) empCount
                                      
                                       FROM [dbDCI].[dbo].[Employee] emp
                                       LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
                                       LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
            LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT and DICT_STATUS = 'ACTIVE'
                                       WHERE POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01' 
                                     ) empCount 





                                       FROM [dbDCI].[dbo].[Employee] emp
                                       LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
                                       LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
            LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT and DICT_STATUS = 'ACTIVE'
                                       WHERE POSIT IN (" + posittion + @") and DVCD = @DVCD AND RESIGN = '1900-01-01' 
                                        and  (CASE
											WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Pending')) > 0 THEN 1
            								WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Confirm','Approve') and SUBSTRING([CC_REV],0,5) = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 2
            								ELSE 0
                                       END) = 0
                                       order by [P_GRADE] desc";
            sqlSelect.Parameters.Add(new SqlParameter("@DVCD", group));

            //   sqlSelect.CommandText = @"SELECT emp.CODE,NAME + ' ' + SURN as NAME, POSIT ,[P_GRADE],NOTE as FPOSIT ,
            //                            CASE
            //                            WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Pending')) > 0 THEN 0
            //	WHEN (SELECT COUNT([CC_EmpCode]) FROM [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] WHERE [CC_EmpCode] = emp.CODE AND [CC_EvaluteStatus] IN ('Confirm','Approve') and SUBSTRING([CC_REV],0,5) = CAST(Year(GETDATE()) AS nvarchar)) > 0 THEN 1
            //	ELSE 0
            //                           END as STATUS
            //                           ,ISNULL(cta.[CC_EvaluteStatus],'NONE') as STATUS_2 , emp.[JOIN]
            //                           FROM [dbDCI].[dbo].[Employee] emp
            //                           LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
            //                           LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
            //LEFT JOIN DictMstr dict on dict.REF_2 = emp.POSIT and DICT_STATUS = 'ACTIVE'
            //                           WHERE POSIT IN (" + posittion + @") and DVCD IN (SELECT DV_CD FROM TR_CompentencyApproveFlow where EvalulateBy =  @EMPCODE)  AND RESIGN = '1900-01-01'
            //                           order by [P_GRADE] desc";

            //   sqlSelect.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

            DataTable dtSection = oCOnnDCI.Query(sqlSelect);

            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drow in dtSection.Rows)
                {

                    evaluteContinousEmpcode = drow["CODE"].ToString();
                    evaluteContinousStatus = drow["STATUS_2"].ToString();
                    countEmployee = Convert.ToInt16(drow["empCount"]);
                    empCountAssessment = Convert.ToInt16(drow["empCountAssessment"]);



                }

            }

            return Ok(new { evaluteContinousEmpcode = evaluteContinousEmpcode, 
                evaluteContinousStatus = evaluteContinousStatus, 
                countEmployee = countEmployee,
                empCountAssessment = empCountAssessment
            });
        }




        [HttpPost]
        [Route("getCompentencyCourseByEmployee")]
        public IActionResult getCompentencyAssessmentForm(CourseCoreCompentencyByEmployee coreEmployeeCode)
        {



            int level = 0;



            SqlCommand sqlSelectCoreEmployee = new SqlCommand();

            sqlSelectCoreEmployee.CommandText = @"
                                                 SELECT TOP(1) [CoreLevel]
                                                  FROM [dbDCI].[dbo].[TR_CoreCompetency]
                                                  INNER JOIN Employee emp on emp.POSIT = CorePosit
                                                  where emp.CODE = @CODE and RESIGN = '1900-01-01'";

            sqlSelectCoreEmployee.Parameters.Add(new SqlParameter("@CODE", coreEmployeeCode.empcode));
          

            DataTable dtsqlSelectCoreEmployee = oCOnnDCI.Query(sqlSelectCoreEmployee);
            if (dtsqlSelectCoreEmployee.Rows.Count > 0)
            {

                foreach (DataRow dr in dtsqlSelectCoreEmployee.Rows)
                {

                    level = Convert.ToInt16(dr["CoreLevel"]);


                }
            }
            else
            {
                return NotFound();
            }








            Dictionary<string, string[]> cc = new Dictionary<string, string[]>()

            {
                { "CC001", new string[] { "จิตสำนึกด้านความปลอดภัย (Safety Awareness)", "SAFETY AND ENVIRONMENT AWARENESS" } },
                { "CC002", new string[] { "ความสามารถในการปรับตัว (Professional Adaptabillity)", "PROFESSIONAL ADAPTABILITY" } },
                { "CC003", new string[] { "การผลิตแบบไดกิ้นที่เป็นเลิศ (Excellent PDS)", "EXCELLENT PDS" } },
                { "CC004", new string[] { "จิตสำนึกด้านคุณภาพที่เป็นเลิศ (Excellent Quality Awareness)","EXCELLENT QUALITY AWARENESS"} },
                { "CC005", new string[] { "การพัฒนาอย่างต่อเนื่อง (Development)", "DEVELOPMENT" } }

            };

            List<CoreCompentency> assessmentList = new List<CoreCompentency>();


            foreach (var item in cc)
            {

                // column 1

                int i = 0;

                CoreCompentency coreCompentency = new CoreCompentency();
                coreCompentency.cc_name = item.Key;
                coreCompentency.cc_desc = item.Value[0];


                List<Knowledge> knowledges = new List<Knowledge>();


                // column 2

                SqlCommand sqlSelectMainIndicator = new SqlCommand();

                sqlSelectMainIndicator.CommandText = @"SELECT  [Indicator_Level]
                                                      ,[Indicator_CC]
                                                      ,[Indicator_Main]
                                                      FROM [dbDCI].[dbo].[TR_Indicator_Main]
                                                      where Indicator_CC = @CC and Indicator_Level = @LEVEL";

                sqlSelectMainIndicator.Parameters.Add(new SqlParameter("@LEVEL", level));
                sqlSelectMainIndicator.Parameters.Add(new SqlParameter("@CC", item.Key));

                DataTable dtgetCC = oCOnnDCI.Query(sqlSelectMainIndicator);
                if (dtgetCC.Rows.Count > 0)
                {

                    foreach (DataRow dr in dtgetCC.Rows)
                    {
                        coreCompentency.cc_title = dr["Indicator_Main"].ToString();

                        List<SubBehavior> behavior_list = new List<SubBehavior>();


                        SqlCommand sqlSelectSubIndicator = new SqlCommand();
                        sqlSelectSubIndicator.CommandText = @"SELECT [Indicator_Level],[Indicator_CC],[Indicator_Category]
                                                                FROM [dbDCI].[dbo].[TR_Indicator]
                                                             where Indicator_Level = @LEVEL and Indicator_CC = @CC";

                        sqlSelectSubIndicator.Parameters.Add(new SqlParameter("@LEVEL", level));
                        sqlSelectSubIndicator.Parameters.Add(new SqlParameter("@CC", item.Key));
                        DataTable dtgetSubBB = oCOnnDCI.Query(sqlSelectSubIndicator);

                        if (dtgetSubBB.Rows.Count > 0)
                        {
                            foreach (DataRow drSub in dtgetSubBB.Rows)
                            {
                                SubBehavior subBehavior = new SubBehavior();
                                subBehavior.sub_name = drSub["Indicator_Category"].ToString();
                                behavior_list.Add(subBehavior);
                            }
                        }

                        coreCompentency.cc_Behavior = behavior_list;

                    }


                }


                // column 3



                SqlCommand sqlSelectFindKnowledge = new SqlCommand();

                sqlSelectFindKnowledge.CommandText = @"
                                    SELECT cc.CoreNameEN,course.COURSE_NAME  as CourseName
                                        ,CASE WHEN (SELECT COUNT(*) CNT FROM [dbDCI].[dbo].[TR_Trainee_Data] S WHERE S.COURSE_CODE = cct.COURSE_CODE AND S.EVALUATE_RESULT = 'P' AND S.EMPCODE = @CODE  ) > 0 THEN 'PASS' ELSE 'FAIL' END [Status]
                                    
                                    FROM [dbDCI].[dbo].[TR_CoreCompetency] cc
                                    LEFT JOIN [dbDCI].[dbo].[TR_CoreCompetencyDet] cct on cct.CoreCode = cc.CoreCode
                                    LEFT JOIN [dbDCI].[dbo].[TR_COURSE] course on course.COURSE_CODE = cct.COURSE_CODE
                                    INNER JOIN  [dbDCI].[dbo].[Employee] e ON e.POSIT = cc.CorePosit and e.CODE = @CODE
                                    WHERE CoreLevel = @LEVEL and CoreNameEN = @CC";

                sqlSelectFindKnowledge.Parameters.Add(new SqlParameter("@CODE", coreEmployeeCode.empcode));
                sqlSelectFindKnowledge.Parameters.Add(new SqlParameter("@LEVEL", level));
                sqlSelectFindKnowledge.Parameters.Add(new SqlParameter("@CC", item.Value[1]));

                DataTable dtgelKL = oCOnnDCI.Query(sqlSelectFindKnowledge);
                if (dtgelKL.Rows.Count > 0)
                {
                    List<Knowledge> knowledges1 = new List<Knowledge>();

                    foreach (DataRow dr in dtgelKL.Rows)
                    {

                        Knowledge knowledge = new Knowledge();
                        knowledge.kl_name = dr["CourseName"].ToString();
                        knowledge.kl_status = dr["Status"].ToString();
                        knowledges1.Add(knowledge);


                    }


                    coreCompentency.cc_knowledge = knowledges1;
                }


                // column 4

                SqlCommand sqlSelectFindSkill = new SqlCommand();

                sqlSelectFindSkill.CommandText = @"
                                   SELECT [CC_SKILL]
                                    FROM [dbDCI].[dbo].[TR_KPI]
                                    where CC_NO = @CC and CC_LEVEL = @LEVEL ";

                sqlSelectFindSkill.Parameters.Add(new SqlParameter("@LEVEL", level));
                sqlSelectFindSkill.Parameters.Add(new SqlParameter("@CC", item.Key));

                DataTable dtgelSK = oCOnnDCI.Query(sqlSelectFindSkill);
                if (dtgelSK.Rows.Count > 0)
                {

                    string[] skills = new string[dtgelSK.Rows.Count];
                    foreach (DataRow dr in dtgelSK.Rows)
                    {


                        skills[i] = dr["CC_SKILL"].ToString();
                        coreCompentency.cc_skill = skills;

                        i++;
                    }



                }

                assessmentList.Add(coreCompentency);

            }



            return Ok(assessmentList);

        }

    }   

}



    



