using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreAssessment_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");

        // GET: api/<AuthenticationController>
        [HttpGet]
        [Route("authentication/{empcode}")]
        public IActionResult getEmployeeFlowLogin(string empcode)
        {




            string dept = "";
            string sect = "";
            string grp = "";


            // get Dept สำหรับ GM
            SqlCommand sqlSelect_Dvcd = new SqlCommand();
            sqlSelect_Dvcd.CommandText = @" SELECT distinct dvcd.DEPT_CD
                 
              FROM [dbDCI].[dbo].[TR_CompentencyApproveFlow] tr
              LEFT JOIN [dbDCI].[dbo].[DVCD_Master] dvcd on dvcd.GRP_CD = tr.DV_CD

              WHERE EvalulateBy = @CODE";
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

            Boolean isLogin = false;


            if (dept == "" && sect == "" && grp == "")
            {
                isLogin = false;
            }
            else
            {
                isLogin = true;

            }

            return Ok(isLogin);
        }

    }
}
