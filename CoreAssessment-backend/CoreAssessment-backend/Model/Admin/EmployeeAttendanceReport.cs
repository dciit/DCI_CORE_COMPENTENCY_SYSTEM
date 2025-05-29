namespace CoreAssessment_backend.Model.Admin
{
    //public class EmployeeAttendanceReport
    //{
    //    public string? section { get; set; }

    //    public List<IGroup>? groups { get; set; }


    //}

    public class IGroup
    {
        public string? grp_name { get; set; }

        public string? grp_cd { get; set; }
        public decimal? totalEmployee { get; set; }

        public decimal? resultEmployeeAssessment { get; set; }

        public List<IEmployee>? employees { get; set; }

    }

    public class IEmployee
    {   
        public string? code { get; set; }
        public string? fname { get; set; }

        public string? lname { get; set; }

        public string? position { get; set; }

        public string? status { get; set; }

        public int? WorkingAge_TotalDay { get; set; }

        public int? WorkingAge_Year { get; set; }


        public int? WorkingAge_Month { get; set; }

        public int? WorkingAge_Day { get; set; }

        public DateTime? JoinDate { get; set; }
    }
}
