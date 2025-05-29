using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using static CoreAssessment_backend.Model.Elearning.ElearningReport;
using System.Data;
using CoreAssessment_backend.Model.ComplianceTrainingRecord;
using CoreAssessment_backend.Model;

namespace CoreAssessment_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplianceTrainingRecoredController : ControllerBase
    {

        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");

        [HttpGet]
        [Route("getCCTraningRecored")]

        public IActionResult getCCTraningRecored()
        {


            int total_employee = 0;




            string[] courseCode = {"CC001 Anti-Bribery",
                                   "CC002 Trade secret",
                                   "CC003 PDPA",
                                   "CC004 Security export",
                                   "CC005 Whistle blowing",
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
            List<chartDisplaySection1> ccHeaderList = new List<chartDisplaySection1>();


            List<ComplianceTrainingInfo> complianceTrainingSectionList = new List<ComplianceTrainingInfo>();

            LabelChart labelChart = new LabelChart();
            decimal[,] matrix = new decimal[12, 8];


            try
            {



                // total_full_score
                SqlCommand TotalEmployee = new SqlCommand();
                TotalEmployee.CommandText = @" select COUNT(CODE) totalEmployee FROM Employee emp
                                                                where POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and CODE NOT like 'I%'
                                                                and RESIGN = '1900-01-01' and DVCD NOT IN ('9110')";


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
                        findEmployeeIsLearingByCourse.CommandText = @" select  COUNT(distinct EMPCODE) as employeeIsLearing FROM [dbDCI].[dbo].[TR_Trainee_Data]
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
                                chartDisplaySection1.employeeIsLearing = Convert.ToInt32(drow["employeeIsLearing"]); // จำนวนคน
                                chartDisplaySection1.employeeIsLearingPercent = ((Convert.ToInt32(drow["employeeIsLearing"]) * 100) / total_employee); // จำนวนคน (%)
                                chartDisplaySection1.totalEmployee = total_employee;
                                ccHeaderList.Add(chartDisplaySection1);

                            }
                        }



                    }
                }



                // content



                int j = 0;

                SqlCommand GroupCourse = new SqlCommand();
                GroupCourse.CommandText = $@"    SELECT distinct DEPT_NAME FROM HRD_DEPT ";


                DataTable dtGroupCourse = oCOnnDCI.Query(GroupCourse);
                string[] temp = new string[dtGroupCourse.Rows.Count];


                if (dtGroupCourse.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtGroupCourse.Rows)
                    {


                        ComplianceTrainingInfo complianceSectionModel = new ComplianceTrainingInfo();

                        complianceSectionModel.dept = drow["DEPT_NAME"].ToString();

                        List<CompliancePercentScoreInfo> compliancePercentScoreList = new List<CompliancePercentScoreInfo>();


                        SqlCommand findGrpBySection = new SqlCommand();
                        findGrpBySection.CommandText = $@"  
                                                  select SECT_CD, SECT_NAME , NOTE from HRD_DEPT dept
                                                       INNER join HRD_SECT sect on dept.DEPT_CD = sect.DEPT_CD
                                                       INNER JOIN DictMstr dict on dict.REF_2 = SECT_NAME
                                                       where dept.DEPT_NAME = '{drow["DEPT_NAME"].ToString().Trim()}'

                                                       order by SECT_CD";



                        DataTable dtfindGrpBySection = oCOnnDCI.Query(findGrpBySection);

                        if (dtfindGrpBySection.Rows.Count > 0)
                        {
                            foreach (DataRow drowFindGrpBySection in dtfindGrpBySection.Rows)
                            {
                                CompliancePercentScoreInfo compliancePercentScoreInfo = new CompliancePercentScoreInfo();

                                compliancePercentScoreInfo.section = drowFindGrpBySection["SECT_NAME"].ToString();


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
                                    decimal[] aryScore = new decimal[6];
                                    int i = 0;
                                    foreach (var cc2 in cc)
                                    {

                                        SqlCommand findPercentEmployeeLearningLoop4 = new SqlCommand();
                                        findPercentEmployeeLearningLoop4.CommandText = @"  
                                                           SELECT COUNT(distinct EMPCODE) empLearning,  
                                                               (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and CODE NOT like 'I%')  totalEmployeeInSect ,
	                                                           CAST(CAST((COUNT(distinct EMPCODE)  * 100) as decimal(10,2)) / (SELECT COUNT(CODE) totalEmployee FROM Employee where DVCD IN (" + sect_cd + @") and CODE NOT like 'I%' and RESIGN = '1900-01-01' and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV')) as decimal(10,2)) PercentEmployeeIsLearnning
                                                        FROM TR_Trainee_Data tr
                                                        INNER JOIN Employee emp on emp.CODE = tr.EMPCODE  and POSIT NOT IN ('DR','GM','SGM','AG','AGM','PD','DI','TN','AV') and RESIGN = '1900-01-01' and CODE NOT like 'I%'
                                                        where TRIM(COURSE_CODE) = @CC and emp.DVCD IN (" + sect_cd + @")";

                                        findPercentEmployeeLearningLoop4.Parameters.Add(new SqlParameter("@CC", cc2.Key));
                                        DataTable dtfindPercentEmployeeLearningLoop4 = oCOnnDCI.Query(findPercentEmployeeLearningLoop4);

                                        if (dtfindPercentEmployeeLearningLoop4.Rows.Count > 0)
                                        {

                                            foreach (DataRow drowdtfindPercentEmployeeLearningLoop4 in dtfindPercentEmployeeLearningLoop4.Rows)
                                            {
                                                compliancePercentScoreInfo.employeeTotal = Convert.ToDecimal(drowdtfindPercentEmployeeLearningLoop4["totalEmployeeInSect"]);
                                                aryScore[i] = Convert.ToDecimal(drowdtfindPercentEmployeeLearningLoop4["PercentEmployeeIsLearnning"]);
                                                i++;
                                            }


                                        }


                                    }
                                    compliancePercentScoreInfo.percentScore = aryScore;
                                    compliancePercentScoreList.Add(compliancePercentScoreInfo);

                                    complianceSectionModel.sections = compliancePercentScoreList;
                                }



                            }

                            complianceTrainingSectionList.Add(complianceSectionModel);


                        }



                    }
                }



            }



            catch (Exception ex)
            {
            }







            // ************************  กราฟ section **************************
            int ccNum = 0;
            List<SectionDataSet> complianceChartSection = new List<SectionDataSet>();
            foreach (ComplianceTrainingInfo main in complianceTrainingSectionList)
            {


                foreach (CompliancePercentScoreInfo child in main.sections)
                {
                    SectionDataSet set = new SectionDataSet();
                    //set.section = ccNum.ToString();

                    SqlCommand findSection = new SqlCommand();
                    findSection.CommandText = @"                                               
                                                          SELECT TOP(1)
                                                          [REF_2]
                                                          ,[NOTE]
   
                                                      FROM [dbDCI].[dbo].[DictMstr]
                                                      where DICT_SYSTEM = 'COMPENTENCY_ASSESSMENT' and DICT_TYPE ='SECT_NAME' and REF_2 = '" + child.section + "'";

                    DataTable dtfindSection = oCOnnDCI.Query(findSection);

                    if (dtfindSection.Rows.Count > 0)
                    {

                        foreach (DataRow drowdtdtfindSection in dtfindSection.Rows)
                        {

                            set.sect_short = drowdtdtfindSection["NOTE"].ToString();

                        }
                    }
                    set.section_long = child.section;
                    set.cc001 = child.percentScore[0];
                    set.cc002 = child.percentScore[1];
                    set.cc003 = child.percentScore[2];
                    set.cc004 = child.percentScore[3];
                    set.cc005 = child.percentScore[4];
                    set.cc006 = child.percentScore[5];
                    set.percent = 25;

                    complianceChartSection.Add(set);
                }








            }


            return Ok(new { ccHeaderList = ccHeaderList, ccContentList = complianceTrainingSectionList, dataset = complianceChartSection });

        }
    }
}


