using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.AuditLog
{
    [Table(nameof(SystemLog))]
    [EntityPermission(PermissionGroups.USER)]
    public class SystemLog
    {
        public string Id { get; set; }
        public string ErrorLog { get; set; }
        public string ErrorFunction { get; set; }
        public string ErrorType { get; set; }
        public DateTime InsertedDate { get; set; }
        public string UserId { get; set; }
        public string TenantId { get; set; }

    }
}
