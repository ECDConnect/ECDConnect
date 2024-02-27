using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(District))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class District : Province<Guid>
    {
    }

    public class District<TKey> : EntityBase<TKey>,
        ProvinceJoin<Guid>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string UniqueId { get; set; }
        public Guid ProvinceId { get; set; }

        [ForeignKey(nameof(ProvinceId))]
        public virtual Province Province { get; set; }
        public virtual ICollection<SubDistrict> SubDistricts { get; set; }
    }

    public interface DistrictJoin<TKey>
    {
        [ForeignKey(nameof(DistrictId))]
        public District District { get; set; }
        public TKey DistrictId { get; set; }
    }
}
