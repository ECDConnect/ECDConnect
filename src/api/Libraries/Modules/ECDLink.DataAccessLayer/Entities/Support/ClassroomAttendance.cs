using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class ClassroomAttendance
    {
        public string ClassroomName { get; set; }

        public string ClassroomId { get; set; }

        public List<Attendance> ClassAttendance { get; set; }
    }
}
