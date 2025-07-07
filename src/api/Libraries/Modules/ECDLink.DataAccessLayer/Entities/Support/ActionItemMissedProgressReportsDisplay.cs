using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.REPORTING)]
    public class ActionItemMissedProgressReportsDisplay : NotificationDisplay
    {
        public ApplicationUser PractitionerUser { get; set; }
        public DateTime CurrentReportingPeriodEnd { get; set; }
        public DateTime NextReportingPeriodEnd { get; set; }

    }
}
