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
        public string Notes { get; set; }



        public Guid UserId { get; set; }
        public string UserType { get; set; }

        //TODO: CB Map userId to display
        //public string RoleType { get; set; }
    }

    public class DisplaySet
    {
        public string Subject { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public string Notes { get; set; }
    }
}
