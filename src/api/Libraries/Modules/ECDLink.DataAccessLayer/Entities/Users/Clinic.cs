using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Clinic))]
    [EntityPermission(PermissionGroups.USER)]
    public class Clinic : Clinic<Guid>
    {

    }

    public class Clinic<TKey> : EntityBase<TKey>,
        SiteAddressJoin<Guid?>
        where TKey : IEquatable<TKey>
    {

        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        public string EmergancyContactPerson { get; set; }

        public string EmergancyContactNumber { get; set; }
    }

    public interface ClinicJoin<TKey>
    {
        [ForeignKey(nameof(ClinicId))]
        public Clinic Clinic { get; set; }
        public TKey ClinicId { get; set; }
    }
}
