using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.PointsEngine

{
    [Table(nameof(PointsLibrary))]
    public class PointsLibrary : PointsLibrary<Guid>
    {
    }

    public class PointsLibrary<TKey> : EntityBase<TKey> 
         where TKey : IEquatable<TKey>
    {
        public string Activity { get; set; }
        public string SubActivity { get; set; }
        public string Description { get; set; }
        public string TodoDescription { get; set; }
        public int Points { get; set; }
        public int? MaxPointsIndividualMonthly { get; set; }
        public int MaxPointsNonPrincipalMonthly { get; set; }
        public int MaxPointsNonPrincipalYearly { get; set; }
        public int MaxPointsPrincipalMonthly { get; set; }
        public int MaxPointsPrincipalYearly { get; set; }
        public bool? CalculatedAtMonthEnd { get; set; }
        public bool? CalculatedAtYearEnd { get; set; }
    }

    public interface PointsLibraryJoin<TKey>
    {
        [ForeignKey(nameof(PointsLibraryId))]
        public PointsLibrary PointsLibrary { get; set; }
        public TKey PointsLibraryId { get; set; }
    }
}
