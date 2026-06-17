using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(AppLog))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class AppLog
    {
        public Guid Id { get; set; }
        public DateTime InsertedDate { get; set; }
        public Guid? UserId { get; set; }
        public string Details { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string AppVersion { get; set; } = string.Empty;
    }
}