using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.AuditLog
{
    [Table(nameof(AuditLogType))]
    [EntityPermission(PermissionGroups.AUDIT)]
    public class AuditLogType : AuditLogType<Guid>
    {

    }

    public class AuditLogType<TKey> : EntityBase<TKey>, IEnumType<AuditLogTypeEnum>
         where TKey : IEquatable<TKey>
    {
        public AuditLogTypeEnum EnumId { get; set; }

        public string Description { get; set; }
    }

    public interface AuditLogTypeJoin<TKey>
    {
        [ForeignKey(nameof(AuditLogTypeId))]
        public AuditLogType AuditLogType { get; set; }
        public TKey AuditLogTypeId { get; set; }
    }
}
