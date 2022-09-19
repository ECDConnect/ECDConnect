using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using IdentityServer4.Events;
using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class NotificationDisplay
    {
        public string Subject { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public string Message { get; set; }

        //TODO: CB Map userId to display
        //public Guid UserId { get; set; }
        //public string RoleType { get; set; }
    }
}
