using System;

namespace ECDLink.DataAccessLayer.Entities.Users.Mapping
{
    public class TraineeTimeline
    {
    }

    public class TraineeOnBoardTimeline
    {
        public string DayOneStartUpTrainingStatus { get; set; }
        public string DayOneStartUpTrainingColor { get; set; }
        public DateTime? DayOneStartUpTrainingDate  { get; set; }

        public string StarterLicenseStatus { get; set; }
        public string StarterLicenseColor { get; set; }
        public DateTime? StarterLicenseDate { get; set; }

        public string ConsolidationMeetingStatus { get; set; }
        public string ConsolidationMeetingColor { get; set; }
        public DateTime? ConsolidationMeetingDate { get; set; }

        public string SmartSpaceChecklistStatus { get; set; }
        public string SmartSpaceChecklistColor { get; set; }
        public DateTime? SmartSpaceChecklistDate { get; set; }

        public string CommunitySupportStatus { get; set; }
        public string CommunitySupportColor { get; set; }
        public DateTime? CommunitySupportDate { get; set; }

        public string ThreeChildrenRegisteredStatus { get; set; }
        public string ThreeChildrenRegisteredColor { get; set; }
        public DateTime? ThreeChildrenRegisteredDate { get; set; }

        public string SSCoachVisitStatus { get; set; }
        public string SSCoachVisitColor { get; set; }
        public DateTime? SSCoachVisitDate { get; set; }

        public string SignFranchiseeAgreementStatus { get; set; }
        public string SignFranchiseeAgreementColor { get; set; }
        public DateTime? SignFranchiseeAgreementDate { get; set; }

        public string SignStartUpSupportAgreementStatus { get; set; }
        public string SignStartUpSupportColor { get; set; }
        public DateTime? SignStartUpSupportDate { get; set; }
    }
}
