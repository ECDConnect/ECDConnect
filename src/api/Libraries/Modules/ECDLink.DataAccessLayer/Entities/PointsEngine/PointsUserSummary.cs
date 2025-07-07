using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PointsEngine

{
    [Table(nameof(PointsUserSummary))]
    public class PointsUserSummary : PointsUserSummary<Guid>
    {
    }

    public class PointsUserSummary<TKey> : EntityBase<TKey>, 
        ApplicationUserJoin, 
        PointsLibraryJoin<Guid?>,
        PointsActivityJoin<Guid>
         where TKey : IEquatable<TKey>
    {        
        public int TimesScored { get; set; }
        public int PointsTotal { get; set; }
        // TODO - I think we should remove this, and just recalculate it from the individual month scores
        public int PointsYTD { get; set; }
        // TODO - Remove
        public int Month { get; set; }
        // TODO - Remove
        public int Year { get; set; }

        // Year and month of points summary, day will be defaulted to 1st
        public DateTime DateScored { get; set; }
        public Guid? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? PointsLibraryId { get; set; }

        [ForeignKey(nameof(PointsLibraryId))]
        public virtual PointsLibrary PointsLibrary { get; set; }
        public Guid PointsActivityId { get; set; }

        [ForeignKey(nameof(PointsActivityId))]
        public virtual PointsActivity PointsActivity { get; set; }
    }

    public interface PointsUserSummaryJoin<TKey>
    {
        [ForeignKey(nameof(PointsUserSummaryId))]
        public PointsUserSummary PointsUserSummary { get; set; }
        public TKey PointsUserSummaryId { get; set; }
    }
}
