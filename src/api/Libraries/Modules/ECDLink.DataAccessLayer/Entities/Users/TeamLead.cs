using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(TeamLead))]
    [EntityPermission(PermissionGroups.USER)]
    public class TeamLead : TeamLead<Guid>
    {

    }

    public class TeamLead<TKey> : EntityBase<TKey>,
        ApplicationUserJoin,
        ClinicJoin<Guid?>
        where TKey : IEquatable<TKey>
    {
        //[ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(ClinicId))]
        public virtual Clinic Clinic { get; set; }
        public Guid? ClinicId { get; set; }

        public string JobTitle { get; set; }
    }

    public interface TeamLeadJoin<TKey>
    {
        [ForeignKey(nameof(TeamLeadId))]
        public TeamLead TeamLead { get; set; }
        public TKey TeamLeadId { get; set; }
    }
}
