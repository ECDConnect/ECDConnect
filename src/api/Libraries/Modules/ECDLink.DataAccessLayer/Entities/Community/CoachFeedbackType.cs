using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CoachFeedbackType))]
    public class CoachFeedbackType : CoachFeedbackType<Guid>
    {
    }

    public class CoachFeedbackType<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(FeedbackTypeId))]
        public virtual FeedbackType FeedbackType { get; set; }
        public Guid FeedbackTypeId { get; set; }

        public Guid CoachFeedbackId { get; set; }
    }

    public interface CoachFeedbackTypeJoin<TKey>
    {
        [ForeignKey(nameof(CoachFeedbackTypeId))]
        public CoachFeedback CoachFeedbackType { get; set; }
        public TKey CoachFeedbackTypeId { get; set; }
    }
    
}
