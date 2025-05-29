namespace CoreAssessment_backend.Model.ComplianceTrainingRecord
{
    public class ComplianceTrainingInfo
    {
        public string? dept { get; set; }
        public List<CompliancePercentScoreInfo>? sections { get; set; }
    }

    public class CompliancePercentScoreInfo
    {
        public string? section { get; set; }

        public decimal? employeeTotal { get; set; }

        public decimal[]? percentScore { get; set; }
    }


    public class SectionDataSet
    {

        public decimal? cc001 { get; set; }
        public decimal? cc002 { get; set; }

        public decimal? cc003 { get; set; }

        public decimal? cc004 { get; set; }

        public decimal? cc005 { get; set; }

        public decimal? cc006 { get; set; }

        public string? section_long { get; set; }

        public string? sect_short { get; set; }

        public int? percent { get; set; }
    }
}
