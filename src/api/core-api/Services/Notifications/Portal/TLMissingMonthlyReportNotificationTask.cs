using ECDLink.Abstractrions.Constants;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public class TLMissingMonthlyReportNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly IClinicService _clinicService;

        private IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;
        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        public TLMissingMonthlyReportNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] IClinicService clinicService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _clinicService = clinicService;
            
            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _pointsUserSummaryRepo = repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: applicationUserId);
            _clinicRepo = repositoryFactory.CreateGenericRepository<Clinic>(userContext: applicationUserId);
            _healthCareWorkerRepo = repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.IsSevenDaysUntilMonthEnd();
        }

        public async Task SendNotifications()
        {
            var clinicIds = _clinicRepo.GetAll().Where(x => x.IsActive).Select(x => x.Id).ToList();

            var noQualifyingClubsReplacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "CurrentMonth",
                    ReplacementValue = DateTime.Now.ToString("MMMM")
                }
            };

            var nextMonth = DateTime.Now.AddMonths(1).GetStartOfMonth();

            var notificationTasks = new List<Task>();
            foreach (var clinicId in clinicIds)
            {
                var breastFeedingClubsForClinic = _clinicService.GetBreastFeedingClubs(clinicId);

                var qualifyingClubs = breastFeedingClubsForClinic
                    .Where(x =>
                        x.MeetingDate >= DateTime.Now.GetStartOfMonth()
                        && x.MeetingDate <= DateTime.Now.GetEndOfMonth()
                        && x.Clients.Count() >= 4
                        && x.Clients.Count() <= 6)
                    .Count();

                var teamUsers = _healthCareWorkerRepo.GetAll()
                        .Where(x => x.ClinicId == clinicId && x.IsActive)
                        .Select(x => x.User)
                        .ToList();

                if (qualifyingClubs == 0)
                {
                    foreach (var user in teamUsers)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGAddBreastfeedingClub, DateTime.Now.Date, user, "", MessageStatusConstants.Red, noQualifyingClubsReplacements, nextMonth);
                    }
                }
                else
                {
                    var replacements = new List<TagsReplacements>
                    {
                        new TagsReplacements()
                        {
                            FindValue = "CurrentClubs",
                            ReplacementValue = qualifyingClubs.ToString()
                        },
                        new TagsReplacements()
                        {
                            FindValue = "CurrentMonth",
                            ReplacementValue = DateTime.Now.ToString("MMMM")
                        }
                    };

                    foreach (var user in teamUsers)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGAddedABreastfeedingClub, DateTime.Now.Date, user, "", MessageStatusConstants.Amber, replacements, nextMonth);
                    }
                }
            }
        }
    }
}
