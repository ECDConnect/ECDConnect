using ECDLink.DataAccessLayer.Entities.Base;
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
    public class Principal : Practitioner<Guid>
    {

    }

    public class Principal<TKey> : EntityBase<TKey>,
        IDocumentQueryable,
        SiteAddressJoin<Guid?>,
        IUserType, IUserElevatedScoped, ITrackableType
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
        public Guid UserId { get; set; }


        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }
        public string CoachHierarchy { get; set; }
        public string PrincipalHierarchy { get; set; }
        public bool? IsPrincipal { get; set; }
        public bool? IsFundaAppAdmin { get; set; }
        public bool? IsTrainee { get; set; }
        public string SigningSignature { get; set; }
        public bool? IsRegistered { get; set; }
        public bool? ShareInfo { get; set; }

    }

    public interface PrincipalIdJoin<TKey>
    {
        [ForeignKey(nameof(PrincipalId))]
        public Principal Principal { get; set; }
        public TKey PrincipalId { get; set; }
    }
}
