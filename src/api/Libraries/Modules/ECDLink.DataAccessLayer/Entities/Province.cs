using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Province))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Province : Province<Guid>
    {
    }

    public class Province<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface ProvinceJoin<TKey>
    {
        [ForeignKey(nameof(ProvinceId))]
        public Province Province { get; set; }
        public TKey ProvinceId { get; set; }
    }
}
