using ECDLink.DataAccessLayer.Entities.Leagues;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class LeagueClub
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual LeagueType LeagueType { get; set; }
        public virtual ICollection<LeagueClubDetail> Clubs { get; set; }
    }
    public class LeagueClubDetail
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string CoachName { get; set; }
        public double Points { get; set; }
    }

}
