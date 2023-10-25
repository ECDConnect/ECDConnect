using ECDLink.DataAccessLayer.Entities.Clubs;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClubModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int PointsTotal { get; set; }
        public int MaxPointsTotal { get; set; }
        public int LeagueRanking { get; set; }
        public LeagueModel League { get; set; }

        public ClubModel(Club club, int pointsTotal, int maxPointsTotal, int leagueRanking)
        {
            Id = club.Id;
            Name = club.Name;
            PointsTotal = pointsTotal;
            MaxPointsTotal = maxPointsTotal;
            LeagueRanking = leagueRanking;
            League = club.League != null ? new LeagueModel(club.League) : null;
        }

        public ClubModel()
        {
        }
    }
}