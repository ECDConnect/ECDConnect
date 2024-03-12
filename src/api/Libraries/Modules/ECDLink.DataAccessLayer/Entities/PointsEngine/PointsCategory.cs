using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PointsEngine

{
    [Table(nameof(PointsCategory))]
    public class PointsCategory : PointsCategory<Guid>
    {
    }

    public class PointsCategory<TKey> : EntityBase<TKey> 
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
    }

    public interface PointsCategoryJoin<TKey>
    {
        [ForeignKey(nameof(PointsCategoryId))]
        public PointsCategory PointsCategory { get; set; }
        public TKey PointsCategoryId { get; set; }
    }
}
