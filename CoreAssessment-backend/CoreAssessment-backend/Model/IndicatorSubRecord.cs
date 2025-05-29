namespace CoreAssessment_backend.Model
{
    public class IndicatorSubRecord
    {
        public decimal? Scroce { get; set; }

        public int? IndicatorDetail_Id { get; set; }

        public string? EmpCode { get; set; }

        public string? IndicatorBy { get; set; }

   
    }


    public class IndicatorSubRecordDev
    {
        public string? CD_Rev { get; set; }
        public string? CD_Name { get; set; }

        public string? CD_EmpCode { get; set; }

        public int? CD_ExpectedScore { get; set; }

        public int? CD_ActualScore { get; set; }

        public int? CD_Gap { get; set; }


        public string? CD_Comment { get; set; }

        public string? CD_Assessor { get; set; }

        public DateTime? CD_CreateDate { get; set; }




    }
}
