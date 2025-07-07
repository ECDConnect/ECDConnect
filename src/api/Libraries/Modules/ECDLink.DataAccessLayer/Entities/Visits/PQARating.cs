using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(PQARating))]
    public class PQARating : PQARating<Guid>
    {
    }
    
    public class PQARating<TKey> : EntityBase<TKey>, VisitJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public string VisitName { get; set; }
        public double OverallScore { get; set; }
        public string OverallRating { get; set; }
        public string OverallRatingStars { get; set; }
        public string OverallRatingColor { get; set; }
        public string VisitTypeName { get; set; }
        public Guid? LinkedVisitId { get; set; }
        public TKey VisitId { get; set; }
        [ForeignKey(nameof(VisitId))]
        public virtual Visit Visit { get; set; }
        //public DateTime? PlannedDate { get; set; }
        //public DateTime? ActualVisitDate { get; set; }
        public virtual ICollection<PQASectionRating> Sections { get; set; }
    }

    public interface PQARatingJoin<TKey>
    {
        [ForeignKey(nameof(PQARatingId))]
        public PQARating PQARating { get; set; }
        public TKey PQARatingId { get; set; }
    }
}
