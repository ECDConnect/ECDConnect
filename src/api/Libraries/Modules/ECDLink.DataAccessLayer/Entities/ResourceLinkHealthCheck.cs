using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ResourceLinkHealthCheck))]
    public class ResourceLinkHealthCheck : ResourceLinkHealthCheck<Guid>
    {
    }

    public class ResourceLinkHealthCheck<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string ContentType { get; set; }
        public int ContentId { get; set; }
        public Guid LocaleId { get; set; }
        public string SectionType { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Status { get; set; }
        public string LastCheckStatus { get; set; }
        public int? LastStatusCode { get; set; }
        public string LastError { get; set; }
        public int ConsecutiveFailureCount { get; set; }
        public DateTime LastCheckedDate { get; set; }
        public DateTime? LastNotifiedDate { get; set; }
    }
}
