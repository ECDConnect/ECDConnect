using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CoachFeedback))]
    public class CoachFeedback : CoachFeedback<Guid>
    {
    }

    public class CoachFeedback<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }
        public Guid SupportRatingId { get; set; }
        public string FeedbackDetails { get; set; }
        public virtual ICollection<CoachFeedbackType> CoachFeedbackTypes { get; set; }
    }

    public interface CoachFeedbackJoin<TKey>
    {
        [ForeignKey(nameof(CoachFeedbackId))]
        public CoachFeedback CoachFeedback { get; set; }
        public TKey CoachFeedbackId { get; set; }
    }
    
}
