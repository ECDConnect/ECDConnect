using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(PQASectionRating))]
    public class PQASectionRating : PQASectionRating<Guid>
    {
    }

    public class PQASectionRating<TKey> : EntityBase<TKey>, PQARatingJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey PQARatingId { get; set; }
        [ForeignKey(nameof(PQARatingId))]
        public virtual PQARating PQARating { get; set; }
        public string VisitSection { get; set; }
        public double SectionScore { get; set; }
        public string SectionRating { get; set; }
        public string SectionRatingColor { get; set; }
    }
}
