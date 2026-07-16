using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class DbeRegistrationHelperTask : INotificationTask
    {

        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<Practitioner, Guid> _practitionerRepo;

        private readonly INotificationService _notificationService;

        public DbeRegistrationHelperTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = _hierarchyEngine.ResolveSystemUserId(_contextAccessor.HttpContext?.GetUser()?.Id) ?? Guid.Empty;

            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);

            _notificationService = notificationService;
        }

        public bool ShouldRunToday()
        {

            if (DateTime.Now.Date == new DateTime(DateTime.Now.Year, 3, 31).Date ||
                DateTime.Now.Date == new DateTime(DateTime.Now.Year, 10, 31).Date ||
                DateTime.Now.Date == new DateTime(DateTime.Now.Year, 6, 30).Date)
            {
                return true;
            }
            return false;
        }

        public async Task SendNotifications()
        {
            if (TenantExecutionContext.Tenant.TenantType == ECDLink.Tenancy.Enums.TenantType.WhiteLabel)
            {
                var practitioners = _practitionerRepo.GetAll().Where(x => x.IsActive && x.IsRegistered.HasValue && x.IsRegistered.Value && x.Progress == 3).ToList();
                foreach (var item in practitioners)
                {
                    if (item.EcdRegistration == null)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.DbeRegistration, DateTime.Now.Date, item.User, null, MessageStatusConstants.Blue, null, null, false, true);
                    }
                }
            }

        }
    }
}
