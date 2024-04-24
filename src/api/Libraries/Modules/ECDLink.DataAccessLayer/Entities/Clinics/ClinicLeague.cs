using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clinics
{
    [Table(nameof(ClinicLeague))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClinicLeague : ClinicLeague<Guid>
    {
    }

    public class ClinicLeague<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public Guid ClinicId { get; set; }
        public Guid LeagueId { get; set; }

        [ForeignKey(nameof(ClinicId))]
        public virtual Clinic Clinic { get; set; }

        [ForeignKey(nameof(LeagueId))]
        public virtual League League { get; set; }
    }

    public interface ClinicLeagueJoin<TKey>
    {
        [ForeignKey(nameof(ClinicLeagueId))]
        public ClinicLeague ClinicLeague { get; set; }
        public TKey ClinicLeagueId { get; set; }
    }
}
