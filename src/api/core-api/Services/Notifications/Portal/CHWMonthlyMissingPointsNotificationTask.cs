using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
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

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class CHWMonthlyMissingPointsNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;
        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public CHWMonthlyMissingPointsNotificationTask(
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
            // On the 25th of every month IF the CHW has earned zero points so far in the current month (ie from the 1st to the 25th).
            return DateTime.Now.Day == 25;
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
                    .Select(x => new { UserId = x.First().UserId.Value, PointsTotal = x.Sum(y => y.PointsTotal), FirstName = x.First().User.FirstName, FullName = x.First().User.FullName })
                    .OrderByDescending(x => x.PointsTotal)
                    .ToList();

                // Add in any missing users (users who have not yet earned any points this month)
                foreach (var user in teamUsers)
                {
                    if (!usersPoints.Any(x => x.UserId == user.Key))
                    {
                        usersPoints.Add(new { UserId = user.Key, PointsTotal = 0, FirstName = user.Value.FirstName, FullName = user.Value.FullName });
                    }
                }

                foreach (var user in usersPoints)
                {
                    if (user.PointsTotal == 0)
                    {
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "CurrentMonth",
                                ReplacementValue = DateTime.Now.ToString("MMMM yyyy")
                            },
                            new TagsReplacements()
                            {
                                FindValue = "CHWFirstName",
                                ReplacementValue = user.FirstName
                            },
                            new TagsReplacements()
                            {
                                FindValue = "CHWFullName",
                                ReplacementValue = user.FullName
                            },
                            new TagsReplacements()
                            {
                                FindValue = "UserId",
                                ReplacementValue = user.UserId.ToString()
                            }
                        };
                        // Valid for 7 days after the notification was triggered.
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPortalCHWMissingMonthlyPoints, DateTime.Now.Date, teamUsers[user.UserId], "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, false, null,
                            new List<RelatedEntity> { new RelatedEntity(user.UserId, "ApplicationUser") });
                    }
                }
            }
        }
    }
}
