using ECDLink.DataAccessLayer.Entities.Leagues;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    // TODO - rename when I can remove the old LeagueModel
    public class GrowGreatLeagueModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid LeagueTypeId { get; set; }
        public string LeagueTypeName { get; set; }

        public GrowGreatLeagueModel(League league) 
        { 
            Id = league.Id;
            Name = league.Name;
            StartDate = league.StartDate;
            EndDate = league.EndDate;
            LeagueTypeId = league.LeagueTypeId;
            
            if (league.LeagueType != null )
            {
                LeagueTypeName = league.LeagueType.Name;
            }
        }
    }
}
