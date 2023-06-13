using ECDLink.DataAccessLayer.Entities.Interfaces;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class TrackAttendanceModel : ITrackableType
    {
        public Guid ClassroomProgrammeId { get; set; }

        public string ProgrammeOwnerId { get; set; }

        public List<TrackAttendanceAttendeeModel> Attendees { get; set; }

        public DateTime AttendanceDate { get; set; }
    }

    public class TrackAttendanceAttendeeModel
    {
        public string UserId { get; set; }
        public bool Attended { get; set; }
    }
}
