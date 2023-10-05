using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

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

        public string SmartSpaceLicenseStatus { get; set; }
        public string SmartSpaceLicenseColor { get; set; }
        public DateTime? SmartSpaceLicenseDate { get; set; }

        public DateTime? SmartSpaceLicenseNotAwardedDate { get; set; }
        public string SmartSpaceLicenseNotAwardedSteps { get; set; }

        public string ConsolidationMeetingStatus { get; set; }
        public string ConsolidationMeetingColor { get; set; }
        public DateTime? ConsolidationMeetingDate { get; set; }
        public DateTime? ConsolidationDeadlineDate { get; set; }
        public DateTime? ConsolidationMeetingDateScheduled { get; set; }

        public string SmartSpaceChecklistStatus { get; set; }
        public string SmartSpaceChecklistColor { get; set; }
        public DateTime? SmartSpaceChecklistDate { get; set; }
        public DateTime? SmartSpaceChecklistDeadlineDate { get; set; }

        public string CommunitySupportStatus { get; set; }
        public string CommunitySupportColor { get; set; }
        public DateTime? CommunitySupportDate { get; set; }
        public DateTime? CommunitySupportDeadlineDate { get; set; }

        public string ThreeChildrenRegisteredStatus { get; set; }
        public string ThreeChildrenRegisteredColor { get; set; }
        public DateTime? ThreeChildrenRegisteredDate { get; set; }
        public DateTime? ThreeChildrenRegisteredDeadlineDate { get; set; }

        public string SSCoachVisitStatus { get; set; }
        public string SSCoachVisitColor { get; set; }
        public DateTime? SSCoachVisitDate { get; set; }
        public DateTime? SSCoachVisitDeadlineDate { get; set; }
        public Guid? SSCoachVisitId { get; set; }
        public bool SSCoachVisitDone { get; set; }
        public Guid? SSCoachVisitEventId { get; set; }

        public string SignFranchiseeAgreementStatus { get; set; }
        public string SignFranchiseeAgreementColor { get; set; }
        public DateTime? SignFranchiseeAgreementDate { get; set; }
        public DateTime? SignFranchiseeAgreementDeadlineDate { get; set; }

        public string SignStartUpSupportAgreementStatus { get; set; }
        public string SignStartUpSupportAgreementColor { get; set; }
        public DateTime? SignStartUpSupportAgreementDate { get; set; }
        public DateTime? SignStartUpSupportAgreementDeadlineDate { get; set; }
        public DateTime? StartUpSupportStartDate { get; set; }
        public DateTime? StartUpSupportEndDate { get; set; }
        public double? StartUpSupportAmount { get; set; }
        public virtual ICollection<Visit> TraineeVisits { get; set; }
    }
}
