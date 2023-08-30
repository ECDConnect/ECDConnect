using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Leagues
{
    [Table(nameof(League))]
    public class League : League<Guid>
    {
    }

    public class League<TKey> : EntityBase<TKey>, LeagueTypeJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey LeagueTypeId { get; set; }

        [ForeignKey(nameof(LeagueTypeId))]
        public virtual LeagueType LeagueType { get; set; }
        public string Name { get; set; }

    }

    public interface LeagueJoin<TKey>
    {
        [ForeignKey(nameof(LeagueId))]
        public League League { get; set; }
        public TKey LeagueId { get; set; }
    }
}
