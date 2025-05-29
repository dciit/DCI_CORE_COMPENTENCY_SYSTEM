using CoreAssessment_backend.Model.DashboardBarCharts;

namespace CoreAssessment_backend.Model.RuleTree
{
    public class OrgChart
    {
       
    }

    public class OrgChartDept
    {
        public string? dept_cd { get; set; }

        public string? dept_name { get; set; }


        public List<OrgChartEmployeeApprove>? dept_persons { get; set; }
    }

    public class OrgChartEmployeeApprove
    {
        public string? dept_person { get; set; }

        public List<OrgChartSection>? sections { get; set; }
    }


    public class OrgChartSection
    {
        public string? sect_name { get; set; }

        public string? sect_cd { get; set; }
        public string? sect_person { get; set; }

        public List<OrgChartGroup>? grps { get; set; }
    }

    public class OrgChartGroup
    {

        public string? grp_cd { get; set; }
        public string? grp_name { get; set; }

        public string? grp_person { get; set; }



    }
}
