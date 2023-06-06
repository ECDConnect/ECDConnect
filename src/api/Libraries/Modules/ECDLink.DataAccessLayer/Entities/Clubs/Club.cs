using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(Club))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Club : Club<Guid>
    {

    }

    public class Club<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
    }

    public interface ClubJoin<TKey>
    {
        [ForeignKey(nameof(ClubId))]
        public Club Club { get; set; }
        public TKey ClubId { get; set; }
    }
}
