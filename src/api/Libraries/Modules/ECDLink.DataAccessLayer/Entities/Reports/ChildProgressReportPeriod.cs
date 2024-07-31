using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Reports
{
    [Table("ChildProgressReportPeriod")]
    [EntityPermission(PermissionGroups.REPORTING)]
    public class ChildProgressReportPeriod : ChildProgressReportPeriod<Guid>
    {

    }

    public class ChildProgressReportPeriod<TKey> : EntityBase<TKey>, ClassroomJoin<Guid>
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(ClassroomId))]
        public virtual Classroom.Classroom Classroom { get; set; }

        public Guid ClassroomId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public interface ChildProgressReportPeriodJoin<TKey>
    {
        [ForeignKey(nameof(ChildProgressReportPeriodId))]
        public ChildProgressReportPeriod ChildProgressReportPeriod { get; set; }
        public TKey ChildProgressReportPeriodId { get; set; }
    }
}
