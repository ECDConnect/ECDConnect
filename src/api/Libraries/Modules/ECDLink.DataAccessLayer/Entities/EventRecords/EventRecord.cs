using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.EventRecordings
{
    [Table(nameof(EventRecord))]
    public class EventRecord : EventRecord<Guid>
    {
    }

    public class EventRecord<TKey> : EntityBase<TKey>, EventRecordTypeJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey EventRecordTypeId { get; set; }
        [ForeignKey(nameof(EventRecordTypeId))]
        public virtual EventRecordType EventRecordType { get; set; }
        public string Notes { get; set; }
        public Guid? MotherId { get; set; }
        public virtual Mother Mother { get; set; }
        public Guid? InfantId { get; set; }
        public virtual Infant Infant { get; set; }
        public Guid? LinkedVisitId { get; set; }
    }

    public interface EventRecordJoin<TKey>
    {
        [ForeignKey(nameof(EventRecordId))]
        public EventRecord EventRecord { get; set; }
        public TKey EventRecordId { get; set; }
    }

    
}
