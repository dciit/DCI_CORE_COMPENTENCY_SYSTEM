namespace CoreAssessment_backend.Model.TIS
{
    public class TIS
    {
        public string CODE { get; set; }
        public string TFULLNAME { get; set; }
        public string FULLNAME { get; set; }
        public string GRPOT { get; set; }
        public string JOIN { get; set; }
        public string RESIGN { get; set; }
        public string POSIT { get; set; }
        public string DVCD { get; set; }
        public string DEPT { get; set; }
        public string ST_DT { get; set; }
        public string END_DT { get; set; }
        public string COURSE_CODE { get; set; }
        public string COURSE_NAME { get; set; }
        public string TrainerType { get; set; }
        public string COURSE_PER_PERSON { get; set; }
        public string LOCATION { get; set; }
        public string PRD_TIME { get; set; }
        public string TRAIN_DAY { get; set; }
        public string EVAL { get; set; }
        public string EVAL_SCORE { get; set; }
        public string TOTAL_MARK { get; set; }
        public string HAS_TEST { get; set; }
    }


    public class TraineeSchedule
    {
        public string dept { get; set; }

        public string sect { get; set; }

        public string grp { get; set; }

        public string empCode { get; set; }

        public string empName { get; set; }

        public string posit { get; set; }
    }
}
