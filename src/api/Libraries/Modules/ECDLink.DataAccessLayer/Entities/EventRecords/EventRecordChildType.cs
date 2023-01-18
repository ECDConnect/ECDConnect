using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.EventRecords
{
    public class EventRecordChildType : EventRecordChildType<Guid>
    {
    }

    public class EventRecordChildType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; } // mother or child
    }


    public interface EventRecordChildTypeJoin<TKey>
    {
        [ForeignKey(nameof(EventRecordTypeId))]
        public EventRecordChildType EventRecordChildType { get; set; }
        public TKey EventRecordTypeId { get; set; }
    }


}
