using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Trainee))]
    [EntityPermission(PermissionGroups.USER)]
    public class Trainee : Trainee<Guid>
    {

    }

    public class Trainee<TKey> : EntityBase<TKey>,
        ITrackableType
         where TKey : IEquatable<TKey>
    {

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        [NotMapped]
        public virtual Practitioner Practitioner { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ConsolidationMeetingDate { get; set; }
        public DateTime? ScheduledConsolidationMeetingDate { get; set; }
        public DateTime? ChildrenAddedDate { get; set; }
        public Guid? LinkedPrincipalHierarchy { get; set; }
        public decimal Progress { get; set; }
        public string ProgrammeType { get; set; }
        public string SiteArea { get; set; }
        public DateTime? TraineeConvertedDate { get; set; }
        public bool? SiteVisitsCompleted { get; set; }
        public bool? ChildProgressTraining { get; set; }
        public bool? StarterLicenceReceived { get; set; }
        public bool? PlayKitReceived { get; set; }
        public bool? AdminFileReceived { get; set; }
        public bool? SmartSpaceVisitPassed { get; set; }
        public bool? AttendedStartUpTraining { get; set; }
        public bool? IsSmartSpaceVisitValidated { get; set; }
        public bool? IsAdminFileAndPlaykitValidated { get; set; }
        public string HighestEducationLevel { get; set; }
        public bool? HaveCommunitySupport { get; set; }
        public DateTime? CommunitySupportGained { get; set; }
        public string HomeAddressLine1 { get; set; }
        public string HomeAddressLine2 { get; set; }
        public string HomeAddressLine3 { get; set; }
        public string HomeAddressPostalCode { get; set; }
        public string PreferredCommunicationLanguage { get; set; }
        public DateTime? FranchiseeAgreementAcceptedDate { get; set; }
        public DateTime? SmartSpaceLicenceDate { get; set; }
        public DateTime? StarterLicenceDate { get; set; }
        public string StipendType { get; set; }
        public bool? IsOnStipend { get; set; }        
        public Guid PractitionerId { get; set; }

        public Guid? CoachHierarchy { get; set; }
    }

    public interface TraineeIdJoin<TKey>
    {
        [ForeignKey(nameof(TraineeId))]
        public Trainee Trainee { get; set; }
        public TKey TraineeId { get; set; }
    }
}
