using ECDLink.DataAccessLayer.Entities.Classroom;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class AttendanceList
    {
        public string PractitionerUserId { get; set; }
        public string PractitionerRemoterId { get; set; }
        public string LearnerUserId { get; set; }
        public string LearnerRemoteId { get; set; }
        public Dictionary<string, string> WeeklyAttendance { get; set; }
        public List<Attendance> AttendanceData { get; set; }
        public int daysPresent { get; set; } = 0;
        public int daysAbsent { get; set; } = 0;

    }
}
