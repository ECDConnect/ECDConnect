using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ClinicTeamLead))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClinicTeamLead : ClinicTeamLead<Guid>
    {
    }

    public class ClinicTeamLead<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public Guid ClinicId { get; set; }
        public Guid TeamLeadId { get; set; }

        [ForeignKey(nameof(ClinicId))]
        public virtual Clinic Clinic { get; set; }

        [ForeignKey(nameof(TeamLeadId))]
        public virtual TeamLead TeamLead { get; set; }

        public string WelcomeMessage { get; set; }
    }

    public interface ClinicTeamLeadJoin<TKey>
    {
        [ForeignKey(nameof(ClinicTeamLeadId))]
        public ClinicTeamLead ClinicTeamLead { get; set; }
        public TKey ClinicTeamLeadId { get; set; }
    }
}
