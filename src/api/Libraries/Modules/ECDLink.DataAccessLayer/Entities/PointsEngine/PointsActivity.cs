using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PointsEngine

{
    [Table(nameof(PointsActivity))]
    public class PointsActivity : PointsActivity<Guid>
    {
    }

    public class PointsActivity<TKey> : EntityBase<TKey> ,
        PointsCategoryJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public int Points { get; set; }
        public int? MaxPointsIndividualMonthly { get; set; }
        public int? MaxPointsIndividualYearly { get; set; }
        public Guid? PointsCategoryId { get; set; }
        public virtual PointsCategory PointsCategory { get; set; }
    }

    public interface PointsActivityJoin<TKey>
    {
        [ForeignKey(nameof(PointsActivityId))]
        public PointsActivity PointsActivity { get; set; }
        public TKey PointsActivityId { get; set; }
    }
}
