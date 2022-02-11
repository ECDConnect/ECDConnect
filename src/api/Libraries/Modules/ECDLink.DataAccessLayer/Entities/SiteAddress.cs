using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(SiteAddress))]
    [EntityPermission(PermissionGroups.USER)]
    public class SiteAddress : SiteAddress<Guid>
    {
    }

    public class SiteAddress<TKey> : EntityBase<TKey>, ProvinceJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string AddressLine3 { get; set; }

        public string PostalCode { get; set; }

        public string Ward { get; set; }

        [ForeignKey(nameof(ProvinceId))]
        public virtual Province Province { get; set; }
        public TKey ProvinceId { get; set; }
    }

    public interface SiteAddressJoin<TKey>
    {
        [ForeignKey(nameof(SiteAddressId))]
        public SiteAddress SiteAddress { get; set; }
        public TKey SiteAddressId { get; set; }
    }
}
