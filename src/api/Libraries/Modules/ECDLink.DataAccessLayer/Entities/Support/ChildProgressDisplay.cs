using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.REPORTING)]
    public class ChildProgressDisplay : NotificationDisplay
    {
        public int numberOfChildrenNotProgressedForPeriod { get; set; }
        public int totalChildren { get; set; }
        public int percentageOfChildrenNotProgressedForPeriod { get; set; }
        public int numberOfPeriods { get; set; }
    }
}
