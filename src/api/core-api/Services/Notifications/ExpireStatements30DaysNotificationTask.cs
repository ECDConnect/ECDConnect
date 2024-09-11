using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class ExpireStatements30DaysNotificationTask : INotificationTask
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private readonly INotificationService _notificationService;
        private IGenericRepository<MessageLog, Guid> _messageRepo;


        public ExpireStatements30DaysNotificationTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId().Value);

            _notificationService = notificationService;
            _messageRepo = _repoFactory.CreateGenericRepository<MessageLog>(userContext: _applicationUserId);
        }

        public bool ShouldRunToday()
        {
            if (DateTime.Now.Day == 8) return true;

            return false;
        }

        public async Task SendNotifications()
        {
            var activeMessages = _messageRepo.GetAll().Where(x => x.MessageTemplateType == TemplateTypeConstants.Statements30DaysNotification && x.IsActive).Select(x => x.Id);
            foreach (var id in activeMessages)
            {
                await _notificationService.ExpireNotification(id.ToString());
            }
        }
    }
}
