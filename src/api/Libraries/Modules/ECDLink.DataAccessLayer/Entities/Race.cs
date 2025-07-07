using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Race))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Race : Race<Guid>
    {
    }

    public class Race<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface RaceJoin<TKey>
    {
        [ForeignKey(nameof(RaceId))]
        public Race Race { get; set; }
        public TKey RaceId { get; set; }
    }
}
