using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.REPORTING)]
    public class ClassReassignmentDisplay : NotificationDisplay
    {
        public ClassroomGroup ReassignedClassroomGroup { get; set; }
        public ApplicationUser ReassignedFromUser { get; set; }
        public ApplicationUser ReassignedToUser { get; set; }

    }
}
