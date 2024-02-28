using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(SubDistrict))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class SubDistrict : SubDistrict<Guid>
    {
    }

    public class SubDistrict<TKey> : EntityBase<TKey>,
        DistrictJoin<Guid>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public Guid DistrictId { get; set; }

        [ForeignKey(nameof(DistrictId))]
        public virtual District District { get; set; }
    }

    public interface SubDistrictJoin<TKey>
    {
        [ForeignKey(nameof(SubDistrictId))]
        public SubDistrict SubDistrict { get; set; }
        public TKey SubDistrictId { get; set; }
    }
}
