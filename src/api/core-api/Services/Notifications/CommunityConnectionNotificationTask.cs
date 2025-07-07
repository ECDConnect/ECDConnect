using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class CommunityConnectionNotificationTask : INotificationTask
    {

        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<CommunityProfileConnection, Guid> _communityProfileConnectionRepo;

        private readonly INotificationService _notificationService;

        public CommunityConnectionNotificationTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _communityProfileConnectionRepo = _repoFactory.CreateGenericRepository<CommunityProfileConnection>(userContext: _applicationUserId);

            _notificationService = notificationService;
        }

        public bool ShouldRunToday()
        {
            var lastDayOfMonth = DateTime.Now.GetEndOfMonth();
            if (DateTime.Now.Date == lastDayOfMonth.Date)
            {
                return true;
            }
            return false;
        }

        public async Task SendNotifications()
        {
            var today = DateTime.Now;

            var openConnections = _communityProfileConnectionRepo
                                    .GetAll()
                                    .Where(x => x.IsActive && !x.InviteAccepted.HasValue && x.InsertedDate.Year == today.Year && x.InsertedDate.Month == today.Month && x.ToProfile.IsActive)
                                    .ToList()
                                    .Select(x => new { x.ToProfile.User, x.Id })
                                    .ToList()
                                    .GroupBy(x => x.User)
                                    .Select(x => new { User = x.Key, Total = x.Count() })
                                    .ToList();

            foreach (var item in openConnections)
            {
                var replacements = new List<TagsReplacements>
                 {
                     new TagsReplacements()
                     {
                         FindValue = "TotalConnections",
                         ReplacementValue = item.Total.ToString()
                     }
                 };

                 await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.OpenCommunityConnections, DateTime.Now.Date, item.User, "", MessageStatusConstants.Green, replacements, DateTime.Now.Date.AddDays(5), false, false, null);
             }
        }
    }
}
