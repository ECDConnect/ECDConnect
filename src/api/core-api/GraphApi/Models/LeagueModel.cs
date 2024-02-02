using ECDLink.DataAccessLayer.Entities.Leagues;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class LeagueModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid LeagueTypeId { get; set; }
        public string LeagueTypeName { get; set; }
        public int NumberOfClubsInLeague { get; set; }

        public LeagueModel(League league, int numberOfClubsInLeague)
        {
            Id = league.Id;
            Name = league.Name;
            LeagueTypeId = league.LeagueTypeId;
            LeagueTypeName = league.LeagueType != null ? league.LeagueType.Name : null;
            NumberOfClubsInLeague = numberOfClubsInLeague;
        }

        public LeagueModel() { }
    }
}