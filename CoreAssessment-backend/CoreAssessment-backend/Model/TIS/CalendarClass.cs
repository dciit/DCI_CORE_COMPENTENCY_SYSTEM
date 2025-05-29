using Microsoft.Identity.Client;

namespace CoreAssessment_backend.Model.TIS
{
    public class CalendarClass
    {

        public string course_code { get; set; }

        public string course_name { get; set; }

        public string trainer { get; set; }

        public string location { get; set; }

        public DateTime scst_date { get; set; }


        public DateTime scen_date { get; set; }
    }
}
