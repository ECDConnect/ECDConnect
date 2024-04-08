using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(TeamLead))]
    [EntityPermission(PermissionGroups.USER)]
    public class TeamLead : TeamLead<Guid>
    {

    }

    public class TeamLead<TKey> : EntityBase<TKey>,
        ApplicationUserJoin
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        public virtual ICollection<ClinicTeamLead> Clinics { get; set; }

        public string JobTitle { get; set; }
        public bool IsRegistered { get; set; }
        public string WelcomeMessage { get; set; }
    }

    public interface TeamLeadJoin<TKey>
    {
        [ForeignKey(nameof(TeamLeadId))]
        public TeamLead TeamLead { get; set; }
        public TKey TeamLeadId { get; set; }
    }
}
