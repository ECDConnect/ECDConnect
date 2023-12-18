using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class LeagueClubsModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid LeagueTypeId { get; set; }
        public string LeagueTypeName { get; set; }

        public List<ClubPointsSummaryModel> Clubs { get; set; }
    }

    public class ClubPointsSummaryModel
    {
        public Guid ClubId { get; set; }
        public string ClubName { get; set; }
        public int LeagueRank { get; set; }
        public int PointsTotal { get; set; }
        public string CoachName { get; set; }
    }
}