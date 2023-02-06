using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ServiceScheduler))]
    [EntityPermission(PermissionGroups.SYSTEM)]
    public class ServiceScheduler : ServiceScheduler<Guid>
    {

    }
    public class ServiceScheduler<TKey> : EntityBase<TKey>,
        ApplicationUserJoin
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string SettingsPath { get; set; }
        public string TimingDelay { get; set; }
        public string ServiceToRun { get; set; }
        public string Results { get; set; }
        public int Order { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

    }
}
