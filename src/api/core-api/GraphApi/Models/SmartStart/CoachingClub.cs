using ECDLink.DataAccessLayer.Entities.Clubs;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class CoachingClub
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string SecondaryText { get; set; }
        public string SecondaryTextColor { get; set; }
        public virtual ICollection<ClubMeeting> ClubMeetings { get; set; }
        public virtual ICollection<ClubMember> ClubMembers { get; set; }
        public virtual ClubLeader ClubLeader { get; set; }
        public virtual ClubSupport ClubSupport { get; set; }
    }

    /*public class CoachingClubMeetings
    {
        public string Id { get; set; }
        public Guid ClubId { get; set; }
        public DateTime MeetingDate { get; set; }
        public string Name { get; set; }
        public int? ContentValueId { get; set; }
        public string MeetingType { get; set; }
        public string MeetingNotes { get; set; }
        public virtual ICollection<CoachingClubMeetingRegisters> ClubMeetingParticipants { get; set; }
    }

    public class CoachingClubMeetingRegisters
    {
        public string Id { get; set; }
        public string ClubMeetingId { get; set; }
        public Guid? PractitionerId { get; set; }
        public bool Attended { get; set; }
    }*/
}
