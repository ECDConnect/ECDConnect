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
        public string MeetingType { get; set; } = Constants.CoachingCircleSettings.meeting_type_coach_circle;
        public string MeetingNotes { get; set; }
        public Guid ClubId { get; set; }
        public virtual ICollection<ClubMeetingRegisterModel> ClubMeetingParticipants { get; set; }
    }

    public class ClubMeetingRegisterModel
    {
        public Guid? PractitionerId { get; set; }
        public bool Attended { get; set; }
    }

    public class CircleTabClubs
    {
        public virtual ICollection<Club> ClubsWithNoLinkedMeetings { get; set; }
        public virtual ICollection<Club> ClubsWithLinkedMeetings { get; set; }
    }
}
