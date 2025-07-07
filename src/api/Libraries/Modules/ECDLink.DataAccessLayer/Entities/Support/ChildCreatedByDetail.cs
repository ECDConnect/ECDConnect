using System;

namespace ECDLink.DataAccessLayer.Entities
{
    public class ChildCreatedByDetail
    {
        public string FullName { get; set; }
        public string ChildUserId { get; set; }
        public string CreatedByName { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedByDate { get; set; }
        public string ClassroomName { get; set; }
        public string PractitionerName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ProfileImageUrl { get; set; }
        public string ProgrammeName { get; set; }
        public string PractitionerUserId { get; set; }

    }
}
