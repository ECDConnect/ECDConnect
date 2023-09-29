using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Users;
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
        public virtual ICollection<ClubLeader> ClubLeaders { get; set; } // there can be 2 active club leaders.  One appointed and then a newly appointed one who has not accepted yet. 
        public virtual ClubSupport ClubSupport { get; set; }
        public virtual League League { get; set; }
        public virtual Coach Coach { get; set; }
        public string LeaguePosition { get; set; } // not sure what data type this is at the moment - integration prop
        public int TotalClubPoints { get; set; }
        public int MaxClubPoints { get; set; }
        public virtual ICollection<ClubActivity> ClubActivities { get; set; }
    }

    public class CoachingClubDetails
    {
        public virtual Coach Coach { get; set; }
        public virtual List<CoachingClub> CoachingClubs { get; set; }
    }

    public class CoachingClubBase
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string SecondaryText { get; set; }
        public string SecondaryTextColor { get; set; }
    }

    public class ClubActivity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Points { get; set; }
    }

    public class NewClubInput
    {
        public string Name { get; set; }
        public string UserId { get; set; }
        public virtual List<string> NewClubMembers { get; set; }
        public virtual List<string> TransferredClubMembers { get; set; }
    }

    public class NewClubMember
    {
        public string ClubId { get; set; }
        public virtual List<string> PractitionerIds { get; set; }
    }
    
}
