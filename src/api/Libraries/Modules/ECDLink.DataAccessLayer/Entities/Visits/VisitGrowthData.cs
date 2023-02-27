using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.VisitGrowthDatas
{
    [Table(nameof(VisitGrowthData))]
    public class VisitGrowthData : VisitGrowthData<Guid>
    {
    }

    public class VisitGrowthData<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {

        public string Section { get; set; }
        public string Name { get; set; }
        public int Month { get; set; }
        public double Weight { get; set; }
        public double Height { get; set; }
    }

    public interface VisitGrowthDataJoin<TKey>
    {
        [ForeignKey(nameof(VisitGrowthDataId))]
        public VisitGrowthData VisitGrowthData { get; set; }
        public TKey VisitGrowthDataId { get; set; }
    }
}
