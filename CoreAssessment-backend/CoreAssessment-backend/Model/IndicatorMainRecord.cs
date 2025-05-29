namespace CoreAssessment_backend.Model
{
    public class IndicatorMainRecord
    {


        public string? Empcode { get; set; }

        public string? IndicatorBy { get; set; }

        public string? IndicatorName { get; set; }

        public int? CoreLevel { get; set; }
    }



    public class IndicatorMainRecordDev
    {
        public string? CC_Rev { get; set; }


        public string? CC_EmpCode { get; set; }

        public string? CC_CoreLevel { get; set; }


        public string? CC_EvaluteStatus { get; set; }

        public string? CC_EvaluteBy { get; set; }

        public string? CC_EvaluteDate { get; set; }

        public string? CC_ApproveStatus { get; set; }

        public string? CC_ApproveBy { get; set; }

        public string? CC_ApproveDate { get; set; }




        public string? CC_CreateBy { get; set; }


        public DateTime? CD_CreateDate { get; set; }


    

    }
}
