using ECDLink.Security.Attributes;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class LearnerAttendanc
    {
       Attendance Attendance { get; set; }
    }
}
