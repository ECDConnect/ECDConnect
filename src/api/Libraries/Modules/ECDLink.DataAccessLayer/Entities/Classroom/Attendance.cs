using ECDLink.Security.Attributes;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.DataAccessLayer.Entities.Interfaces;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [Table(nameof(Attendance))]
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class Attendance : ClassProgrammeJoin<Guid>, ApplicationUserJoin
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
        public string UserId { get; set; }        
    }
}
