using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

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
