using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Reports
{
    [Table("ChildProgressReport")]
    [EntityPermission(PermissionGroups.REPORTING)]
    public class ChildProgressReport : ChildProgressReport<Guid>
    {

    }

    public class ChildProgressReport<TKey> : EntityBase<TKey>, ChildJoin<TKey>, ChildProgressReportPeriodJoin<TKey>, ApplicationUserJoin
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(ChildId))]
        public virtual Child Child { get; set; }
        public TKey ChildId { get; set; }
        public string ReportContent { get; set; }
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
        public DateTime? DateCompleted { get; set; }

        [ForeignKey(nameof(ChildProgressReportPeriodId))]
        public virtual ChildProgressReportPeriod ChildProgressReportPeriod { get; set; }
        public TKey ChildProgressReportPeriodId { get; set; }
        public DateTime? ObservationsCompleteDate { get; set; }
    }

    public interface ChildProgressReportJoin<TKey>
    {
        [ForeignKey(nameof(ChildProgressReportId))]
        public ChildProgressReport ChildProgressReport { get; set; }
        public TKey ChildProgressReportId { get; set; }
    }
}
