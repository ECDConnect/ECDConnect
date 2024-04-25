using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class HealthCareWorkersOptedOutNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;

        private IGenericRepository<ClinicMeeting, Guid> _clinicMeetingRepo;

        public HealthCareWorkersOptedOutNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            ApplicationUserManager applicationUserManager,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _applicationUserManager = applicationUserManager;

            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _clinicMeetingRepo = repositoryFactory.CreateGenericRepository<ClinicMeeting>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Day == 8;
        }

        public async Task SendNotifications()
        {
            var lastMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            var lastMonthEnd = DateTime.Now.GetEndOfPreviousMonth();

            var chwsOptedOut = _clinicMeetingRepo.GetAll()
                .Where(x => x.MeetingDate >= lastMonthStart && x.MeetingDate <= lastMonthEnd)
                .SelectMany(x => x.ParticipantsOptedOut.Select(y => new RelatedEntity(y.HealthCareWorkerId, "HealthCareWorker")))
                .ToList();

            if (!chwsOptedOut.Any())
            {
                return;
            }

            var adminUsers = _applicationUserManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;

            var replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "NumberOptedOut",
                    ReplacementValue = chwsOptedOut.Count.ToString()
                },
                new TagsReplacements()
                {
                    FindValue = "MonthAndYear",
                    ReplacementValue = $"{DateTime.Now.Month} {DateTime.Now.Year}"
                },
            };

            var groupingId = Guid.NewGuid();
            foreach (var user in adminUsers)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.HealthCareWorkersOptedOut, DateTime.Now.Date, user, "", MessageStatusConstants.Red, replacements, new DateTime(DateTime.Now.Year, DateTime.Now.Month + 1, 1),
                    groupingId: groupingId,
                    relatedEntities: chwsOptedOut);
            }
        }
    }
}
