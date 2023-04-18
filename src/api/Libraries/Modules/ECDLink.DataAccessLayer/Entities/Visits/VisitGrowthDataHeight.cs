using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits {

    [Table(nameof(VisitGrowthDataHeight))]
    public class VisitGrowthDataHeight : VisitGrowthDataHeight<Guid> {
    }

    public class VisitGrowthDataHeight<TKey> : EntityBase<TKey> where TKey : IEquatable<TKey> {
        public string Section { get; set; }
        public double Height { get; set; }
        public double? Median { get; set; }
        public double? SD3neg { get; set; }
        public double? SD2neg { get; set; }
        public double? SD2 { get; set; }
        public double? SD3 { get; set; }
    }

    public interface VisitGrowthDataHeightJoin<TKey> {
        [ForeignKey(nameof(VisitGrowthDataHeightId))]
        public VisitGrowthDataHeight VisitGrowthDataHeight { get; set; }
        public TKey VisitGrowthDataHeightId { get; set; }
    }
}
