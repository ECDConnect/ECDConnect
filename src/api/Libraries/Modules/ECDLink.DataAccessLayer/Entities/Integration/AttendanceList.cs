using ECDLink.DataAccessLayer.Entities.Classroom;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class AttendanceList
    {
        public string PractitionerRemoterId { get; set; }
        public string LearnerRemoteId { get; set; }
        public Dictionary<string, string> WeeklyAttendance { get; set; }
        public int DaysPresent { get; set; } = 0;
        public int DaysAbsent { get; set; } = 0;

    }
}
