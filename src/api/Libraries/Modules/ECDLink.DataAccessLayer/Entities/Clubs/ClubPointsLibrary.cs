using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubPointsLibrary))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubPointsLibrary : ClubPointsLibrary<Guid>
    {       
    }

    public class ClubPointsLibrary<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Type { get; set; }
        public string Activity { get; set; }
        public string SubActivity { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
        public int MaxPointsYearly { get; set; }
        public bool CalculatedAtMonthEnd { get; set; }
        public bool CalculatedAtYearEnd { get; set; }
    }

    public interface ClubPointsLibraryJoin<TKey>
    {
        [ForeignKey(nameof(ClubPointsLibraryId))]
        public Club ClubPointsLibrary { get; set; }
        public TKey ClubPointsLibraryId { get; set; }
    }
}
