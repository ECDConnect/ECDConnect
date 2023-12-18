using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Users;
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
        public ClubCoachModel ClubCoach { get; set; }
        public ClubLeaderModel ClubLeader { get; set; }
        public ClubSupportModel ClubSupport { get; set; }
        public List<ClubMemberModel> ClubMembers { get; set; }        

        public ClubModel(Club club, Coach coach, int pointsTotal, int maxPointsTotal, int leagueRanking, int numberOfClubsInLeague)
        {
            var clubLeader = club.ClubLeaders.Where(x => x.IsActive && x.DateAccepted.HasValue && x.DateAssigned.HasValue).FirstOrDefault();

            Id = club.Id;
            Name = club.Name;
            PointsTotal = pointsTotal;
            MaxPointsTotal = maxPointsTotal;
            LeagueRanking = leagueRanking;
            ClubCoach = new ClubCoachModel(coach);
            League = club.League != null ? new LeagueModel(club.League, numberOfClubsInLeague) : null;
            ClubMembers = club.ClubMembers.Select(x => new ClubMemberModel(x)).ToList();
            ClubLeader = clubLeader != null
                ? new ClubLeaderModel(clubLeader) 
                : null;
            ClubSupport = club.ClubSupport.Any() ? new ClubSupportModel(club.ClubSupport.First()) : null;
        }

        public ClubModel()
        {
        }
    }

    public class DetailClubModel: ClubModel
    {
        public ClubLeaderModel IncomingClubLeader { get; set; }
        public List<IssueTask> IssuesTasks { get; set; }
        public List<ClubActivity> ClubActivities { get; set; }

        public DetailClubModel(Club club, Coach coach, int pointsTotal, int maxPointsTotal, int leagueRanking, int numberOfClubsInLeague, List<IssueTask> tasks, List<ClubActivity> activities)
            : base(club, coach, pointsTotal, maxPointsTotal, leagueRanking, numberOfClubsInLeague)
        {
            var incomingCLubLeader = club.ClubLeaders.Where(x => x.IsActive && !x.DateAccepted.HasValue && x.DateAssigned.HasValue).FirstOrDefault();

            IncomingClubLeader = incomingCLubLeader != null
                 ? new ClubLeaderModel(incomingCLubLeader)
                 : null;

            IssuesTasks = tasks;
            ClubActivities = activities;
        }
    }

    
}