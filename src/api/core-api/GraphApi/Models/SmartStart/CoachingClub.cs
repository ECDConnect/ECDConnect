using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Leagues;
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
        public virtual League League { get; set; }
        public string LeaguePosition { get; set; } // not sure what data type this is at the moment - integration prop
        public int TotalClubPoints { get; set; }
        public int MaxClubPoints { get; set; }
    }

}
