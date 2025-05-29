using CoreAssessment_backend.Model.Admin;
using CoreAssessment_backend.Model.ComplianceTrainingRecord;
using CoreAssessment_backend.Model.DashboardBarCharts;
using CoreAssessment_backend.Model.Elearning;
using CoreAssessment_backend.Model.TIS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Data.SqlClient;
using System;
using System.Data;
using System.Drawing;
using static CoreAssessment_backend.Model.ComplianceTrainingRecord.ModalTrainingInfo;
using static CoreAssessment_backend.Model.Elearning.ElearningReport;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreAssessment_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElearningReportController : ControllerBase
    {

        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");



        [HttpGet]
        [Route("getChartSection1")]

        public IActionResult getChartSection1()
        {


            int total_employee = 0;




            string[] courseCode = {"CC001 Anti-Bribery",
                                   "CC002 Trade secret control",
                                   "CC003 PDPA",
                                   "CC004 Security export control",
                                   "CC005 Whistle blowing control",
                                   "CC006 Antitrust and competion"
            };



            Dictionary<string, string[]> cc = new Dictionary<string, string[]>()

            {
                { "CC001", new string[] {"Anti-Bribery","การป้องกันการให้สินบนแก่เจ้าหน้าที่รัฐ" } },
                { "CC002", new string[] { "Trade secret control", "การควบคุมความลับทางการค้า"}},
                { "CC003", new string[] { "PDPA","การคุ้มครองข้อมูลส่วนบุคคุล" }},
                { "CC004", new string[] { "Security export control", "ความปลอดภัยด้านการส่งออก" }},
                { "CC005", new string[] { "Whistle blowing control", "กระบวนการรับเรื่องร้องเรียน" } },
                { "CC006", new string[] { "Antitrust and competion", "การป้องกันการผูกขาดทางการค้า" } }


            };




            // solution = ( score_employee * 100 ) / ( total_employee * total_score )
            List<chartDisplaySection1> chartSection1 = new List<chartDisplaySection1>();
            List<chartDisplaySection2> chartSection2 = new List<chartDisplaySection2>();


            List<SubLabelChart> SublabelChartsList = new List<SubLabelChart>();
            LabelChart labelChart = new LabelChart();
            decimal[,] matrix = new decimal[12, 8];


            try
            {



                // total_full_score
                SqlCommand TotalEmployee = new SqlCommand();
                TotalEmployee.CommandText = @" select COUNT(CODE) totalEmployee FROM Employee emp
                                                                where POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and CODE NOT like 'I%'
                                                                and RESIGN = '1900-01-01'";


                DataTable dtTotalEmployee = oCOnnDCI.Query(TotalEmployee);

                if (dtTotalEmployee.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtTotalEmployee.Rows)
                    {

                        total_employee = Convert.ToInt32(drow["totalEmployee"]);


                    }



                    foreach (var item in cc)
                    {
                        SqlCommand findEmployeeIsLearingByCourse = new SqlCommand();
                        findEmployeeIsLearingByCourse.CommandText = @" select COUNT(distinct EMPCODE) as employeeIsLearing FROM [dbDCI].[dbo].[TR_Trainee_Data]
                                                                       inner join Employee emp on emp.CODE  = EMPCODE
                                                                       where TRIM(COURSE_CODE) = @CC  and emp.RESIGN = '1900-01-01' and  POSIT NOT IN                   
                                                                       ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and CODE NOT like 'I%'";

                        findEmployeeIsLearingByCourse.Parameters.Add(new SqlParameter("@CC", item.Key));

                        DataTable dtfindEmployeeIsLearingByCourse = oCOnnDCI.Query(findEmployeeIsLearingByCourse);

                        if (dtfindEmployeeIsLearingByCourse.Rows.Count > 0)
                        {
                            foreach (DataRow drow in dtfindEmployeeIsLearingByCourse.Rows)
                            {
                                chartDisplaySection1 chartDisplaySection1 = new chartDisplaySection1();

                                chartDisplaySection1.course_name = item.Key + " " + item.Value[0];
                                chartDisplaySection1.course_name_th = item.Value[1];
                                chartDisplaySection1.employeeIsLearing = Math.Round(Convert.ToDecimal(drow["employeeIsLearing"]),2); // จำนวนคน
                                chartDisplaySection1.employeeIsLearingPercent = Math.Round(((Convert.ToDecimal(drow["employeeIsLearing"]) * 100) / total_employee),2); // จำนวนคน (%)
                                chartDisplaySection1.totalEmployee = total_employee;
                                chartSection1.Add(chartDisplaySection1);

                            }
                        }



                    }

                    // section 2



                //    int j = 0;

                //    SqlCommand GroupCourse = new SqlCommand();
                //    GroupCourse.CommandText = @" SELECT distinct DEPT FROM DVCD_Master where DEPT != 'PRODUCTION CONTROL&SUPPLY CHAIN' and DEPT != '' ";

                //    GroupCourse.Parameters.Add(new SqlParameter("@CC", "CC001"));

                //    DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);
                //    string[] temp = new string[dtGroupCourse.Rows.Count];


                //    if (dtGroupCourse.Rows.Count > 0)
                //    {
                //        foreach (DataRow drow in dtGroupCourse.Rows)
                //        {

                //            temp[j] = drow["DEPT"].ToString();
                //            string group = "";

                //            if (temp[j] == "ADMINISTRATION")
                //            {
                //                group = "'1100','1200','1300','1400','1500','1600'";

                //            }
                //            else if (temp[j] == "CORPORATE COMPLIANCE")
                //            {
                //                group = "'8200'";
                //            }
                //            else if (temp[j] == "DESIGN DEVELOPMENT")
                //            {
                //                group = "'10100','10200','10300'";
                //            }
                //            else if (temp[j] == "ENGINEERING")
                //            {
                //                group = "'3100','3200','3300'";

                //            }
                //            else if (temp[j] == "MAINTENANCE")
                //            {
                //                group = "'13100','13300','13400'";

                //            }
                //            else if (temp[j] == "MANUFACTURING CONTROL")
                //            {
                //                group = "'11100','11200','11300','11400','11500','11600','11700','11800'";

                //            }
                //            else if (temp[j] == "PROCUREMENT")
                //            {
                //                group = "'2100','2700','2800'";

                //            }
                //            else if (temp[j] == "PRODUCTION")
                //            {
                //                group = "'40100','40300','40400','40500'";

                //            }
                //            else if (temp[j] == "PRODUCTION CONTROL")
                //            {
                //                group = "'7100','7200'";
                //            }
                //            else if (temp[j] == "QUALITY CONTROL")
                //            {
                //                group = "'5100','5300','5500','5600'";

                //            }
                //            else if (temp[j] == "SAFETY")
                //            {
                //                group = "'6100'";

                //            }
                //            else if (temp[j] == "TECHNOLOGY DEVELOPMENT")
                //            {
                //                group = "'12100','12200','12300'";
                //            }



                //            SubLabelChart _subLabel = new SubLabelChart();
                //            int i = 0;
                //            int m = 0;

                //            SqlCommand findGrpBySection = new SqlCommand();
                //            findGrpBySection.CommandText = @"  
                //                             SELECT SECT_CD, SECT FROM DVCD_Master
                //                             where DEPT = '" + drow["DEPT"].ToString() + @"' and SECT !='' and SECT_CD IN (" + group + @")
                //                             and SECT != 'DESIGN DEVELOPMENT'
                //                             GROUP BY SECT_CD,SECT";



                //            DataTable dtfindGrpBySection = oCOnnDCI.Query(findGrpBySection);
                //            string[] temp2 = new string[dtfindGrpBySection.Rows.Count];

                //            if (dtfindGrpBySection.Rows.Count > 0)
                //            {
                //                foreach (DataRow drowFindGrpBySection in dtfindGrpBySection.Rows)
                //                {

                //                    temp2[i] = drowFindGrpBySection["SECT"].ToString();


                //                    SqlCommand findGroupLoop3 = new SqlCommand();
                //                    findGroupLoop3.CommandText = @"                                               
                //                         select z.SECT_CD FROM (SELECT SECT_CD FROM DVCD_Master
                //                         where SECT_CD = @SECTCD

                //                          UNION ALL 

                //                         SELECT DV_CD FROM DVCD_Master
                //                         where SECT_CD = @SECTCD
                //                         ) as z

                //                        Group By Z.SECT_CD";

                //                    findGroupLoop3.Parameters.Add(new SqlParameter("@SECTCD", drowFindGrpBySection["SECT_CD"]));
                //                    DataTable dtfindGroupLoop3 = oCOnnDCI.Query(findGroupLoop3);

                //                    if (dtfindGroupLoop3.Rows.Count > 0)
                //                    {
                //                        string sect_cd = "";
                //                        foreach (DataRow drowfindGroupLoop3 in dtfindGroupLoop3.Rows)
                //                        {
                //                            sect_cd += "'" + drowfindGroupLoop3["SECT_CD"] + "',";
                //                        }
                //                        sect_cd = sect_cd.Substring(0, sect_cd.Length - 1);


                //                        // หาจำนวนพนักงานทั้งหมดในแผนก
                //                        SqlCommand findPercentEmployeeLearningLoop4 = new SqlCommand();
                //                        findPercentEmployeeLearningLoop4.CommandText = @"  
                //                                SELECT COUNT(EMPCODE) empLearning,  
                //                                       (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and RESIGN = '1900-01-01') and CODE NOT like 'I%' totalEmployeeInSect ,
	               //                                    CAST(CAST((COUNT(EMPCODE)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and RESIGN = '1900-01-01') as decimal(10,2)) PercentEmployeeIsLearnning
                //                                FROM TR_Trainee_Data tr
                //                                INNER JOIN Employee emp on emp.CODE = tr.EMPCODE 
                //                                where TRIM(COURSE_CODE) = 'CC001'and emp.DVCD IN (" + sect_cd + @")";

                //                        DataTable dtfindPercentEmployeeLearningLoop4 = oCOnnDCI.Query(findPercentEmployeeLearningLoop4);

                //                        if (dtfindPercentEmployeeLearningLoop4.Rows.Count > 0)
                //                        {
                //                            foreach (DataRow drowdtfindPercentEmployeeLearningLoop4 in dtfindPercentEmployeeLearningLoop4.Rows)
                //                            {
                //                                matrix[j, m] = Convert.ToDecimal(drowdtfindPercentEmployeeLearningLoop4["PercentEmployeeIsLearnning"]);
                //                            }
                //                        }

                //                        m++;


                //                    }

                //                    i++;
                //                }

                //                _subLabel.grp_name = temp2;
                //                SublabelChartsList.Add(_subLabel);
                //                j++;
                //            }

                //            labelChart.sect_name = temp;

                //        }



                //    }



                }
            }


            catch (Exception ex)
            {
            }

            //int[,] ary2D = {
            //                    {6, 14, 12,12,0,50,0,0},
            //                    {50, 0, 0,0,0,0,0,0}

            //                };

            //decimal[,] transposedMatrix = Transpose(matrix);


            //List<decimal[]> dataArrayListSection2 = CopyToArrayList(transposedMatrix);





            return Ok(new { chartSection1 = chartSection1 });

        }

        [NonAction]
        static decimal[,] Transpose(decimal[,] matrix)
        {
            int rows = matrix.GetLength(0);
            int columns = matrix.GetLength(1);

            // Create a new matrix with swapped dimensions
            decimal[,] transposedMatrix = new decimal[columns, rows];

            // Copy values from original matrix to transposed matrix
            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < columns; j++)
                {
                    transposedMatrix[j, i] = matrix[i, j];
                }
            }

            return transposedMatrix;
        }


        [NonAction]
        static List<Decimal[]> CopyToArrayList(decimal[,] newMatrix)
        {
            int row = newMatrix.GetLength(0);
            int column = newMatrix.GetLength(1);

            List<decimal[]> copyArrayList = new List<decimal[]>();

            for (int i = 0; i < row; i++)
            {
                decimal[] copyArray = new decimal[column];

                for (int j = 0; j < column; j++)
                {
                    copyArray[j] = newMatrix[i, j];
                }


                copyArrayList.Add(copyArray);
            }


            return copyArrayList;
        }
        [NonAction]
        static void PrintMatrix(decimal[,] matrix)
        {
            int rows = matrix.GetLength(0);
            int columns = matrix.GetLength(1);

            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < columns; j++)
                {
                    Console.Write(matrix[i, j] + " ");
                }
                Console.WriteLine();
            }
        }



        [HttpGet]
        [Route("getChartSection2/{cc}")]

        public IActionResult getChartSection2(string cc)
        {
            int j = 0;
            List<SubLabelChart> SublabelChartsList = new List<SubLabelChart>();
            LabelChart labelChart = new LabelChart();
            decimal[,] matrix = new decimal[12, 8];
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



                        SubLabelChart _subLabel = new SubLabelChart();
                        int i = 0;
                        int m = 0;

                        SqlCommand findGrpBySection = new SqlCommand();
                        findGrpBySection.CommandText = $@"  
                                                       select SECT_CD, SECT_NAME , NOTE from HRD_DEPT dept
                                                       INNER join HRD_SECT sect on dept.DEPT_CD = sect.DEPT_CD
                                                       INNER JOIN DictMstr dict on dict.REF_2 = SECT_NAME
                                                       where dept.DEPT_NAME = '{drow["DEPT_NAME"].ToString().Trim()}'

                                                       order by SECT_CD";



                        DataTable dtfindGrpBySection = oCOnnDCI.Query(findGrpBySection);
                        string[] temp2 = new string[dtfindGrpBySection.Rows.Count];

                        if (dtfindGrpBySection.Rows.Count > 0)
                        {
                            foreach (DataRow drowFindGrpBySection in dtfindGrpBySection.Rows)
                            {

                                temp2[i] = drowFindGrpBySection["SECT"].ToString();


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
                                                        SELECT COUNT(distinct EMPCODE) empLearning,  
                                                               (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and RESIGN = '1900-01-01')  totalEmployeeInSect ,
	                                                           CAST(CAST((COUNT(distinct EMPCODE)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and RESIGN = '1900-01-01') as decimal(10,2)) PercentEmployeeIsLearnning
                                                        FROM TR_Trainee_Data tr
                                                        INNER JOIN Employee emp on emp.CODE = tr.EMPCODE 
                                                        where TRIM(COURSE_CODE) = @CC and emp.DVCD IN (" + sect_cd + @")";
                                    findPercentEmployeeLearningLoop4.Parameters.Add(new SqlParameter("@CC", cc));

                                    DataTable dtfindPercentEmployeeLearningLoop4 = oCOnnDCI.Query(findPercentEmployeeLearningLoop4);

                                    if (dtfindPercentEmployeeLearningLoop4.Rows.Count > 0)
                                    {
                                        foreach (DataRow drowdtfindPercentEmployeeLearningLoop4 in dtfindPercentEmployeeLearningLoop4.Rows)
                                        {
                                            matrix[j, m] = Convert.ToDecimal(drowdtfindPercentEmployeeLearningLoop4["PercentEmployeeIsLearnning"]);
                                        }
                                    }

                                    m++;


                                }

                                i++;
                            }

                            _subLabel.grp_name = temp2;
                            SublabelChartsList.Add(_subLabel);
                            j++;
                        }

                        labelChart.sect_name = temp;

                    }
                }
            }





            catch (Exception ex)
            {
            }
            decimal[,] transposedMatrix = Transpose(matrix);



            List<decimal[]> dataArrayListSection2 = CopyToArrayList(transposedMatrix);

            return Ok(new { labelChart = labelChart, SublabelChartsList = SublabelChartsList, dataArrayListSection2 = dataArrayListSection2 });

        }




        [HttpGet]
        [Route("getChartSection2_Dev/{cc}")]

        public IActionResult getChartSection2_Dev(string cc)
        {
            int j = 0;
            int i = 0;
            int z = 0;
            // 42 = จำนวนแผนกมี 47 แผนก
            decimal[] data = new decimal[47];
            string[] LabelCharts = new string[47];
            int[] target = new int[47];
            int[] countEmployeeIsLearing = new int[47];
            int[] countTotalEmployeeInSection = new int[47]; 

            try
            {
                SqlCommand GroupCourse = new SqlCommand();
                GroupCourse.CommandText = @" SELECT distinct DEPT_NAME FROM HRD_DEPT";


                DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);
                string[] temp = new string[dtGroupCourse.Rows.Count];


                if (dtGroupCourse.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtGroupCourse.Rows)
                    {


                        SqlCommand findGrpBySection = new SqlCommand();
                        findGrpBySection.CommandText = $@"  
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
                                target[z] = 25;
                                z++;

                                SqlCommand findGroupLoop3 = new SqlCommand();
                            

                                findGroupLoop3.CommandText = $@"
                                                                
                                                                  SELECT grp.SECT_CD FROM HRD_GRP grp
                                                                  INNER JOIN HRD_SECT sect on sect.SECT_CD = grp.SECT_CD
                                                                  where sect.SECT_CD = '{drowFindGrpBySection["SECT_CD"].ToString().Trim()}'

                                                                  UNION 

                                                                  SELECT GRP_CD FROM HRD_GRP grp
                                                                  INNER JOIN HRD_SECT sect on sect.SECT_CD = grp.SECT_CD
                                                                  where sect.SECT_CD = '{drowFindGrpBySection["SECT_CD"].ToString().Trim()}'
                                                              ";

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
                                                        SELECT COUNT(distinct EMPCODE) empLearning,  
                                                               (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and CODE NOT like 'I%')  totalEmployeeInSect ,
	                                                           CAST(CAST((COUNT(distinct EMPCODE)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV')) as decimal(10,2)) PercentEmployeeIsLearnning
                                                        FROM TR_Trainee_Data tr
                                                        INNER JOIN Employee emp on emp.CODE = tr.EMPCODE  and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and RESIGN = '1900-01-01' and CODE NOT like 'I%'
                                                        where TRIM(COURSE_CODE) = @CC and emp.DVCD IN (" + sect_cd + @")";
                                    findPercentEmployeeLearningLoop4.Parameters.Add(new SqlParameter("@CC", cc));

                                    DataTable dtfindPercentEmployeeLearningLoop4 = oCOnnDCI.Query(findPercentEmployeeLearningLoop4);

                                    if (dtfindPercentEmployeeLearningLoop4.Rows.Count > 0)
                                    {
                                        foreach (DataRow drowdtfindPercentEmployeeLearningLoop4 in dtfindPercentEmployeeLearningLoop4.Rows)
                                        {
                                            data[i] = (Convert.ToDecimal(drowdtfindPercentEmployeeLearningLoop4["PercentEmployeeIsLearnning"]));
                                            countEmployeeIsLearing[i] = Convert.ToInt16(drowdtfindPercentEmployeeLearningLoop4["empLearning"]);
                                            countTotalEmployeeInSection[i] = Convert.ToInt16(drowdtfindPercentEmployeeLearningLoop4["totalEmployeeInSect"]);
                                            i++;
                                        }
                                    }
                                    else
                                    {
                                        data[i] = 0;
                                        countEmployeeIsLearing[i] = 0;
                                        countTotalEmployeeInSection[i] = 0;
                                        i++;
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




            return Ok(new { labelChart = LabelCharts, dataChart = data, target = target, countEmployeeIsLearing = countEmployeeIsLearing , countTotalEmployeeInSection = countTotalEmployeeInSection });

        }








        [HttpGet]
        [Route("getDataAttendance/{courseCode}/{dept}")]
        public IActionResult getDataAttendanceByDept(string courseCode, string dept)
        {
            List<ComplianceTrainingInfoModal> _ccMain = new List<ComplianceTrainingInfoModal>();
            List<EmployeeList> _employeesList = new List<EmployeeList>();
            string sect_cd = "";



            SqlCommand Section = new SqlCommand();
            //Section.CommandText = @" 
            //                        SELECT distinct SECT,SECT_CD FROM DictMstr
            //                        LEFT JOIN HRD on SECT = REF_2  and DV_CD NOT IN ('3500','41000','41100','40910','4600','4700','10500')
            //                        where DICT_TYPE ='SECT_NAME' and NOTE = '" + dept + "' ";

            Section.CommandText = $@" 
                                     SELECT distinct SECT_NAME,SECT_CD FROM DictMstr
                                     LEFT JOIN HRD_SECT sect on SECT_NAME = REF_2 
                                     where DICT_TYPE ='SECT_NAME' and NOTE = '{dept}'";




            DataTable dtSection = oCOnnDCI.Query(Section);


            if (dtSection.Rows.Count > 0)
            {
                foreach (DataRow drowSection in dtSection.Rows)
                {
                    ComplianceTrainingInfoModal complianceTrainingInfo = new ComplianceTrainingInfoModal();
                    complianceTrainingInfo.section = drowSection["SECT_NAME"].ToString().Trim();
                    complianceTrainingInfo.section_cd = drowSection["SECT_CD"].ToString().Trim();

                    SqlCommand findGrpBySection = new SqlCommand();
                    findGrpBySection.CommandText = @"  
                                              

                                             SELECT grp.SECT_CD FROM HRD_GRP grp
                                             INNER JOIN HRD_SECT sect on sect.SECT_CD = grp.SECT_CD
                                             where sect.SECT_CD = '" + drowSection["SECT_CD"].ToString() + @"'

                                             UNION 

                                             SELECT GRP_CD FROM HRD_GRP grp
                                             INNER JOIN HRD_SECT sect on sect.SECT_CD = grp.SECT_CD
                                             where sect.SECT_CD = '" + drowSection["SECT_CD"].ToString() + @"'";

                    DataTable dtfindGrpBySection = oCOnnDCI.Query(findGrpBySection);

                    if (dtfindGrpBySection.Rows.Count > 0)
                    {
                        foreach (DataRow drowfindGroupLoop3 in dtfindGrpBySection.Rows)
                        {
                            sect_cd += "'" + drowfindGroupLoop3["SECT_CD"].ToString().Trim() + "',";
                        }
                        sect_cd = sect_cd.Substring(0, sect_cd.Length - 1);


                    }


                    SqlCommand findEmployeeLearing = new SqlCommand();
                    findEmployeeLearing.CommandText = @"  
                                                   SELECT COUNT(distinct EMPCODE) empLearning,  
                                                           (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and RESIGN = '1900-01-01')  totalEmployeeInSect 
                                                    FROM TR_Trainee_Data tr
                                                    INNER JOIN Employee emp on emp.CODE = tr.EMPCODE and CODE NOT like 'I%' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and  RESIGN = '1900-01-01'
                                                    where TRIM(COURSE_CODE) = '" + courseCode + @"' and emp.DVCD IN (" + sect_cd + @")";

                    DataTable dtfindEmployeeLearing = oCOnnDCI.Query(findEmployeeLearing);

                    if (dtfindEmployeeLearing.Rows.Count > 0)
                    {
                        foreach (DataRow drowdtfindEmployeeLearing in dtfindEmployeeLearing.Rows)
                        {
                            ModalTrainingInfo modalTrainingInfo = new ModalTrainingInfo();
                            ComplianceResultTraining complianceResultTraining = new ComplianceResultTraining();
                            complianceResultTraining.totalEmployeeLearing = Convert.ToDecimal(drowdtfindEmployeeLearing["empLearning"]);
                            complianceResultTraining.totalEmployee = Convert.ToDecimal(drowdtfindEmployeeLearing["totalEmployeeInSect"]);
                            complianceResultTraining.totalAttendanceExpect = Math.Round(modalTrainingInfo.findPersonAttendance(Convert.ToDecimal(drowdtfindEmployeeLearing["totalEmployeeInSect"])));
                            complianceResultTraining.percentAttendance = Math.Round(modalTrainingInfo.findPercentResult(Convert.ToDecimal(drowdtfindEmployeeLearing["empLearning"]), Convert.ToDecimal(drowdtfindEmployeeLearing["totalEmployeeInSect"])),2);

                            SqlCommand findEmployeeList = new SqlCommand();
                            findEmployeeList.CommandText = @"
                                                   SELECT distinct * FROM (
                                                   SELECT CODE,TNAME,TSURN ,POSIT, CASE WHEN tr.EVALUATE_RESULT in ('P','F') THEN 'PASS' ELSE 'NOT PASS' END  Result FROM Employee emp
	                                                LEFT JOIN TR_Trainee_Data tr on tr.EMPCODE = emp.CODE and TRIM(COURSE_CODE) = '" + courseCode + @"'
	                                                where DVCD IN (" + sect_cd + @") and 
	                                                RESIGN = '1900-01-01' and CODE NOT like 'I%'  and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV')
                                        ) t";

                            DataTable dtfindEmployeeList = oCOnnDCI.Query(findEmployeeList);

                            if (dtfindEmployeeList.Rows.Count > 0)
                            {
                                foreach (DataRow drowfindEmployeeList in dtfindEmployeeList.Rows)
                                {
                                    EmployeeList employeeList = new EmployeeList();
                                    employeeList.code = drowfindEmployeeList["CODE"].ToString();
                                    employeeList.name = drowfindEmployeeList["TNAME"].ToString() + " " + drowfindEmployeeList["TSURN"].ToString();
                                    employeeList.position = drowfindEmployeeList["POSIT"].ToString();
                                    employeeList.result = drowfindEmployeeList["Result"].ToString();

                                    _employeesList.Add(employeeList);
                                }


                            }
                            complianceResultTraining.employeeList = _employeesList;
                            complianceTrainingInfo.result = complianceResultTraining;

                        }

                    }

                    _ccMain.Add(complianceTrainingInfo);
                }

            }



            //List<EmployeeList> clonedList = _employeesList.Select(x => (EmployeeList)x.Clone()).ToList();

            //clonedList.FirstOrDefault().fname = "test";





            return Ok(_ccMain);
        }



       

    }
}



