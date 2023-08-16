namespace CoreAssessment_backend.Model.DashboardBarCharts
{
    public class DashboardBarChart
    {
        public int? CoreLevel { get; set; }

        public List<SubDashboardBarChart>? Score { get; set; }

    }

    public class SubDashboardBarChart
    {   
        public string? CourseCode { get; set; }
        public decimal? Score { get; set; }
    }
}
