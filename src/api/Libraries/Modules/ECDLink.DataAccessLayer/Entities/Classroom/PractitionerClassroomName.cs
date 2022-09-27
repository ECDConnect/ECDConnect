using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Classroom
{
    public class PractitionerClassroomName
    {
        public Guid ClassRoomId { get; set; }
        public Guid ClassroomGroupId { get; set; }
        public string ClassroomName { get; set; }
        public string PrincipalName { get; set; }
        public string CoachName { get; set; }

    }
}
