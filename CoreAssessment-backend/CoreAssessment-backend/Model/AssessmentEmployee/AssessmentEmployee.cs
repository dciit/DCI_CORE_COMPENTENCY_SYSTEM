namespace CoreAssessment_backend.Model.AssessmentEmployee
{

    public class CoreCompentency
    {
        public string? cc_name { get; set; }

        public string? cc_desc { get; set; }

        public string? cc_title { get; set; }

        public List<SubBehavior>? cc_Behavior { get; set; }

        public List<Knowledge>? cc_knowledge { get; set; }

        public string[] cc_skill { get; set; }
    }



    public class Knowledge
    {
        public string? kl_name { get; set; }

        public string? kl_status { get; set; }
    }

    public class Skill
    {
        public string? skill_name { get; set; }


    }
    public class SubBehavior { 
        
        public string? sub_name { get; set; }
    
    }
}
