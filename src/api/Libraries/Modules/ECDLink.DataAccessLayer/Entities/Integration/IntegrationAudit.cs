using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping
{
    [Table(nameof(IntegrationAudit))]
    public class IntegrationAudit : IntegrationAudit<Guid>
    {
    }

    public class IntegrationAudit<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Entity { get; set; }
        public string Property { get; set; }
        public DateTime? Submitted { get; set; }
        public string ValueBefore { get; set; }
        public string ValueAfter { get; set; }
        public string ChangeType { get; set; }
        public Guid UserId { get; set; }
        public string RelatedId { get; set; }
    }

    public class AuditChanges
    {
        public string FieldName { get; set; }
        public string ValueBefore { get; set; }
        public string ValueAfter { get; set; }
    }
}
