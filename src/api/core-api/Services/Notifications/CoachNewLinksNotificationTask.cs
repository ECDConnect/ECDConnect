using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class CoachNewLinksNotificationTask : INotificationTask
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private readonly INotificationService _notificationService;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;


        public CoachNewLinksNotificationTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _notificationService = notificationService;
            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Date.IsLastDayOfMonth();
        }

        public async Task SendNotifications()
        {
            var today = DateTime.Now.Date;
            var nextMonth = today.GetStartOfNextMonth();
            var endOfNextMonth = nextMonth.GetEndOfMonth(); // end date of notification

            var allCoaches = _practitionerRepo.GetAll()
                                                .Where(x => x.IsActive == true 
                                                            && x.CoachHierarchy.HasValue
                                                            && x.CoachLinkDate.HasValue && x.CoachLinkDate.Value.Year == today.Year 
                                                            && x.CoachLinkDate.Value.Month == today.Month)
                                                .Select(x => x.Coach.User)
                                                .Distinct()
                                                .ToList();
            var replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "ApplicationName",
                    ReplacementValue = TenantExecutionContext.Tenant.ApplicationName
                }
            };

            foreach (var user in allCoaches)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachNewPractitionersLinked, DateTime.Now.Date, user, "", MessageStatusConstants.Blue, null, endOfNextMonth,
                                                                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "PractitionerUser") });
            }



        }
    }
}
