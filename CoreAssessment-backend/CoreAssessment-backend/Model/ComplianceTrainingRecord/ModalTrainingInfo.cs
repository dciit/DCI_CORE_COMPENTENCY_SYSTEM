using System;

namespace CoreAssessment_backend.Model.ComplianceTrainingRecord
{
    public class ModalTrainingInfo
    {
        public class ComplianceTrainingInfoModal
        {
            public string? section { get; set; }

            public string? section_cd { get; set; }
            public ComplianceResultTraining? result { get; set; }
        }

        public class ComplianceResultTraining
        {   

            public decimal? totalEmployeeLearing { get; set; }
            public decimal? totalEmployee { get; set; }

            public decimal? totalAttendanceExpect { get; set; }

            public decimal? percentAttendance { get; set; }


            public List<EmployeeList> employeeList { get; set; }

        }

        public class EmployeeList : ICloneable
        {   
            public string code { get; set; }
            public string name { get; set; }


            public string position { get; set; }

            public string result { get; set; }

            public object Clone()
            {
                return new EmployeeList { code = this.code, name = this.name , position = this.position , result = this.result };
            }

        }


        public decimal findPersonAttendance(decimal totalEmployee)
        {
            int set_percent_pass = 100;
            return totalEmployee > 0 ? (set_percent_pass * totalEmployee) / 100 : 0; 
        }


        public decimal findPercentResult(decimal employeeIsLearing , decimal totalEmployee)
        {
            return totalEmployee  > 0 ?(employeeIsLearing * 100) / totalEmployee : 0;
        }




    }
}
