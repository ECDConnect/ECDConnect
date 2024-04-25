using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using HotChocolate;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class NoMeetingReportSubmittedForClinicNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;

        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<ClinicMeeting, Guid> _clinicMeetingRepo;

        public NoMeetingReportSubmittedForClinicNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            ApplicationUserManager applicationUserManager,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _applicationUserManager = applicationUserManager;

            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _clinicMeetingRepo = repositoryFactory.CreateGenericRepository<ClinicMeeting>(userContext: applicationUserId);
            _clinicRepo = repositoryFactory.CreateGenericRepository<Clinic>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Day == 8;
        }

        public async Task SendNotifications()
        {
            var lastMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            var lastMonthEnd = DateTime.Now.GetEndOfPreviousMonth();

            var clinics = _clinicRepo.GetAll()
                .Where(x => x.IsActive)
                .Select(clinic => new { clinic.Id, clinic.Name, clinic.TeamLeads })
                .ToList();

            var adminUsers = _applicationUserManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;
            foreach (var clinic in clinics)
            {
                var hasMeeting = _clinicMeetingRepo.GetAll()
                    .Any(x => x.ClinicId == clinic.Id && x.MeetingDate >= lastMonthStart && x.MeetingDate <= lastMonthEnd);

                if (hasMeeting)
                {
                    continue;
                }

                var replacements = new List<TagsReplacements>
                {
                    new TagsReplacements()
                    {
                        FindValue = "ClinicId",
                        ReplacementValue = clinic.Id.ToString()
                    },
                    new TagsReplacements()
                    {
                        FindValue = "ClinicName",
                        ReplacementValue = clinic.Name
                    },
                    new TagsReplacements()
                    {
                        FindValue = "MonthAndYear",
                        ReplacementValue = $"{lastMonthStart.Month} {lastMonthStart.Year}"
                    },
                    new TagsReplacements()
                    {
                        FindValue = "TeamLeadName",
                        ReplacementValue = string.Join(",", clinic.TeamLeads.Select(x => $"{x.TeamLead.User.FirstName} {x.TeamLead.User.Surname}"))
                    },
                    new TagsReplacements()
                    {
                        FindValue = "ClinicName",
                        ReplacementValue = clinic.Name
                    },
                };

                var groupingId = Guid.NewGuid();
                foreach (var user in adminUsers)
                {
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.NoMeetingReportSubmittedForClinic, DateTime.Now.Date, user, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddMonths(1),
                        groupingId: groupingId,
                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(clinic.Id, typeof(Clinic).ToString()) });
                }
            }
        }
    }
}
