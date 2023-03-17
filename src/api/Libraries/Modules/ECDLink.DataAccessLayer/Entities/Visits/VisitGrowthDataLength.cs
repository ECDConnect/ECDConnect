using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits {

    [Table(nameof(VisitGrowthDataLength))]
    public class VisitGrowthDataLength : VisitGrowthDataLength<Guid> {
    }

    public class VisitGrowthDataLength<TKey> : EntityBase<TKey> where TKey : IEquatable<TKey> {
        public string Section { get; set; }
        public double Length { get; set; }
        public double? Median { get; set; }
        public double? SD3neg { get; set; }
        public double? SD2neg { get; set; }
        public double? SD2 { get; set; }
        public double? SD3 { get; set; }
    }

    public interface VisitGrowthDataLengthJoin<TKey> {
        [ForeignKey(nameof(VisitGrowthDataLengthId))]
        public VisitGrowthDataLength VisitGrowthDataLength { get; set; }
        public TKey VisitGrowthDataLengthId { get; set; }
    }
}
