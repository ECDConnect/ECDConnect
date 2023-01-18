using ECDLink.DataAccessLayer.Entities.Base;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.EventRecords
{
    [Table(nameof(EventRecordType))]
    public class EventRecordType : EventRecordType<Guid>
    {
    }

    public class EventRecordType<TKey> : EntityBase<TKey> 
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; } // mother or child
        public Guid? ParentId { get; set; }

        [GraphQLIgnore]
        public virtual ICollection<EventRecordChildType> Children { get; set; }
    }

    public interface EventRecordTypeJoin<TKey>
    {
        [ForeignKey(nameof(EventRecordTypeId))]
        public EventRecordType EventRecordType { get; set; }
        public TKey EventRecordTypeId { get; set; }
    }


}
