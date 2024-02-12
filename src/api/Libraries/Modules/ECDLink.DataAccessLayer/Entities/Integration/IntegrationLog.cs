using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping
{
    [Table(nameof(IntegrationLog))]
    public class IntegrationLog : IntegrationLog<Guid>
    {
    }

    public class IntegrationLog<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string LogResult { get; set; }
        public string LogNotes { get; set; }
        public LogRelatedType RelatedType { get; set; }
        public Guid? UserId { get; set; }
        public string RelatedId { get; set; }

    }

}
