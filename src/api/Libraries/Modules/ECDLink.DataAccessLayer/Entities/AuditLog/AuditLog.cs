
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.AuditLog
{
    [Table(nameof(AuditLog))]
    [EntityPermission(PermissionGroups.AUDIT)]
    public class AuditLog : AuditLogTypeJoin<Guid>
    {
        [ForeignKey(nameof(AuditLogTypeId))]
        public virtual AuditLogType AuditLogType { get; set; }
        public Guid AuditLogTypeId { get; set; }

        public string Description { get; set; }
        public DateTime InsertedDate { get; set; } 

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
    }
}
