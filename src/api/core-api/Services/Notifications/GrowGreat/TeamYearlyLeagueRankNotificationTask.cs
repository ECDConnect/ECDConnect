using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public class TeamYearlyLeagueRankNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly IPointsEngineService _pointsEngineService;

        private IGenericRepository<League, Guid> _leagueRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public TeamYearlyLeagueRankNotificationTask(
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
            return DateTime.Now.Day == 1 && DateTime.Now.Month == 10;
        }

        public async Task SendNotifications()
        {
            var leagueIds = _leagueRepo.GetAll().Where(x => x.IsActive).Select(x => x.Id).ToList();
            var removeDate = new DateTime(DateTime.Now.Year, 10, 15, 23, 59, 59);

            foreach (var leagueId in leagueIds)
            {
                var clinicsWithRankings = _pointsEngineService.GetLeagueWithClinicRankings(leagueId);

                var topTeam = clinicsWithRankings.Clinics.OrderByDescending(x => x.LeagueRankingForYear).FirstOrDefault();

                foreach (var clinic in clinicsWithRankings.Clinics)
                {
                    var teamUsers = _healthCareWorkerRepo.GetAll()
                        .Where(x => x.ClinicId == clinic.ClinicId && x.IsActive)
                        .Select(x => x.User)
                        .ToList();

                    // Top 3
                    if (clinic.LeagueRankingForYear < 4)
                    {
                        var rankText = clinic.LeagueRankingForYear == 1 ? "st" : clinic.LeagueRankingForYear == 2 ? "nd" : "rd";

                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "CurrentYear",
                                    ReplacementValue = DateTime.Now.Year.ToString(),
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "Placement",
                                    ReplacementValue = $"{clinic.LeagueRankingForYear}{rankText}"
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsTeamPlacement, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, removeDate);
                        }
                    }
                    // Top 25%
                    else if ((float)clinicsWithRankings.Clinics.Where(x => x.PointsTotalForYear < clinic.PointsTotalForYear).Count() / clinicsWithRankings.Clinics.Count() * 100 >= 75)
                    {
                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "CurrentYear",
                                    ReplacementValue = DateTime.Now.Year.ToString(),
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "Placement",
                                    ReplacementValue = clinic.LeagueRankingForYear.ToString(),
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsTeamPlacementNotTop3, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, removeDate);
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
                                    FindValue = "CurrentYear",
                                    ReplacementValue = DateTime.Now.Year.ToString(),
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "Placement",
                                    ReplacementValue = clinic.LeagueRankingForYear.ToString(),
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsTeamPlacementBottom75Perc, DateTime.Now.Date, user, "", MessageStatusConstants.Blue, replacements, removeDate);
                        }
                    }
                }
            }
        }
    }
}
