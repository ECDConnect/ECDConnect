using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
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
    public class MonthlyEarnMorePointsNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;
        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public MonthlyEarnMorePointsNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            
            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _pointsUserSummaryRepo = repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: applicationUserId);
            _clinicRepo = repositoryFactory.CreateGenericRepository<Clinic>(userContext: applicationUserId);
            _healthCareWorkerRepo = repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.IsTenDaysUntilMonthEnd();
        }

        public async Task SendNotifications()
        {
            var clinicIds = _clinicRepo.GetAll().Where(x => x.IsActive).Select(x => x.Id).ToList();

            var notificationTasks = new List<Task>();
            foreach (var clinicId in clinicIds)
            {
                var teamUsers = _healthCareWorkerRepo.GetAll()
                    .Where(x => x.ClinicId == clinicId && x.IsActive)
                    .Select(x => x.User)
                    .ToDictionary(x => x.Id, x => x);

                var teamUserIds = teamUsers.Select(x => x.Key).ToList();

                var monthStart = DateTime.Now.GetStartOfMonth();

                var usersPoints = _pointsUserSummaryRepo.GetAll()
                    .Where(x => x.UserId.HasValue && teamUserIds.Contains(x.UserId.Value) && x.DateScored >= monthStart)
                    .GroupBy(x => x.UserId)
                    .Select(x => new { UserId = x.First().UserId.Value, PointsTotal = x.Sum(y => y.PointsTotal) })
                    .OrderByDescending(x => x.PointsTotal)
                    .ToList();

                // Add in any missing users (users who have not yet earned any points this month)
                foreach (var user in teamUsers)
                {
                    if (!usersPoints.Any(x => x.UserId == user.Key))
                    {
                        usersPoints.Add(new { UserId = user.Key, PointsTotal = 0 });
                    }
                }
                
                var medianScore = usersPoints[usersPoints.Count/2].PointsTotal;
                foreach (var user in usersPoints)
                {
                    if (user.PointsTotal >= Constants.GrowGreatPointsAmounts.MontlyPointsMaxForHealthCareWorker)
                    {
                        continue;
                    }

                    // If most other CHW's in the team have earned more points
                    if (user.PointsTotal < medianScore)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGEarningPoints, DateTime.Now.Date, teamUsers[user.UserId], "", MessageStatusConstants.Blue, null, DateTime.Now.AddDays(10));
                    }
                    // If most other CHWs in the team have NOT earned more points
                    else
                    {
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "AveragePoints",
                                ReplacementValue = user.PointsTotal.ToString()
                            }
                        };

                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGEarningXPoints, DateTime.Now.Date, teamUsers[user.UserId], "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(10));
                    }
                }
            }
        }
    }
}
