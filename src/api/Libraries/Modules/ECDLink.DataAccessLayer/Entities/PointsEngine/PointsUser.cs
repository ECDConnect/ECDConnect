using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PointsEngine

{
    [Table(nameof(PointsUser))]
    public class PointsUser : PointsUser<Guid>
    {
    }

    public class PointsUser<TKey> : EntityBase<TKey>, ApplicationUserJoin, PointsLibraryJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public int Points { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string? Comment { get; set; }
        public Guid? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public TKey PointsLibraryId { get; set; }

        [ForeignKey(nameof(PointsLibraryId))]
        public virtual PointsLibrary PointsLibrary { get; set; }
    }

    public interface PointsUserJoin<TKey>
    {
        [ForeignKey(nameof(PointsUserId))]
        public PointsUser PointsUser { get; set; }
        public TKey PointsUserId { get; set; }
    }
}
