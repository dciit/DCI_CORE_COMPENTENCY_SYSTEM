namespace CoreAssessment_backend.Model.DashboardEmployee
{
    public class Dashboard
    {   
        public string? CourseName { get; set; }
        public List<Dashboard_score>? Scorce { get; set; }
    }

    public class Dashboard_score
    {
        public decimal? Pass { get; set; }

        public decimal? NotPass { get; set; }
    }
}
