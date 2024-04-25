using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class HealthCareWorkerManager
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public HealthCareWorkerManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            [Service] INotificationService notificationService)
        {
            var applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());

            _notificationService = notificationService;

            _healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
        }

        public Guid? GetHealthCareWorkerIdByUserId(string userId)
        {
            return _healthCareWorkerRepo.GetAll()
                .Where(x => x.UserId.ToString() == userId.ToString())
                .OrderBy(x => x.Id)
                .Select(x => x.Id)
                .FirstOrDefault();
        }


        public void OnRemoveCheckNotifications(Guid healthCareWorkerId)
        {
            // Find any opted out notifications featuring this user
            var notifications = _notificationService.GetMessages(TemplateTypeConstants.HealthCareWorkersOptedOut, healthCareWorkerId)
                .Where(x => x.GroupingId.HasValue)
                .GroupBy(x => x.GroupingId.Value)
                .Select(x => new { GroupingId = x.Key, RelatedEntities = x.First().MessageLogRelatedTos.Select(x => x.RelatedEntityId).ToList() });

            if (!notifications.Any())
            {
                return;
            }

            foreach (var notification in notifications)
            {
                // Check if all CHWs have been removed
                var allRemoved = _healthCareWorkerRepo.GetAll()
                    .Where(x => notification.RelatedEntities.Contains(x.Id))
                    .All(x => !x.IsActive);

                if (allRemoved)
                {
                    _notificationService.DeleteGroupNotifications(notification.GroupingId);
                }
            }
        }
    }
}

