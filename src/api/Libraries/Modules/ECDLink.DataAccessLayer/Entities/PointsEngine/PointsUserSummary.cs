using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PointsEngine

{
    [Table(nameof(PointsUserSummary))]
    public class PointsUserSummary : PointsUserSummary<Guid>
    {
    }

    public class PointsUserSummary<TKey> : EntityBase<TKey>, ApplicationUserJoin, PointsLibraryJoin<TKey>
         where TKey : IEquatable<TKey>
    {        
        public int TimesScored { get; set; }
        public int PointsTotal { get; set; }
        public int PointsYTD { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public TKey PointsLibraryId { get; set; }

        [ForeignKey(nameof(PointsLibraryId))]
        public virtual PointsLibrary PointsLibrary { get; set; }
    }

    public interface PointsUserSummaryJoin<TKey>
    {
        [ForeignKey(nameof(PointsUserSummaryId))]
        public PointsUserSummary PointsUserSummary { get; set; }
        public TKey PointsUserSummaryId { get; set; }
    }
}
