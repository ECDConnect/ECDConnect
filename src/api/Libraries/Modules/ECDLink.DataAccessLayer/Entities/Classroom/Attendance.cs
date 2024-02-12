using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(Attendance))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class Attendance : ClassProgrammeJoin<Guid>, ApplicationUserJoin, ITrackableType
    {
        public string ParentRecordId { get; set; }

        public int MonthOfYear { get; set; }

        public int WeekOfYear { get; set; }

        public int Year { get; set; }

        public bool Attended { get; set; }

        public DateTime AttendanceDate { get; set; }

        [ForeignKey(nameof(ClassroomProgrammeId))]
        public virtual ClassProgramme ClassroomProgramme { get; set; }
        public Guid ClassroomProgrammeId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        public Guid TenantId { get; set; }
    }
}
