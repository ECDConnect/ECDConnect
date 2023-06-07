using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedClub : BasicMappedBaseEntity
    {
        public string Name { get; set; }
        public int NumberOfFranchisees { get; set; }
        public MappedCoach Coach { get; set; }
    }

    public class MappedClubMeeting : BasicMappedBaseEntity
    {
        public string Name { get; set; }
        public DateTime MeetingDate { get; set; }
        public MappedClub Club { get; set; }
    }

    public class MappedClubMeetingRegister : BasicMappedBaseEntity
    {
        public string Name { get; set; }
        public bool Attended { get; set; } = true;
        public MappedClubMeeting ClubMeeting { get; set; }
        public MappedFranchisee Franchisee { get; set;}
    }
    
}
