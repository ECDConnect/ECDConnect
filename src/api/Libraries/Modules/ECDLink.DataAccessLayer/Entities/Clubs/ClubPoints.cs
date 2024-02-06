using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubPoints))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubPoints : ClubPoints<Guid>
    {       
    }

    public class ClubPoints<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public Guid? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public TKey ClubPointsLibraryId { get; set; }
        [ForeignKey(nameof(ClubPointsLibraryId))]
        public virtual ClubPointsLibrary ClubPointsLibrary { get; set; }
        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int Points { get; set; }
        public int PointsYTD { get; set; }
        public string Comment { get; set; }
    }

    public interface ClubPointsJoin<TKey>
    {
        [ForeignKey(nameof(ClubPointsId))]
        public Club ClubPoints { get; set; }
        public TKey ClubPointsId { get; set; }
    }
}
