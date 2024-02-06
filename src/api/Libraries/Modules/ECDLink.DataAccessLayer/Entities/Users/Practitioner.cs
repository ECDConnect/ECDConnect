using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Practitioner))]
    [EntityPermission(PermissionGroups.USER)]
    public class Practitioner : Practitioner<Guid>
    {

    }

    public class Practitioner<TKey> : EntityBase<TKey>,
        IDocumentQueryable,
        SiteAddressJoin<Guid?>,
        IUserType,
        ITrackableType
         where TKey : IEquatable<TKey>
    {
        [GraphQLIgnore]
        public string Hierarchy { get; set; }
        public string AttendanceRegisterLink { get; set; }
        public int? MaxChildren { get; set; }
        public bool? ConsentForPhoto { get; set; }
        public decimal? ParentFees { get; set; }
        public string LanguageUsedInGroups { get; set; }
        public DateTime? StartDate { get; set; }
        public int? MonthSinceFranchisee { get; set; }
        public virtual ICollection<Document> Documents { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        [ForeignKey(nameof(CoachHierarchy))]
        public virtual Coach Coach { get; set; }
        public Guid? CoachHierarchy { get; set; }

        [ForeignKey(nameof(PrincipalHierarchy))]
        public virtual Practitioner Principal { get; set; }
        public Guid? PrincipalHierarchy { get; set; }
        public bool? IsPrincipal { get; set; }
        public bool? IsFundaAppAdmin { get; set; }
        public bool? IsTrainee { get; set; }
        public string SigningSignature { get; set; }
        public bool? IsRegistered { get; set; }
        public bool? ShareInfo { get; set; }
        public DateTime? DateLinked { get; set; }
        public DateTime? DateAccepted { get; set; }
        public DateTime? DateToBeRemoved { get; set; }
        public bool? IsLeaving { get; set; }

        [ForeignKey(nameof(ReasonForPractitionerLeavingId))]
        public virtual ReasonForPractitionerLeaving ReasonForLeaving { get; set; }
        public Guid? ReasonForPractitionerLeavingId { get; set; }
        public string ReasonForLeavingDetails { get; set; }
        public decimal Progress { get; set; }
        public string ProgrammeType { get; set; }
        public bool? IsClubOwner { get; set; }
        public bool? AttendedChildProgress { get; set; }
        public bool? AttendedBusinessSkills { get; set; }
        public string LeavingComment { get; set; }
        public string StipendType { get; set; }
        public string UsePhotoInReport { get; set; }
        public bool? IsOnStipend { get; set; }
        public bool? AttendedFirstAidCourse { get; set; }
        public bool? SetupTraineeInitiated { get; set; }
        public bool? IsCompletedBusinessWalkThrough { get; set; }

        public bool IsPrincipalOrAdmin()
        {
            return (IsPrincipal.HasValue && IsPrincipal.Value) || (IsFundaAppAdmin.HasValue && IsFundaAppAdmin.Value);
        }
    }

    public interface PractitionerJoin<TKey>
    {
        [ForeignKey(nameof(PractitionerId))]
        public Practitioner Practitioner { get; set; }
        public TKey PractitionerId { get; set; }
    }
}
