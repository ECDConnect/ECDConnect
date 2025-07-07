using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Users.Mapping
{
    public class PractitionerTimeline
    {
        public string StarterLicenseStatus { get; set; }
        public string StarterLicenseColor { get; set; }
        public DateTime? StarterLicenseDate { get; set; }

        public string SmartSpaceLicenseStatus { get; set; }
        public string SmartSpaceLicenseColor { get; set; }
        public DateTime? SmartSpaceLicenseDate { get; set; }
        
        public string PracticeLicenseStatus { get; set; }
        public string PracticeLicenseColor { get; set; }
        public DateTime? PracticeLicenseDate { get; set; }

        public string ConsolidationMeetingStatus { get; set; }
        public string ConsolidationMeetingColor { get; set; }
        public DateTime? ConsolidationMeetingDate { get; set; }

        public string FirstAidCourseStatus { get; set; }
        public string FirstAidCourseColor { get; set; }
        public DateTime? FirstAidDate { get; set; }

        public string PrePQAVisitDate1Status { get; set; }
        public string PrePQAVisitDate1Color { get; set; }
        public DateTime? PrePQAVisitDate1 { get; set; }

        public string PrePQAVisitDate2Status { get; set; }
        public string PrePQAVisitDate2Color { get; set; }
        public DateTime? PrePQAVisitDate2 { get; set; }

        public string ChildProgressTrainingStatus { get; set; }
        public string ChildProgressTrainingColor { get; set; }
        public DateTime? ChildProgressTrainingDate { get; set; }

        public string SmartStarterUniteConferenceStatus { get; set; }
        public string SmartStarterUniteConferenceColor { get; set; }
        public DateTime? SmartStarterUniteConferenceDate { get; set; }

        public string SelfAssessmentStatus { get; set; }
        public string SelfAssessmentColor { get; set; }
        public DateTime? SelfAssessmentDate { get; set; }

        public ICollection<Visit> PrePQASiteVisits { get; set; }
        public ICollection<Visit> PQASiteVisits { get; set; }
        public ICollection<Visit> SupportVisits { get; set; }
        public ICollection<Visit> ReAccreditationVisits { get; set; }
        public ICollection<Visit> RequestedCoachVisits { get; set; }
        public ICollection<Visit> SelfAssessmentVisits { get; set; }
        
        public ICollection<PQARating> PQARatings { get; set; }
        public ICollection<PQARating> ReAccreditationRatings { get; set; }
        public PQARating PQARating1 { get; set; }
        public PQARating PQARating2 { get; set; }
        public PQARating PQARating3 { get; set; }
        public PQARating ReAccreditationRating1 { get; set; }
        public PQARating ReAccreditationRating2 { get; set; }
        public PQARating ReAccreditationRating3 { get; set; }
    }

    public class PractitionerAttendance
    {
        public int TotalMeetings { get; set; } //X = the number of coaching circles logged by coach for the practitioner's club in the current year
        public int TotalPresent { get; set; }// Y = the total number of presents & absents logged for the practitioner for coaching circles
        public double PercAttended { get; set; }
        public string AttendanceText { get; set; } // date on which the most recent coaching circle was held
        public string AttendanceColor { get; set; } // 60% or more - green & 60% less - amber

    }
    public class PractitionerNotes
    {
        public string VisitName { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public DateTime? PlannedVisitDate { get; set; }
        public ICollection<VisitData> Answers { get; set; }
    }
}
