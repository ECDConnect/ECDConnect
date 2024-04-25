using ECDLink.Abstractrions.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class NextMonthMeetingTopicNotAddedNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;
        private readonly ContentManagementRepository _contentRepo;
        private readonly ILocaleService<Language> _localeService;

        public NextMonthMeetingTopicNotAddedNotificationTask(
            ApplicationUserManager applicationUserManager,
            [Service] INotificationService notificationService,
            [Service] ContentManagementRepository contentRepo,
            [Service] ILocaleService<Language> localeService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _applicationUserManager = applicationUserManager;
            _contentRepo = contentRepo;
            _localeService = localeService;

            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Day == 1;
        }

        public async Task SendNotifications()
        {
            var nextMonth = DateTime.Now.GetStartOfNextMonth();
            var language = _localeService.GetLocale("en-za");

            var nextMonthContent = _contentRepo.GetByValueKey("Topic", "title", nextMonth.ToString("MMMM yyyy"), language.Id);

            if (nextMonthContent.Any())
            {
                return;
            }

            var adminUsers = _applicationUserManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;

            var replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "MonthAndYear",
                    ReplacementValue = nextMonth.ToString("MMMM yyyy")
                },
            };

            var groupingId = Guid.NewGuid();
            foreach (var user in adminUsers)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.NextMonthMeetingTopicNotAdded, DateTime.Now.Date, user, "", MessageStatusConstants.Red, replacements, new DateTime(nextMonth.Year, nextMonth.Month, 8),
                    groupingId: groupingId);
            }
        }
    }
}
