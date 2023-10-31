using ECDLink.DataAccessLayer.Entities.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;

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
        public string CoachUserId { get; set; }
        public ClubLeaderModel ClubLeader { get; set; }
        public ClubSupportModel ClubSupport { get; set; }
        public List<ClubMemberModel> ClubMembers { get; set; }        

        public ClubModel(Club club, int pointsTotal, int maxPointsTotal, int leagueRanking)
        {
            Id = club.Id;
            Name = club.Name;
            PointsTotal = pointsTotal;
            MaxPointsTotal = maxPointsTotal;
            LeagueRanking = leagueRanking;
            CoachUserId = club.UserId;
            League = club.League != null ? new LeagueModel(club.League) : null;
            ClubMembers = club.ClubMembers.Select(x => new ClubMemberModel(x)).ToList();
            ClubLeader = club.ClubLeaders.Any() ? new ClubLeaderModel(club.ClubLeaders.First()) : null;
            ClubSupport = club.ClubSupport.Any() ? new ClubSupportModel(club.ClubSupport.First()) : null;
        }

        public ClubModel()
        {
        }
    }
}