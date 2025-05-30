﻿namespace CoreAssessment_backend.Model
{
    public class Employee
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Surn { get; set; }

        public string? Dept { get; set; }

        public string? Sect { get; set; }

        public string? Posit { get; set; }

        public Boolean? Status { get; set; }

        public string? Status_2 { get; set; }

        public DateTime? JoinDate { get; set; }

        public string? Grade { get; set; }

        public int? WorkingAge_TotalDay { get; set; }

        public int? WorkingAge_Year { get; set; }


        public int? WorkingAge_Month { get; set; }

        public int? WorkingAge_Day { get; set; }


    }
}
