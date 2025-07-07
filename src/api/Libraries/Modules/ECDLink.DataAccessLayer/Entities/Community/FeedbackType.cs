using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(FeedbackType))]
    public class FeedbackType : FeedbackType<Guid>
    {
    }

    public class FeedbackType<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public int Ordering { get; set; }
    }

    public interface FeedbackTypeJoin<TKey>
    {
        [ForeignKey(nameof(FeedbackTypeId))]
        public FeedbackType FeedbackType { get; set; }
        public TKey FeedbackTypeId { get; set; }
    }
    
}
