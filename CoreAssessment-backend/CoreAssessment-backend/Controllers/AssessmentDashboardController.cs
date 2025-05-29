using CoreAssessment_backend.Model.DashboardBarCharts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Data;
using System.Net.NetworkInformation;

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
                                                               HAVING Indicator_Level = " + (i + 1) + " order by [Indicator_CC]\r\n";


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
                                                  HAVING Indicator_Level = " + (i + 1) + @" and indicator.Indicator_CourseName = @Indicator_CourseName
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
                                    subDashboardModel.Score = Math.Round(percent_total, 2);

                                    result_score.Add(subDashboardModel);
                                }

                            }
                            else
                            {
                                SubDashboardBarChart subDashboardModel = new SubDashboardBarChart();
                                percent_total = 0;
                                subDashboardModel.Score = percent_total;
                                subDashboardModel.CourseCode = courseCode[j].Substring(0, 6);

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

            catch (Exception ex)
            {
            }
            return Ok(resut_dashboard);

        }


        [HttpGet]
        [Route("getGadgetCardDashboard/{code}")]

        public IActionResult getGadgetCardDashboard(string code)
        {
            string dvcd = "";



            SqlCommand sqlGetDvcdByCode = new SqlCommand();
            sqlGetDvcdByCode.CommandText = @" SELECT  distinct flow.DV_CD 
                                                       FROM TR_CompentencyApproveFlow flow

                                                       where EvalulateBy = @CODE";

            sqlGetDvcdByCode.Parameters.Add(new SqlParameter("@CODE", code));

            DataTable dtTotalScore = oCOnnDCI.Query(sqlGetDvcdByCode);

            if (dtTotalScore.Rows.Count > 0)
            {
                foreach (DataRow drow in dtTotalScore.Rows)
                {


                    dvcd += "'" + drow["DV_CD"] + "',";


                }
            }
            dvcd = dvcd.Substring(0, dvcd.Length - 1);



            int j = 0;
            string[] dvcd_ename = new string[dtTotalScore.Rows.Count];
            int[] count_emp = new int[dtTotalScore.Rows.Count];

            SqlCommand sqlGetDonut = new SqlCommand();
            sqlGetDonut.CommandText = @" 

                  SELECT  dvcd.[DV_ENAME] , COUNT(emp.CODE) EMP FROM Employee emp
                  LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd on emp.DVCD = dvcd.DV_CD
                  WHERE GRP_CD IN (" + dvcd + @")  and RESIGN = '1900-01-01'
                  GROUP BY  dvcd.[DV_ENAME]";

            DataTable dtGetDonut = oCOnnDCI.Query(sqlGetDonut);

            if (dtGetDonut.Rows.Count > 0)
            {
                foreach (DataRow drow in dtGetDonut.Rows)
                {

                    dvcd_ename[j] = drow["DV_ENAME"].ToString();
                    count_emp[j] = Convert.ToInt16(drow["EMP"]);

                    j++;


                }

            }
            return Ok(new
            {
                doughut_dvcdName = dvcd_ename,
                doughut_dvcdCountEmp = count_emp
            });

        }



        [HttpGet]
        [Route("getDashboardBarChart/{empcode}")]
        public IActionResult getDashboardBarChart(string empcode)
        {



            int i = 0;

            List<DVCD> dVCDs = new List<DVCD>();

            SqlCommand sqlSelect_dvcd = new SqlCommand();
            sqlSelect_dvcd.CommandText = @" SELECT DV_CD,[Group]
                                             FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]
                                             where (EvalulateBy = @EMPCODE OR ApproveBy = @EMPCODE) AND DV_CD != '1130' 
											 GROUP BY DV_CD,[Group]";

            sqlSelect_dvcd.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

            sqlSelect_dvcd.CommandTimeout = 180;
            DataTable dtEmpCoreLv = oCOnnDCI.Query(sqlSelect_dvcd);
            if (dtEmpCoreLv.Rows.Count > 0)
            {

                foreach (DataRow dc in dtEmpCoreLv.Rows)
                {
                    DVCD dVCD = new DVCD();
                    dVCD.dvcd = dc["DV_CD"].ToString();
                    dVCD.dvname = dc["Group"].ToString();

                    dVCDs.Add(dVCD);
                }
            }

            //dVCDs.Add(new DVCD { dvcd = "1410", dvname = "cost Budget" });

            List<MainDashBoardChart> _MainDashboardList = new List<MainDashBoardChart>();

            foreach (DVCD group in dVCDs)
            {

                int coreLevel;
                string[] cc = new string[3];


                MainDashBoardChart mainDashBoardChart = new MainDashBoardChart();
                mainDashBoardChart.Dvcd = group.dvcd;
                mainDashBoardChart.Dvcd_name = group.dvname;


                // 2) หาว่ามีพนักงานในแผนก(DVCD) มี level อะไรได้บ้าง

                List<CountEmployeeStatus> employeeStatuses = new List<CountEmployeeStatus>();

                SqlCommand sqlSelect_Level = new SqlCommand();
                sqlSelect_Level.CommandText = @" SELECT distinct [CoreLevel]
                                             FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow]
                                             WHERE DV_CD = @DVCD and (EvalulateBy = @EMPCODE or ApproveBy = @EMPCODE)";

                sqlSelect_Level.Parameters.Add(new SqlParameter("@DVCD", group.dvcd));
                sqlSelect_Level.Parameters.Add(new SqlParameter("@EMPCODE", empcode));

                sqlSelect_Level.CommandTimeout = 180;
                DataTable dtCoreLevel = oCOnnDCI.Query(sqlSelect_Level);
                if (dtCoreLevel.Rows.Count > 0)
                {
                    foreach (DataRow level in dtCoreLevel.Rows)
                    {

                        coreLevel = int.Parse(level["CoreLevel"].ToString());


                        // 3) เอา level ไปหา position ของพนักงาน

                        CountEmployeeStatus countEmployeeStatus = new CountEmployeeStatus();


                        int[] totalEmployeeInGroup = new int[5];
                        int[] totalEmployeePass = new int[5];
                        SqlCommand sqlSelect_position = new SqlCommand();
                        sqlSelect_position.CommandText = @" SELECT distinct  [CorePosit]
                                                                FROM [dbDCI].[dbo].[TR_CoreCompetency]
                                                                where CoreLevel = @LEVEL";

                        sqlSelect_position.Parameters.Add(new SqlParameter("@LEVEL", coreLevel));

                        sqlSelect_position.CommandTimeout = 180;
                        DataTable dtPositon = oCOnnDCI.Query(sqlSelect_position);
                        if (dtPositon.Rows.Count > 0)
                        {
                            string position = "";

                            foreach (DataRow drPosition in dtPositon.Rows)
                            {
                                position += "'" + drPosition["CorePosit"].ToString() + "',";

                            }

                            position = position.Substring(0, position.Length - 1);

                            // 4) เอา level ไปหา position ของจำนวนพนักงานทั้งหมด

                            // 4.1 หาพนักงานทั้งหมด 

                            int countTotalemp = 0;
                            int countEmployeePass = 0;
                            SqlCommand sqlSelect_corecompentency = new SqlCommand();
                            sqlSelect_corecompentency.CommandText = @" SELECT [Indicator_CC],[Indicator_CourseName]
                                                                              FROM [dbDCI].[dbo].[TR_Indicator]
                                                                              where Indicator_Level = @LEVEL
                                                                              GROUP BY Indicator_CC , Indicator_CourseName ";

                            sqlSelect_corecompentency.Parameters.Add(new SqlParameter("@LEVEL", coreLevel));

                            DataTable dtcoreCompentency = oCOnnDCI.Query(sqlSelect_corecompentency);

                            Array.Resize(ref cc, dtcoreCompentency.Rows.Count);

                            if (dtcoreCompentency.Rows.Count > 0)
                            {



                                foreach (DataRow dtCC in dtcoreCompentency.Rows)
                                {
                                    int _tempCountPass = 0;
                                    //cc[countEmployeePass] = dtCC["Indicator_CC"].ToString() + " " + dtCC["Indicator_CourseName"].ToString();
                                    cc[countEmployeePass] = dtCC["Indicator_CourseName"].ToString();




                                    SqlCommand sqlSelect_employeeBypositionAndLevel = new SqlCommand();
                                    sqlSelect_employeeBypositionAndLevel.CommandText = @" SELECT CODE 
                                    FROM [dbDCI].[dbo].[Employee] emp
                                    LEFT JOIN [192.168.226.86].[dbBCS].[dbo].[POSIT_Mstr] posit on posit.[Posit_Id] = emp.POSIT
                                    LEFT JOIN [dbDCI].[dbo].[TR_CompetenctAssessment_DEV] cta on cta.[CC_EmpCode] = emp.CODE
                                    WHERE POSIT IN (" + position + @") and DVCD = @DVCD AND RESIGN = '1900-01-01' ";

                                    sqlSelect_employeeBypositionAndLevel.Parameters.Add(new SqlParameter("@DVCD", group.dvcd));

                                    DataTable dtempPostionLevel = oCOnnDCI.Query(sqlSelect_employeeBypositionAndLevel);
                                    if (dtempPostionLevel.Rows.Count > 0)
                                    {

                                        foreach (DataRow drCountEmployee in dtempPostionLevel.Rows)
                                        {

                                            Array.Resize(ref totalEmployeeInGroup, dtcoreCompentency.Rows.Count);
                                            Array.Resize(ref totalEmployeePass, dtcoreCompentency.Rows.Count);



                                            totalEmployeeInGroup[countTotalemp] = dtempPostionLevel.Rows.Count;





                                            SqlCommand sqlSelect_EmployeeScorePass = new SqlCommand();
                                            sqlSelect_EmployeeScorePass.CommandText = @" SELECT cc.CoreNameEN,cct.COURSE_CODE

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
                                                WHERE CoreLevel = @LEVEL  and CoreNameEN = @CORENAME ";

                                            sqlSelect_EmployeeScorePass.Parameters.Add(new SqlParameter("@LEVEL", coreLevel));
                                            sqlSelect_EmployeeScorePass.Parameters.Add(new SqlParameter("@EMPCODE", drCountEmployee["CODE"]));
                                            sqlSelect_EmployeeScorePass.Parameters.Add(new SqlParameter("@CORENAME", dtCC["Indicator_CourseName"]));



                                            DataTable dtcoreEmployeeScorePass = oCOnnDCI.Query(sqlSelect_EmployeeScorePass);

                                            string[] keepStatus = new string[dtcoreEmployeeScorePass.Rows.Count];

                                            int _tempKeepStatus = 0;

                                            if (dtcoreEmployeeScorePass.Rows.Count > 0)
                                            {
                                                foreach (DataRow dtStatusSroce in dtcoreEmployeeScorePass.Rows)
                                                {

                                                    keepStatus[_tempKeepStatus] = dtStatusSroce["Status"].ToString();


                                                    _tempKeepStatus++;
                                                }

                                            }

                                            if (keepStatus.Contains("FAIL"))
                                            {





                                            }
                                            else
                                            {
                                                _tempCountPass++;
                                                totalEmployeePass[countEmployeePass] = _tempCountPass;
                                            }

                                            //countTotalemp++;
                                        }


                                    }
                                    countEmployeePass++;
                                    countTotalemp++;

                                }

                            }



                        }
                        CountEmployeeStatus countEmployee = new CountEmployeeStatus();

                        countEmployee.level = coreLevel;
                        countEmployee.cc = cc;
                        countEmployee.totalEmployee = totalEmployeeInGroup;
                        countEmployee.totalEmployeePass = totalEmployeePass;
                        employeeStatuses.Add(countEmployee);


                    }

                    mainDashBoardChart.countEmployee = employeeStatuses;


                }

                _MainDashboardList.Add(mainDashBoardChart);

            }
            return Ok(_MainDashboardList);

        }




        [HttpPost]
        [Route("getDataDashboard")]
        public IActionResult getDashboard([FromBody] Payload_Dashboard payload)
        {
            string[] grp = { "SE", "SS", "ST", "SU" };
            string[] sect = { "MG", "AMG", "AM", "GM", "SGM", "AG" };


            string[] mg = { "MG", "AMG", "AM", "SE", "SS", "ST", "SU" };

            string sqlCol = "";
            string grp_cd = "";
            decimal countEmployeeInSection = 0;
            decimal countEmployeePendding = 0;
            decimal countEmployeeNotEaluted = 0;
            decimal countEmployeeEvaluted = 0;

            if (sect.Contains(payload.position))
            {


                SqlCommand findDeptName = new SqlCommand();

                findDeptName.CommandText = $@"SELECT distinct dvcd.SECT_CD FROM TR_CompentencyApproveFlow flow
                LEFT JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD and dvcd.DV_CD NOT IN ('1130','1140')
                where flow.Dept IN (SELECT distinct flow.Dept FROM TR_CompentencyApproveFlow flow
                LEFT JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD
                where (EvalulateBy = {payload.empcode} or ApproveBy = {payload.empcode})) and (EvalulateBy = {payload.empcode} or ApproveBy = {payload.empcode})
                UNION ALL
                SELECT distinct dvcd.GRP_CD FROM TR_CompentencyApproveFlow flow  LEFT JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD and dvcd.DV_CD NOT IN ('1130','1140')
					                where flow.Dept IN (SELECT distinct flow.Dept FROM TR_CompentencyApproveFlow flow
                LEFT JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD
                where (EvalulateBy = {payload.empcode} or ApproveBy = {payload.empcode})) and (EvalulateBy = {payload.empcode} or ApproveBy = {payload.empcode})
                order by SECT_CD";
                DataTable dtfindDeptName = oCOnnDCI.Query(findDeptName);

                if (dtfindDeptName.Rows.Count > 0)
                {
                    foreach (DataRow drowfindDeptName in dtfindDeptName.Rows)
                    {
                        grp_cd += "'" + drowfindDeptName["SECT_CD"] + "',";
                    }

                    grp_cd = grp_cd.Substring(0, grp_cd.Length - 1);
                }

            }
            else
            {
                grp_cd = payload.dvcd;
            }



            if (grp.Contains(payload.position))
            {
                sqlCol = "POSIT NOT IN ('TR','DR','GM','SGM','AG','AGM','PD','DI','TN','AV','AM','MG','AMG','SE', 'SS', 'ST', 'SU','EN','FO','TE','TE.S','SF')";

            }

            else if(mg.Contains(payload.position))
            {
                sqlCol = "POSIT NOT IN ('TR','DR','GM','SGM','AG','AGM','PD','DI','TN','AV','AM','MG','AMG')";
            }
         
            else
            {
                sqlCol = "POSIT NOT IN ('TR','DR','GM','SGM','AG','AGM','PD','DI','TN','AV')";

            }


            SqlCommand findCountEmp = new SqlCommand();

            findCountEmp.CommandText = $@" SELECT COUNT(CODE) countEmployeeInSection FROM Employee
                where {sqlCol} and DVCD IN (" + grp_cd + @") and RESIGN = '1900-01-01'";
            DataTable dtfindCountEmp = oCOnnDCI.Query(findCountEmp);

            if (dtfindCountEmp.Rows.Count > 0)
            {
                foreach (DataRow drowfindCountEmp in dtfindCountEmp.Rows)
                {
                    countEmployeeInSection = Convert.ToDecimal(drowfindCountEmp["countEmployeeInSection"]);
                }
            }



            SqlCommand findCountEmpNotEvalute = new SqlCommand();

            findCountEmpNotEvalute.CommandText = $@" SELECT COUNT(CODE) countEmployeePendding FROM TR_CompetenctAssessment_DEV
                INNER JOIN Employee emp on emp.CODE = CC_EmpCode and RESIGN = '1900-01-01'
                where  {sqlCol} and DVCD IN (" + grp_cd + @") and RESIGN = '1900-01-01' and 
                ((CC_EvaluteStatus = 'Confirm' or CC_EvaluteStatus = 'Pending') and CC_ApproveStatus ='Pending') and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE()) ";

            DataTable dtfindCountEmpNotEvalute = oCOnnDCI.Query(findCountEmpNotEvalute);

            if (dtfindCountEmpNotEvalute.Rows.Count > 0)
            {
                foreach (DataRow drowfindCountEmpNotEvalute in dtfindCountEmpNotEvalute.Rows)
                {
                    countEmployeePendding = Convert.ToDecimal(drowfindCountEmpNotEvalute["countEmployeePendding"]);
                }
            }




            SqlCommand findCountEmpConfirmApprove = new SqlCommand();

            findCountEmpConfirmApprove.CommandText = $@" SELECT COUNT(CODE) countEmployeeNotEaluted FROM Employee
                where {sqlCol} and RESIGN = '1900-01-01' and CODE NOT IN (SELECT CC_EmpCode FROM TR_CompetenctAssessment_DEV
                INNER JOIN Employee emp on emp.CODE = CC_EmpCode and RESIGN = '1900-01-01'
                where {sqlCol} and DVCD IN (" + grp_cd + @")  and CC_EvaluteStatus IN ('Confirm','Pending') and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE()) )  
               and DVCD IN (" + grp_cd + @") ";

            DataTable dtfindCountEmpConfirmApprove = oCOnnDCI.Query(findCountEmpConfirmApprove);

            if (dtfindCountEmpConfirmApprove.Rows.Count > 0)
            {
                foreach (DataRow drowfindCountEmpConfirmApprove in dtfindCountEmpConfirmApprove.Rows)
                {
                    countEmployeeNotEaluted = Convert.ToDecimal(drowfindCountEmpConfirmApprove["countEmployeeNotEaluted"]);
                }
            }






            // พนักงานที่การประเมินแล้ว

            SqlCommand findCountEmpEvaluted = new SqlCommand();

            findCountEmpEvaluted.CommandText = $@" SELECT COUNT(CC_EmpCode) countEmployeeEvaluted FROM TR_CompetenctAssessment_DEV
                INNER JOIN Employee emp on emp.CODE = CC_EmpCode and RESIGN = '1900-01-01'
                where {sqlCol} and DVCD IN (" + grp_cd + @") and 
                CC_EvaluteStatus = 'Confirm' and CC_ApproveStatus = 'Approve' and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE()) ";

            DataTable dtfindCountEmpEvaluted = oCOnnDCI.Query(findCountEmpEvaluted);

            if (dtfindCountEmpEvaluted.Rows.Count > 0)
            {
                foreach (DataRow drowfindCountEmpEvaluted in dtfindCountEmpEvaluted.Rows)
                {
                    countEmployeeEvaluted = Convert.ToDecimal(drowfindCountEmpEvaluted["countEmployeeEvaluted"]);
                }
            }




            // bar chart 

         


            int i = 0;
            int z = 0;
            //
            //
            // = จำนวนแผนกมี 41 แผนก
            string[] LabelCharts = new string[42];
            decimal[] data = new decimal[42];
            int[] countEmployeeIsLearing = new int[42];
            int[] countTotalEmployeeInSection = new int[42];


            if (mg.Contains(payload.position))
            {


                SqlCommand findTotalLabel = new SqlCommand();
                findTotalLabel.CommandText = $@" 
                                            SELECT distinct dvcd.GRP_CD,dvcd.DV_ENAME FROM TR_CompentencyApproveFlow flow
                                            LEFT JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD and dvcd.DV_CD NOT IN ('1130','1140')
                                            where flow.Dept IN (SELECT distinct flow.Dept FROM TR_CompentencyApproveFlow flow
                                            LEFT JOIN DVCD_Master dvcd on dvcd.GRP_CD = flow.DV_CD
                                            where (EvalulateBy = {payload.empcode} or ApproveBy = {payload.empcode})) and (EvalulateBy = {payload.empcode} or ApproveBy = {payload.empcode})";


                DataTable dtFindTotalLabel = oCOnnDCI.Query(findTotalLabel);

                Array.Resize(ref LabelCharts, dtFindTotalLabel.Rows.Count);
                Array.Resize(ref data, dtFindTotalLabel.Rows.Count);
                Array.Resize(ref countEmployeeIsLearing, dtFindTotalLabel.Rows.Count);
                Array.Resize(ref countTotalEmployeeInSection, dtFindTotalLabel.Rows.Count);



                if (dtFindTotalLabel.Rows.Count > 0)
                {
                    foreach (DataRow drowFindTotalLabel in dtFindTotalLabel.Rows)
                    {
                        try
                        {


                            LabelCharts[z] = drowFindTotalLabel["DV_ENAME"].ToString();
                            z++;




                            // หาจำนวนพนักงานทั้งหมดในแผนก
                            SqlCommand findPercentEmployeeLearningLoop4 = new SqlCommand();
                            findPercentEmployeeLearningLoop4.CommandText = $@"  
                                       SELECT 
                                      COUNT(CC_EmpCode) empIsEvaluted, 
                                     (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD = @SECT_CD and RESIGN = '1900-01-01' and {sqlCol})  totalEmployeeInSect ,
                                      CAST(CAST((COUNT(CC_EmpCode)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD = @SECT_CD  and RESIGN = '1900-01-01' and {sqlCol}) as decimal(10,2)) PercentEmployeeIsEvaluted

                                     FROM TR_CompetenctAssessment_DEV
                                     INNER JOIN Employee emp on emp.CODE = CC_EmpCode  and {sqlCol} and RESIGN = '1900-01-01' 
                                     where emp.DVCD = @SECT_CD and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE()) ";


                            findPercentEmployeeLearningLoop4.Parameters.Add(new SqlParameter("@SECT_CD", drowFindTotalLabel["GRP_CD"]));


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


                        catch (Exception ex)
                        {
                        }




                    }
                }
            }
            else
            {

                SqlCommand findGrpBySection = new SqlCommand();
                findGrpBySection.CommandText = @"  
                                                     SELECT SECT_CD, SECT , NOTE FROM DVCD_Master mas
                                                     INNER JOIN DictMstr dict on dict.REF_2 = SECT
                                                     INNER JOIN TR_CompentencyApproveFlow tr on tr.DV_CD = mas.DV_CD and (EvalulateBy = @EMPCODE or ApproveBy = @EMPCODE)
                                                     where  SECT !='' and DEPT_CD IN (" + payload.dvcd + @")
                                                     and SECT != 'DESIGN DEVELOPMENT'
                                                    GROUP BY SECT_CD,SECT, NOTE";

                findGrpBySection.Parameters.Add(new SqlParameter("@EMPCODE", payload.empcode));

                DataTable dtfindGrpBySection = oCOnnDCI.Query(findGrpBySection);
                //LabelCharts = new string[dtfindGrpBySection.Rows.Count];

                Array.Resize(ref LabelCharts, dtfindGrpBySection.Rows.Count);
                Array.Resize(ref data, dtfindGrpBySection.Rows.Count);
                Array.Resize(ref countEmployeeIsLearing, dtfindGrpBySection.Rows.Count);
                Array.Resize(ref countTotalEmployeeInSection, dtfindGrpBySection.Rows.Count);

                if (dtfindGrpBySection.Rows.Count > 0)
                {
                    foreach (DataRow drowFindGrpBySection in dtfindGrpBySection.Rows)
                    {

                        LabelCharts[z] = drowFindGrpBySection["NOTE"].ToString();
                        z++;

                        SqlCommand findGroupLoop3 = new SqlCommand();
                        findGroupLoop3.CommandText = @"                                               
                                                 select z.SECT_CD FROM (SELECT SECT_CD FROM DVCD_Master
                                                 where SECT_CD = @SECTCD

                                                  UNION ALL 

                                                 SELECT DV_CD FROM DVCD_Master
                                                 where SECT_CD = @SECTCD
                                                 ) as z

                                                Group By Z.SECT_CD";

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
                                     (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and RESIGN = '1900-01-01' and POSIT NOT IN ('TR','DR','GM','SGM','AG','AGM','PD','DI','TN','AV'))  totalEmployeeInSect ,
                                      CAST(CAST((COUNT(CC_EmpCode)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @")  and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV')) as decimal(10,2)) PercentEmployeeIsEvaluted

                                     FROM TR_CompetenctAssessment_DEV
                                     INNER JOIN Employee emp on emp.CODE = CC_EmpCode  and POSIT NOT IN ('TR','DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and RESIGN = '1900-01-01' 
                                     where emp.DVCD IN (" + sect_cd + @")  and SUBSTRING(CC_REV,0,5) = YEAR(GETDATE())";

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



            // Donut chart
            string[] coreLevel = new string[5];
            int[] totalEmp = new int[5];
            int k = 0;
            try
            {

                SqlCommand query_empNotEvaluted = new SqlCommand();
                query_empNotEvaluted.CommandText = $@"  SELECT  [CoreLevel] , COUNT([CODE]) totalEmp
                                                       FROM [dbDCI].[dbo].[vi_TR_CompentencyAssessment_CoreLevel]
                                                       where {sqlCol} and DVCD IN (" + grp_cd + @")
                                                       GROUP BY [CoreLevel]";


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

            // Pie chart
            //string[] coreLevel_pie = new string[5];
            //int[] totalEmp_pie = new int[5];
            //int k_pie = 0;
            //try
            //{

            //    SqlCommand query_pieChart = new SqlCommand();
            //    query_pieChart.CommandText = $@"  
            //                                          SELECT [CoreLevel],COUNT([CC_EmpCode]) totalEmp    
            //                                           FROM [dbDCI].[dbo].[vi_TR_CompentencyAssessment_Count_EmployeeEvaluted_CoreLevel]
            //                                           where {sqlCol} and DVCD IN (" + grp_cd + @")
            //                                           GROUP BY [CoreLevel]";


            //    DataTable dtquery_pieChart= oCOnnDCI.Query(query_pieChart);
            //    Array.Resize(ref coreLevel_pie, dtquery_pieChart.Rows.Count);
            //    Array.Resize(ref totalEmp_pie, dtquery_pieChart.Rows.Count);


            //    if (dtquery_pieChart.Rows.Count > 0)
            //    {
            //        foreach (DataRow drow in dtquery_pieChart.Rows)
            //        {
            //            coreLevel_pie[k_pie] = "LEVEL " + Convert.ToInt32(drow["CoreLevel"]).ToString();
            //            totalEmp_pie[k_pie] = Convert.ToInt32(drow["totalEmp"]);


            //            k_pie++;
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
                //coreLevel_pie = coreLevel_pie,
                //totalEmp_pie = totalEmp_pie,
                coreLevel_donut = coreLevel,
                totalEmp_donut = totalEmp,
                count_empInSection = countEmployeeInSection,
                count_empWaitConfirmPending = countEmployeePendding,
                count_empApprove = countEmployeeNotEaluted,
                count_empNotEvaluted = countEmployeeEvaluted


            });
        }
    }

}


