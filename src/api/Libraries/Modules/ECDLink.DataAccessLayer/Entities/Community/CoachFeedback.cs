using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(CoachFeedback))]
    public class CoachFeedback : UserCoachFeedback<Guid>
    {
    }

    public class UserCoachFeedback<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }
        public Guid FeedbackTypeId { get; set; }
        public Guid SupportRatingId { get; set; }
        public string FeedbackDetails { get; set; }
    }

    public interface UserCoachFeedbackJoin<TKey>
    {
        [ForeignKey(nameof(UserCoachFeedbackId))]
        public CoachFeedback UserCoachFeedback { get; set; }
        public TKey UserCoachFeedbackId { get; set; }
    }
    
}
