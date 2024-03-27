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
    public class TopPointsEarnerNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;
        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public TopPointsEarnerNotificationTask(
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
            return DateTime.Now.IsLastDayOfMonth();
        }

        public async Task SendNotifications()
        {
            var clinicIds = _clinicRepo.GetAll().Where(x => x.IsActive).Select(x => x.Id).ToList();

            var notificationTasks = new List<Task>();
            foreach (var clinicId in clinicIds)
            {
                var teamUserIds = _healthCareWorkerRepo.GetAll()
                    .Where(x => x.ClinicId == clinicId && x.IsActive)
                    .Select(x => x.UserId)
                    .ToList();

                var monthStart = DateTime.Now.GetStartOfMonth();

                var usersPoints = _pointsUserSummaryRepo.GetAll()
                    .Where(x => x.UserId.HasValue && teamUserIds.Contains(x.UserId.Value) && x.DateScored >= monthStart)
                    .GroupBy(x => x.UserId)
                    .Select(x => new { User = x.First().User, PointsTotal = x.Sum(y => y.PointsTotal) })
                    .OrderByDescending(x => x.PointsTotal)
                    .ToList();

                if (!usersPoints.Any())
                {
                    continue;
                }

                var topScore = usersPoints.First().PointsTotal;

                if (topScore == 0) 
                {
                    continue;
                }

                foreach (var user in usersPoints)
                {
                    if (user.PointsTotal == topScore)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTopPointsEarner, DateTime.Now.Date, user.User, "", MessageStatusConstants.Green, null, DateTime.Now.AddDays(7));
                    }
                }                
            }
        }
    }
}
