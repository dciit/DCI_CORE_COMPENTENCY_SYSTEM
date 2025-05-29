namespace CoreAssessment_backend.Model.HistoryTrainning
{


    public class EmpDvcd
    {
        public string? DVCD { get; set; }

        public string? DVCD_NAME { get; set; }

    }

    public class EmployeeDVCD
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Surn { get; set; }

        public string? Dept { get; set; }

        public string? Sect { get; set; }

        public string? Posit { get; set; }

        public Boolean? Status { get; set; }

        public DateTime? JoinDate { get; set; }

        public string? Grade { get; set; }


    }

    public class TraineesHistory
    {

        public string? COURSE_NAME { get; set; }

        public string? SCHEDULE_DATE { get; set; }

        public string? RESULT { get; set; }

        public string? HOURS { get; set; }
    }
}
