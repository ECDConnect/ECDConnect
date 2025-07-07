using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(ProgrammeAttendanceReason))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ProgrammeAttendanceReason : ProgrammeAttendanceReason<Guid>
    {
    }

    public class ProgrammeAttendanceReason<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Reason { get; set; }
    }

    public interface ProgrammeAttendanceReasonJoin<TKey>
    {
        [ForeignKey(nameof(ProgrammeAttendanceReasonId))]
        public ProgrammeAttendanceReason ProgrammeAttendanceReason { get; set; }
        public TKey ProgrammeAttendanceReasonId { get; set; }
    }
}
