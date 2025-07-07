using ECDLink.DataAccessLayer.Entities.Visits;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Visits
{
    public class VisitModel
    {
        public DateTime PlannedVisitDate { get; set; }
        public DateTime ActualVisitDate { get; set; }
        public DateTime? DueDate { get; set; }
        public Guid? VisitTypeId { get; set; }
        public VisitType VisitType { get; set; }
        public string Risk { get; set; }  // high or normal
        public string Comment { get; set; }
        public bool Attended { get; set; }
        public bool? isSupportCall { get; set; }
        public Guid? PractitionerId { get; set; }
        public Guid? CoachId { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public Guid? EventId { get; set; }
    }

    public class SupportVisitModel
    {
        public DateTime? PlannedVisitDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public DateTime? DueDate { get; set; }
        public Guid? VisitTypeId { get; set; }
        public VisitType VisitType { get; set; }
        public string? Risk { get; set; }  // high or normal
        public string? Comment { get; set; }
        public bool? Attended { get; set; }
        public Guid? PractitionerId { get; set; }
        public Guid? CoachId { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public bool? isSupportCall { get; set; }
        public CMSVisitDataInputModel SupportData { get; set; }
    }

    public class FollowUpVisitModel
    {
        public DateTime? PlannedVisitDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public Guid? VisitTypeId { get; set; }
        public VisitType VisitType { get; set; }
        public string? Risk { get; set; }  // high or normal
        public string? Comment { get; set; }
        public bool? Attended { get; set; }
        public Guid? PractitionerId { get; set; }
        public Guid? CoachId { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public CMSVisitDataInputModel FollowUpData { get; set; }
    }

    public class ReAccreditationVisitModel
    {
        public DateTime? PlannedVisitDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public Guid? VisitTypeId { get; set; }
        public VisitType VisitType { get; set; }
        public string? Risk { get; set; }  // high or normal
        public string? Comment { get; set; }
        public bool? Attended { get; set; }
        public Guid? PractitionerId { get; set; }
        public Guid? CoachId { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public CMSVisitDataInputModel ReAccreditationData { get; set; }
    }

    public class SSChecklistVisitModel
    {
        public DateTime? PlannedVisitDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ActualVisitDate { get; set; }
        public Guid? VisitTypeId { get; set; }
        public VisitType VisitType { get; set; }
        public string? Risk { get; set; }  // high or normal
        public string? Comment { get; set; }
        public bool? Attended { get; set; }
        public Guid? CoachId { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public CMSVisitDataInputModel ChecklistData { get; set; }
    }

    public class UpdateVisitPlannedVisitDateModel
    {
        public Guid VisitId { get; set; }
        public DateTime PlannedVisitDate { get; set; }
        public Guid EventId { get; set; }
    }

}

