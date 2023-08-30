using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
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
        public int NumberOfMembers { get; set; }
        public string? UserId { get; set; }
        public Guid? LeagueId { get; set; }
        public virtual League League { get; set; }
        public virtual ClubLeader ClubLeader { get; set; }
        public virtual ClubSupport ClubSupport { get; set; }
    }

    public interface ClubJoin<TKey>
    {
        [ForeignKey(nameof(ClubId))]
        public Club Club { get; set; }
        public TKey ClubId { get; set; }
    }
}
