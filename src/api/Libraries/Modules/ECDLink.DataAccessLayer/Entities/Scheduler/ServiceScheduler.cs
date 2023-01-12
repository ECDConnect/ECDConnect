using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ServiceScheduler : EntityBase
    {
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
