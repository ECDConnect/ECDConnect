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

        public string ClubMeetingDate1Status { get; set; }
        public string ClubMeetingDate1Color { get; set; }
        public DateTime? ClubMeetingDate1 { get; set; }

        public string ClubMeetingDate2Status { get; set; }
        public string ClubMeetingDate2Color { get; set; }
        public DateTime? ClubMeetingDate2 { get; set; }

        public string ClubMeetingDate3Status { get; set; }
        public string ClubMeetingDate3Color { get; set; }
        public DateTime? ClubMeetingDate3 { get; set; }

        public string PrePQAVisitDate1Status { get; set; }
        public string PrePQAVisitDate1Color { get; set; }
        public DateTime? PrePQAVisitDate1 { get; set; }

        public string PrePQAVisitDate2Status { get; set; }
        public string PrePQAVisitDate2Color { get; set; }
        public DateTime? PrePQAVisitDate2 { get; set; }

        public string CoachingCircle1Status { get; set; }
        public string CoachingCircle1Color { get; set; }
        public DateTime? CoachingCircleDate1 { get; set; }

        public string CoachingCircle2Status { get; set; }
        public string CoachingCircle2Color { get; set; }
        public DateTime? CoachingCircleDate2 { get; set; }

        public string CoachingCircle3Status { get; set; }
        public string CoachingCircle3Color { get; set; }
        public DateTime? CoachingCircleDate3 { get; set; }

        public string CoachingCircle4Status { get; set; }
        public string CoachingCircle4Color { get; set; }
        public DateTime? CoachingCircleDate4 { get; set; }

        public string ChildProgressTrainingStatus { get; set; }
        public string ChildProgressTrainingColor { get; set; }
        public DateTime? ChildProgressTrainingDate { get; set; }

        public string SmartStarterUnitConferenceStatus { get; set; }
        public string SmartStarterUnitConferenceColor { get; set; }
        public DateTime? SmartStarterUnitConferenceDate { get; set; }

        public virtual ICollection<Visit> PrePQASiteVisits { get; set; }
        public virtual ICollection<Visit> PQASiteVisits { get; set; }
        public virtual ICollection<Visit> SupportVisits { get; set; }
        public virtual ICollection<Visit> ReAccreditationVisits { get; set; }
        public virtual ICollection<PractitionerClubMeeting> ClubMeetings { get; set; }
        public virtual ICollection<PractitionerCoachCircle> CoachCircles { get; set; }
    }

    public class PractitionerClubMeeting
    {
        public string Name { get; set; }
        public DateTime? MeetingDate { get; set; }
    }

    public class PractitionerCoachCircle
    {
        public string Name { get; set; }
        public DateTime? MeetingDate { get; set; }
    }
}
