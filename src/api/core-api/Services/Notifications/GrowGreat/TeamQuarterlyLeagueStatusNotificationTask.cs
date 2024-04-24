using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
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
    public class TeamQuarterlyLeagueStatusNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly IPointsEngineService _pointsEngineService;

        private IGenericRepository<League, Guid> _leagueRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public TeamQuarterlyLeagueStatusNotificationTask(
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
            return 
                (DateTime.Now.Month == 12 && DateTime.Now.Day == 24) ||
                (DateTime.Now.Month == 3 && DateTime.Now.Day == 24) ||
                (DateTime.Now.Month == 6 && DateTime.Now.Day == 23) ||
                (DateTime.Now.Month == 9 && DateTime.Now.Day == 23);
        }

        public async Task SendNotifications()
        {
            var leagueIds = _leagueRepo.GetAll().Where(x => x.IsActive).Select(x => x.Id).ToList();

            foreach (var leagueId in leagueIds)
            {
                var currentQuarterText =
                    DateTime.Now.Month == 12 ? "1"
                    : DateTime.Now.Month == 3 ? "2"
                    : DateTime.Now.Month == 6 ? "3"
                    : "4";

                var clinicsWithRankings = _pointsEngineService.GetLeagueWithClinicRankings(leagueId);

                foreach (var clinic in clinicsWithRankings.Clinics)
                {
                    var teamUsers = _healthCareWorkerRepo.GetAll()
                        .Where(x => x.ClinicId == clinic.ClinicId && x.IsActive)
                        .Select(x => x.User)
                        .ToList();

                    // Gold Tier
                    if (
                        (clinicsWithRankings.LeagueTypeName == "Super League" && clinic.PointsTotalForQuarter > 8000)
                        || (clinicsWithRankings.LeagueTypeName == "League" && clinic.PointsTotalForQuarter > 3000))
                    {
                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "TotalTeamPoints",
                                    ReplacementValue = clinic.PointsTotalForQuarter.ToString()
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "Quarter",
                                    ReplacementValue = currentQuarterText
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGGoldTierPointsTeam, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, DateTime.Now.GetEndOfMonth());
                        }
                    }
                    // Silver Tier
                    else if (
                        (clinicsWithRankings.LeagueTypeName == "Super League" && clinic.PointsTotalForQuarter > 5000)
                        || (clinicsWithRankings.LeagueTypeName == "League" && clinic.PointsTotalForQuarter > 1000))
                    {
                        foreach (var user in teamUsers)
                        {
                            var replacements = new List<TagsReplacements>
                            {
                                new TagsReplacements()
                                {
                                    FindValue = "TotalTeamPoints",
                                    ReplacementValue = clinic.PointsTotalForQuarter.ToString()
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "Quarter",
                                    ReplacementValue = currentQuarterText
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGSilverTierPointsTeam, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, DateTime.Now.GetEndOfMonth());
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
                                    FindValue = "TotalTeamPoints",
                                    ReplacementValue = clinic.PointsTotalForQuarter.ToString()
                                },
                                new TagsReplacements()
                                {
                                    FindValue = "Quarter",
                                    ReplacementValue = currentQuarterText
                                }
                            };

                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGBronzeTierPointsTeam, DateTime.Now.Date, user, "", MessageStatusConstants.Blue, replacements, DateTime.Now.GetEndOfMonth());
                        }
                    }
                }
            }
        }
    }
}
