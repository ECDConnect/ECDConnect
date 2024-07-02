using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Community
{
    [Table(nameof(SupportRating))]
    public class SupportRating : SupportRating<Guid>
    {
    }

    public class SupportRating<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string ImageName { get; set; }
        public int Ordering { get; set; }
    }

    public interface SupportRatingJoin<TKey>
    {
        [ForeignKey(nameof(SupportRatingId))]
        public SupportRating SupportRating { get; set; }
        public TKey SupportRatingId { get; set; }
    }
    
}
