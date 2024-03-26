using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using HotChocolate;
using NPOI.HSSF.Record;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public class TeamQuarterlyLeagueRankNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly IPointsEngineService _pointsEngineService;

        private IGenericRepository<League, Guid> _leagueRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public TeamQuarterlyLeagueRankNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] IPointsEngineService pointsEngineService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _pointsEngineService = pointsEngineService;
            
            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _leagueRepo = repositoryFactory.CreateGenericRepository<League>(userContext: applicationUserId);
            _healthCareWorkerRepo = repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Day == 1 &&
                (DateTime.Now.Month == 3 || DateTime.Now.Month == 6 || DateTime.Now.Month == 12);
        }

        public async Task SendNotifications()
        {
            var leagueIds = _leagueRepo.GetAll().Where(x => x.IsActive).Select(x => x.Id).ToList();

            foreach (var leagueId in leagueIds)
            {
                var clinicsWithRankings = _pointsEngineService.GetLeagueWithClinicRankings(leagueId);

                var topTeam = clinicsWithRankings.Clinics.FirstOrDefault();



                foreach (var clinic in clinicsWithRankings.Clinics)
                {
                    var teamUsers = _healthCareWorkerRepo.GetAll()
                        .Where(x => x.ClinicId == clinic.ClinicId && x.IsActive)
                        .Select(x => x.User)
                        .ToList();

                    // Top ranked
                    if (clinic.LeagueRankingForQuarter == 1)
                    {
                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "TotalTeamPoints",
                                    ReplacementValue = clinic.PointsTotalForQuarter.ToString()
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTopPointsTeam, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
                        }
                    }
                    // Top 25%
                    else if ((float)clinicsWithRankings.Clinics.Where(x => x.PointsTotalForQuarter < clinic.PointsTotalForQuarter).Count() / clinicsWithRankings.Clinics.Count() * 100 >= 75)
                    {
                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "Ranking",
                                    ReplacementValue = clinic.LeagueRankingForQuarter.ToString()
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "TotalTeamPoints",
                                    ReplacementValue = clinic.PointsTotalForQuarter.ToString()
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "PointsBehindWinningTeam",
                                    ReplacementValue = (topTeam.PointsTotalForQuarter - clinic.PointsTotalForQuarter).ToString()
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTop25PercPointsTeam, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
                        }
                    }
                    else
                    {
                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "Ranking",
                                    ReplacementValue = clinic.LeagueRankingForQuarter.ToString()
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "TotalTeamPoints",
                                    ReplacementValue = clinic.PointsTotalForQuarter.ToString()
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGBottom75PercPointsTeam, DateTime.Now.Date, user, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
                        }
                    }
                }
            }
        }
    }
}
