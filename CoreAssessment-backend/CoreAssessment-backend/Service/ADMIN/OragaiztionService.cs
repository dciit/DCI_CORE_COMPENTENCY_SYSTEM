using CoreAssessment_backend.Model;
using CoreAssessment_backend.Model.TIS;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using static CoreAssessment_backend.Model.Admin.Organization;

namespace CoreAssessment_backend.Service.ADMIN
{
    public class OragaiztionService
    {

        private SqlConnectDB oCOnnDCI = new SqlConnectDB("dbDCI");
        public List<Depts> getDept()
        {

            List<Depts> modelDept = new List<Depts>();


            try
            {
                SqlCommand Sqldept = new SqlCommand();
                Sqldept.CommandText = @"select DEPT_CD,DEPT_NAME from HRD_DEPT where ACTIVE = 'ACTIVE'";
                DataTable dtSqldept = oCOnnDCI.Query(Sqldept);
                if (dtSqldept.Rows.Count > 0)
                {
                    foreach (DataRow rowDept in dtSqldept.Rows)
                    {

                        Depts _dept = new Depts();
                        string dept_cd = rowDept["DEPT_CD"].ToString().Trim();
                        _dept.title = rowDept["DEPT_NAME"].ToString().Trim() + " Department";
                        _dept.key = rowDept["DEPT_NAME"].ToString().Trim() + "-" + "Dept";
                       

                        


                        // section

                        List<Sects> modelSects = new List<Sects>();
                        SqlCommand SqlSect = new SqlCommand();
                        SqlSect.CommandText = $@"SELECT  '0001' SECT_CD , '['+[POSIT]+']' + ' - ' + CODE + ' - ' + NAME + '.' + SUBSTRING(SURN,0,2) SECT_NAME FROM Employee where RESIGN =                       '1900-01-01' and DVCD = '{dept_cd}' and POSIT NOT IN ('PD')
                                              UNION
                                              select SECT_CD,SECT_NAME from HRD_SECT  
                                              where TRIM(DEPT_CD) = '{dept_cd}' and ACTIVE = 'ACTIVE'";
                        DataTable dtSqlSect = oCOnnDCI.Query(SqlSect);
                        if (dtSqlSect.Rows.Count > 0)
                        {
                            foreach (DataRow rowSect in dtSqlSect.Rows)
                            {

                                Sects _sect = new Sects();
                                string sect_cd = rowSect["SECT_CD"].ToString().Trim();
                                _sect.title = sect_cd.Contains("0001") ? rowSect["SECT_NAME"].ToString().Trim() : rowSect["SECT_NAME"].ToString().Trim() + " Section";
                                _sect.key = rowSect["SECT_NAME"].ToString().Trim() + "-" + "Sect";




                                if (_sect.title.Contains("Section"))
                                {
                                    // group
                                    List<Groups> modelGroups = new List<Groups>();
                                    SqlCommand sqlGroup = new SqlCommand();
                                    sqlGroup.CommandText = $@"
                                                        SELECT  '0001' GRP_CD , '['+[POSIT]+']' + ' - ' + CODE + ' - ' + NAME + '.' + SUBSTRING(SURN,0,2) GRP_NAME FROM Employee               where RESIGN = '1900-01-01' and DVCD = '{sect_cd}' and POSIT NOT IN ('PD')
    
                                                        select GRP_CD,GRP_NAME FROM HRD_GRP where TRIM(SECT_CD) = '{sect_cd}' and ACTIVE = 'ACTIVE'";
                                    DataTable dtsqlGroup = oCOnnDCI.Query(sqlGroup);
                                    if (dtsqlGroup.Rows.Count > 0)
                                    {
                                        foreach (DataRow rowGroup in dtsqlGroup.Rows)
                                        {

                                            Groups _group = new Groups();
                                            string group_cd = rowGroup["GRP_CD"].ToString().Trim();
                                            _group.title = group_cd.Contains("0001") ? rowGroup["GRP_NAME"].ToString().Trim() : rowGroup["GRP_NAME"].ToString().Trim() + " Group";
                                            _group.key = rowGroup["GRP_NAME"].ToString().Trim() + "-" + "Grp";


                                            modelGroups.Add(_group);

                                            _sect.children = modelGroups;



                                        }

                                    }

                                    modelSects.Add(_sect);
                                    _dept.children = modelSects;
                                }
                                else
                                {
                                    modelSects.Add(_sect);
                                    _dept.children = modelSects;
                                }

                             

                            }



                        }
                        modelDept.Add(_dept);
               
                    }



                }
            }



            catch (Exception ex)
            {
            }

            return modelDept;

        }
    }
}
