using ECDLink.DataAccessLayer.Entities.Clubs;
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

        public virtual ICollection<Visit> PrePQASiteVisits { get; set; }
        public virtual ICollection<Visit> PQASiteVisits { get; set; }
        public virtual ICollection<Visit> SupportVisits { get; set; }
        public virtual ICollection<Visit> ReAccreditationVisits { get; set; }
        public virtual ICollection<Visit> RequestedCoachVisits { get; set; }
        public virtual ICollection<PractitionerCoachCircle> CoachCircles { get; set; }
        public virtual ICollection<ClubMeetingRegister> ClubMeetings { get; set; }
        public virtual ICollection<PQARating> PQARatings { get; set; }
        public virtual ICollection<PQARating> ReAccreditationRatings { get; set; }
        public virtual PQARating PQARating1 { get; set; }
        public virtual PQARating PQARating2 { get; set; }
        public virtual PQARating PQARating3 { get; set; }
        public virtual PQARating ReAccreditationRating1 { get; set; }
        public virtual PQARating ReAccreditationRating2 { get; set; }
        public virtual PQARating ReAccreditationRating3 { get; set; }
    }

    public class PQARating
    {
        public string VisitName { get; set; }
        public double OverallScore { get; set; }
        public string OverallRating { get; set; }
        public string OverallRatingStars { get; set; }
        public string OverallRatingColor { get; set; }
        public string VisitTypeName { get; set; }
        public DateTime? PlannedDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public virtual ICollection<PQARatingChild> Children { get; set; }
    }

    public class PQARatingChild
    {
        public string VisitSection { get; set; }
        public double SectionScore { get; set; }
        public string SectionRating { get; set; }
        public string SectionRatingColor { get; set; }
    }

    public class PractitionerCoachCircle
    {
        public string Name { get; set; }
        public DateTime? MeetingDate { get; set; }
    }
    public class PractitionerNotes
    {
        public string VisitName { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public DateTime? PlannedVisitDate { get; set; }
        public virtual ICollection<VisitData> Answers { get; set; }
    }
}
