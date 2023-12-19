using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Clubs;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class ClubMeetingModel
    {
        public DateTime MeetingDate { get; set; }
        public string Name { get; set; }
        public int? ContentValueId { get; set; }
        public string MeetingType { get; set; }
        public string MeetingNotes { get; set; }
        public Guid ClubId { get; set; }
        public virtual ICollection<ClubMeetingRegisterModel> ClubMeetingParticipants { get; set; }
        public bool? CoachAttend { get; set; }
        public string? ImageBase64 { get; set; }
        public string? FileType { get; set; }
        public string? OtherDescription { get; set; }
        public int? TotalCaregiversAttended { get; set; }
        public Guid? EventId { get; set; }

    }

    public class ClubMeetingRegisterModel
    {
        public Guid? PractitionerId { get; set; }
        public bool Attended { get; set; }
    }

    public class CircleTabClubs
    {
        public virtual ICollection<CircleClub> ClubsWithNoLinkedMeetings { get; set; }
        public virtual ICollection<CircleClub> ClubsWithLinkedMeetings { get; set; }
    }

    public class CircleClub
    {
        public string Id { get; set; }
        public string LeagueId { get; set; }
        public string Name { get; set; }
        public string CCMeetingStatus { get; set; } = "No coaching circles held yet";
        public string CCMeetingStatusColor { get; set; } = MetricsColorEnum.Error.ToString();
        public virtual ICollection<ClubMeeting> ClubMeetings { get; set; }
    }
}
