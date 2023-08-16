namespace CoreAssessment_backend.Model
{
    public class IndicatorDataTable
    {

        public string? Indicator_CourseName { get; set; }

        public List<CourseCodeDetail>? Indicator_CourseCode { get; set; }

        public List<IndicatorDetail>? Indicator_Category { get; set; }
    }
}
