using System.Xml.Serialization;

namespace CoreAssessment_backend.Model.Admin
{
    public class Organization
    {   

      

        public class Depts
        {
            public string? title { get; set; }

            public string? key { get; set; }


            public List<Sects> children { get; set; }


        }

        public class Sects
        {
          
            public string? title { get; set; }
            public string? key { get; set; }
            public List<Groups> children { get; set; }
        }

        public class Groups
        {
            public string? title { get; set; }

            public string? key { get; set; }
        }
    }
}
