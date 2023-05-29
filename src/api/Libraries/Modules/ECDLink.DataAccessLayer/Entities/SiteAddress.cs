using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(SiteAddress))]
    [EntityPermission(PermissionGroups.USER)]
    public class SiteAddress : SiteAddress<Guid>
    {
    }

    public class SiteAddress<TKey> : EntityBase<TKey>, ProvinceJoin<Guid?>, ITrackableType
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string AddressLine3 { get; set; }

        public string PostalCode { get; set; }

        public string Ward { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Municipality { get; set; }
        public string Area { get; set; }

        [ForeignKey(nameof(ProvinceId))]
        public virtual Province Province { get; set; }
        public Guid? ProvinceId { get; set; }
    }

    public interface SiteAddressJoin<TKey>
    {
        [ForeignKey(nameof(SiteAddressId))]
        public SiteAddress SiteAddress { get; set; }
        public TKey SiteAddressId { get; set; }
    }
}
