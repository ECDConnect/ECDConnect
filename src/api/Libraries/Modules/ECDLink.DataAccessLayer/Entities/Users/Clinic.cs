using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
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

        public string EmergencyContactPerson { get; set; }

        public string EmergencyContactNumber { get; set; }
    }

    public interface ClinicJoin<TKey>
    {
        [ForeignKey(nameof(ClinicId))]
        public Clinic Clinic { get; set; }
        public TKey ClinicId { get; set; }
    }
}
