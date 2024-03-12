using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class NotificationDisplay
    {
        public string Subject { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public string Message { get; set; }
        public string Notes { get; set; }
        public string GroupingName { get; set; }
        public Guid? UserId { get; set; }
        public string UserType { get; set; }

        //TODO: CB Map userId to display
    }

    public class DisplaySet
    {
        public string Subject { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public string Notes { get; set; }
    }
}
