using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Caregiver))]
    [EntityPermission(PermissionGroups.USER)]
    public class Caregiver : Caregiver<Guid>
    {
    }

    public class Caregiver<TKey> : EntityBase<TKey>, 
        SiteAddressJoin<Guid?>, 
        RelationJoin<Guid?>, 
        EducationJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public string IdNumber { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string EmergencyContactFirstName { get; set; }

        public string EmergencyContactSurname { get; set; }

        public string EmergencyContactPhoneNumber { get; set; }

        public string AdditionalFirstName { get; set; }

        public string AdditionalSurname { get; set; }

        public string AdditionalPhoneNumber { get; set; }

        public bool JoinReferencePanel { get; set; }

        public bool Contribution { get; set; }

        public string Age { get; set; }

        public string WhatsAppNumber { get; set; }

        public bool IsAllowedCustody { get; set; }

        public virtual ICollection<Grant> Grants { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        [ForeignKey(nameof(RelationId))]
        public virtual Relation Relation { get; set; }
        public Guid? RelationId { get; set; }

        [ForeignKey(nameof(EducationId))]
        public virtual Education Education { get; set; }
        public Guid? EducationId { get; set; }


        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }
    }

    public interface CaregiverJoin<TKey>
    {
        [ForeignKey(nameof(CaregiverId))]
        public Caregiver Caregiver { get; set; }
        public TKey CaregiverId { get; set; }
    }
}
