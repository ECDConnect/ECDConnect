using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Leagues
{
    [Table(nameof(LeagueType))]
    public class LeagueType : LeagueType<Guid>
    {
    }

    public class LeagueType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
        public int MaxPoints { get; set; }
    }

    public interface LeagueTypeJoin<TKey>
    {
        [ForeignKey(nameof(LeagueTypeId))]
        public LeagueType LeagueType { get; set; }
        public TKey LeagueTypeId { get; set; }
    }
}
