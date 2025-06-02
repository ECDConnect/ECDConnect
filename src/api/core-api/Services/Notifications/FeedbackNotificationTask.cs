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
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class FeedbackNotificationTask : INotificationTask
    {

        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<Practitioner, Guid> _practitionerRepo;

        private readonly INotificationService _notificationService;

        public FeedbackNotificationTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);

            _notificationService = notificationService;
        }

        public bool ShouldRunToday()
        {
            
            if (DateTime.Now.Date == new DateTime(DateTime.Now.Year, 11, 1).Date ||
                DateTime.Now.Date == new DateTime(DateTime.Now.Year, 5, 2).Date)
            {
                return true;
            }
            return false;
        }

        public async Task SendNotifications()
        {
            var practitioners = _practitionerRepo.GetAll().Where(x => x.IsActive && x.IsRegistered.HasValue && x.IsRegistered.Value).ToList();
            foreach (var item in practitioners)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FeedbackNotification, DateTime.Now.Date, item.User, "", MessageStatusConstants.Green, null, DateTime.Now.Date.AddDays(14), false, false, null);
            }
        }
    }
}
