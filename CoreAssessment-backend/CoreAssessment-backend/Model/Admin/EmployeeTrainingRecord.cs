namespace CoreAssessment_backend.Model.Admin
{
    public class EmployeeTrainingRecord
    {

        public class IGroup
        {
            public string? course_name { get; set; }

            public decimal? totalEmployee { get; set; }

            public decimal? resultEmployeeAssessment { get; set; }

            public List<IEmployee>? employees { get; set; }

        }
    }
}
