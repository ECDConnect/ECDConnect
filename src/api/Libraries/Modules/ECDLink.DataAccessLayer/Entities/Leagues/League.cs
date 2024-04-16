using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Clinics;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Leagues
{
    [Table(nameof(League))]
    public class League : League<Guid>
    {
    }

    public class League<TKey> : EntityBase<TKey>, LeagueTypeJoin<TKey>, DistrictJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public TKey LeagueTypeId { get; set; }

        [ForeignKey(nameof(LeagueTypeId))]
        public virtual LeagueType LeagueType { get; set; }
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public Guid? DistrictId { get; set; }
        public virtual District District { get; set; }
        public virtual ICollection<ClinicLeague> Clinics { get; set; }

    }

    public interface LeagueJoin<TKey>
    {
        [ForeignKey(nameof(LeagueId))]
        public League League { get; set; }
        public TKey LeagueId { get; set; }
    }
}
