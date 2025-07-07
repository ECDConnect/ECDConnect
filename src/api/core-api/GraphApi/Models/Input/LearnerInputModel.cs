using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Input
{
    public class LearnerInputModel
    {
        public Guid UserId { get; set; }
        public Guid ClassroomGroupId { get; set; }
        public DateTime StartedAttendance { get; set; }
        public DateTime StoppedAttendance { get; set; }
        public bool IsActive { get; set; }
    }
}
