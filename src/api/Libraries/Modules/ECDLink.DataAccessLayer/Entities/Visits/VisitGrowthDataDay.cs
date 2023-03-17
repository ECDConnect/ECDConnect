using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits {

    [Table(nameof(VisitGrowthDataDay))]
    public class VisitGrowthDataDay : VisitGrowthDataDay<Guid> {
    }

    public class VisitGrowthDataDay<TKey> : EntityBase<TKey> where TKey : IEquatable<TKey> {
        public string Section { get; set; }
        public int Day { get; set; }
        public double? Median { get; set; }
        public double? SD3neg { get; set; }
        public double? SD2neg { get; set; }
        public double? SD2 { get; set; }
        public double? SD3 { get; set; }
    }

    public interface VisitGrowthDataDayJoin<TKey> {
        [ForeignKey(nameof(VisitGrowthDataDayId))]
        public VisitGrowthDataDay VisitGrowthDataDay { get; set; }
        public TKey VisitGrowthDataDayId { get; set; }
    }
}
