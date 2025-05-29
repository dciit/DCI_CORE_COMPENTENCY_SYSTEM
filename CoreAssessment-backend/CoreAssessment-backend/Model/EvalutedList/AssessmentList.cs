namespace CoreAssessment_backend.Model.EvalutedList
{
    public class AssessmentList
    {

        public string? EvaluteYear { get; set; }

        public string? EmpCode { get; set; }

        public string? Name { get; set; }

        public string? Posit { get; set; }

        public string? Dept { get; set; }


        public string? DvName { get; set; }

        public string? CoreLevel { get; set; }

        public string? Scroce { get; set; }

        public string? EvaluteStatus { get; set; }

        public string? EvaluteBy { get; set; }

        public DateTime? EvaluteDate { get; set; }

        public string? ApproveStatus { get; set; }

        public string? ApproveBy { get; set; }


        public DateTime? ApproveDate { get; set; }

    }

    public class UpdateStatusApprove
    {
        public string? evaluteYear { get; set; }

        public string? empCode { get; set; }

        public string? nameIncharge { get; set; }

        public string? coreLevel { get; set; }

        public string? evaluteStatus { get; set; }
        public string? evaluteBy { get; set; }

        public string? approveBy { get; set; }

        public string? approveStatus { get; set; }

    }


    public class GroupCountEmployeeAssessmentByDept
    {
        public string? dept_cd { get; set; }

        public string? dept_name { get; set; }

        public decimal? total_Employee { get; set; }

        public decimal? total_Employee_is_assessment { get; set; }

        public decimal? total_Employee_wait_assessment { get; set; }
    }


    public class GroupCountEmployeeAssessmentBySection
    {
        public string? sect_cd { get; set; }

        public string? sect_name { get; set; }

        public decimal? total_Employee { get; set; }

        public decimal? total_Employee_is_assessment { get; set; }

        public decimal? total_Employee_wait_assessment { get; set; }
    }



    public class GroupCountEmployeeAssessmentByGroup
    {
        public string? group_cd { get; set; }

        public string? group_name { get; set; }

        public decimal? total_Employee { get; set; }


        public decimal? total_Employee_is_assessment { get; set; }

        public decimal? total_Employee_wait_assessment { get; set; }
    }
}
