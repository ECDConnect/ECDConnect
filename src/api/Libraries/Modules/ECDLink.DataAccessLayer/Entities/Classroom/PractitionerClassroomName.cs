using System;

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
