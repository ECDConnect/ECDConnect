using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class ClubData
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ClubMeetings> ClubMeetings { get; set; }
    }

    public class ClubMeetings
    {
        public string Id { get; set; }
        public Guid ClubId { get; set; }
        public DateTime MeetingDate { get; set; }
        public string Name { get; set; }
        public int? ContentValueId { get; set; }
        public string MeetingType { get; set; }
        public string MeetingNotes { get; set; }
        public virtual ICollection<ClubMeetingRegisters> ClubMeetingParticipants { get; set; }
    }

    public class ClubMeetingRegisters
    {
        public string Id { get; set; }
        public string ClubMeetingId { get; set; }
        public Guid? PractitionerId { get; set; }
        public bool Attended { get; set; }
    }
}
