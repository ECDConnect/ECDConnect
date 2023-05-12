using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.REPORTING)]
    public class AgeSpreadDisplay : NotificationDisplay
    {
        public int PercentChildrenOutsideAgeGroup { get; set; }
    }
}
