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


    public class DVCD
    {
        public string dvcd { get; set; }

        public string dvname { get; set; }
    }


    public class MainDashBoardChart
    {
        public string? Dvcd { get; set; }

        public string? Dvcd_name { get; set; }

        public List<CountEmployeeStatus> countEmployee { get; set; }
    }


    public class CountEmployeeStatus


    {
        public int? level { get; set; }

        public string?[] cc { get; set; }
        public int[] totalEmployee { get; set; }

        public int[] totalEmployeePass { get; set; }
    }

    public class Payload_Dashboard
    {
        public string? dvcd { get; set; }

        public string? empcode { get; set; }

        public string? position { get; set; }
    }
}
