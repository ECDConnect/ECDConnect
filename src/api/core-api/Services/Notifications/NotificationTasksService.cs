using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using System.Linq;
using ECDLink.DataAccessLayer.Repositories;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.SmartStart.Services.Interfaces;
using Microsoft.Extensions.Logging;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Managers;
using Microsoft.EntityFrameworkCore;
using EcdLink.Api.CoreApi.Managers.Visits;
using NPOI.SS.Formula.Functions;

namespace EcdLink.Api.CoreApi.Services
{
    public partial class NotificationTasksService : INotificationTasksService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ApplicationUserManager _userManager;
        private readonly INotificationService _notificationService;
        private readonly IPointsEngineService _pointsService;
        private ILogger<NotificationTasksService> _logger;

        public NotificationTasksService(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            [Service] ILogger<NotificationTasksService> logger,
            HierarchyEngine hierarchyEngine,
            IPointsEngineService pointsService)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;
            _pointsService = pointsService;
            _logger = logger;
        }

        public async Task DailyUserOfflineNotification()
        {
            _logger.LogInformation("DailyUserOfflineNotification started at " + DateTime.Now);

            try
            {
                var adminId = _hierarchyEngine.GetAdminUserId();

                _logger.LogInformation("DailyUserOfflineNotification adminId: " + adminId);

                DateTime today = DateTime.Today;
                var twentyOneDaysAgo = today.AddDays(-21);

                var healthCareWorkerRepo = _repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: adminId);
                var offlineHcws = healthCareWorkerRepo.GetAll()
                   .Include(u => u.User)
                   .Where(x => x.User.IsActive == true && x.User.PhoneNumber.Length > 0 && x.User.LastSeen.Date <= twentyOneDaysAgo.Date).OrderByDescending(x => x.User.LastSeen).ToList();//

                _logger.LogInformation("DailyUserOfflineNotification offline HCWS: " + offlineHcws.Count());

                foreach (var hcw in offlineHcws)
                {
                    TimeSpan daysToCheck = DateTime.Now - hcw.User.LastSeen;
                    if (daysToCheck.Days > 0)
                    {
                        if (daysToCheck.Days >= 21 && daysToCheck.Days < 30)
                        {
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ThreeWeekNotLoggedOn, DateTime.Now.Date, hcw.User, "", null, null, null, false, true, null, hcw.UserId.ToString());
                        }
                        else if (daysToCheck.Days >= 30)
                        {
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FourWeekNotLoggedOn, DateTime.Now.Date, hcw.User, "", null, null, null, false, true, null, hcw.UserId.ToString());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Issue in DailyUserOfflineNotification" + ex.Message, ex);
            }
            _logger.LogInformation("DailyUserOfflineNotification stopped at " + DateTime.Now);
        }

        public async Task MonthlyPointsgReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.MonthlyPointsReminderA, DateTime.Now.Date, null, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
    }
}
