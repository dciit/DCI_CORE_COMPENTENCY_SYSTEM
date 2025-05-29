namespace CoreAssessment_backend.Model.Elearning
{
    public class ElearningReport
    {
        public class chartDisplaySection1 { 
            
            public string?  course_name { get;  set; }

            public string? course_name_th { get; set; }
            public decimal? employeeIsLearing { get; set; }

            public decimal? employeeIsLearingPercent { get; set; }

            public int? totalEmployee { get; set; }

        }


        public class chartDisplaySection2
        {

            public string? dvcd_name { get; set; }

          
            public decimal? employeeIsLearing { get; set; }

            public decimal? employeeIsLearingPercent { get; set; }

            public int? totalEmployee { get; set; }

        }

        public class LabelChart
        {

            public string[]? sect_name { get; set; }



        }

        public class SubLabelChart
        {

            public string[]? grp_name { get; set; }



        }
    }
}
