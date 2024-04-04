using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
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
    public class YearlyPointsSummaryNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public YearlyPointsSummaryNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            
            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _pointsUserSummaryRepo = repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: applicationUserId);
            _healthCareWorkerRepo = repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            // 1st of December
            return DateTime.Now.Month == 12 && DateTime.Now.Day == 1;
        }

        public async Task SendNotifications()
        {
            var healthCareWorkerUsers = _healthCareWorkerRepo.GetAll()
                .Where(x => x.IsActive && x.User.IsActive)
                .Select(x => x.User)
                .ToList();

            var year = DateTime.Now.Year;
            var startOfYear = new DateTime(year, 1, 1);
            foreach (var user in healthCareWorkerUsers)
            {
                var points = _pointsUserSummaryRepo.GetAll()
                    .Where(x => x.UserId == user.Id && x.DateScored > startOfYear)
                    .Sum(x => x.PointsTotal);

                if (points > 0)
                {
                    var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "PointsEarned",
                                ReplacementValue = points.ToString()
                            },
                            new TagsReplacements()
                            {
                                FindValue = "CurrentYear",
                                ReplacementValue = year.ToString()
                            }
                        };

                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsYearlySummary, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(31));
                }
            }
        }
    }
}
