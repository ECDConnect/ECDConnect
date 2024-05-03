using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class CHWNotCompletedVisitIn2WeeksNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;

        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<MessageLog, Guid> _messageRepo;

        public CHWNotCompletedVisitIn2WeeksNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;

            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _healthCareWorkerRepo = repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            _visitRepo = repositoryFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            _messageRepo = repositoryFactory.CreateGenericRepository<MessageLog>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {
            var twoWeeksBack = DateTime.Now.AddDays(-14);

            var healthCareWorkers = _healthCareWorkerRepo.GetAll().Where(x => x.IsActive && x.ClinicId.HasValue).ToList();
            var hcwIds = healthCareWorkers.Select(x => x.Id.ToString()).ToList();
            var notifications = _messageRepo.GetAll().Where(x =>
                                                            x.MessageProtocol == "push" &&
                                                            x.MessageTemplateType == TemplateTypeConstants.GGPortalCHWNotCompletedVisitIn2Weeks &&
                                                            hcwIds.Contains(x.To) &&
                                                            x.IsActive == true
                                                            ).ToList();

            // get all visits submitted the past 2 weeks for moms and infants
            var visits = _visitRepo.GetAll().Where(x => x.IsActive && x.Attended &&
                                                   (x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= twoWeeksBack.Date && x.ActualVisitDate.Value.Date <= DateTime.Now.Date) &&
                                                   (x.InfantId.HasValue || x.MotherId.HasValue)
                                                   ).ToList();

            // Retrieve all health care worker ids from the visits
            var visitHcwIds = visits.Where(x => x.MotherId.HasValue).Select(x => x.Mother.HealthCareWorkerId).Distinct().ToList();
            visitHcwIds.AddRange(visits.Where(x => x.InfantId.HasValue).Select(x => x.Infant.Caregiver.HealthCareWorkerId).Distinct().ToList());

            foreach (var hcw in healthCareWorkers)
            {
                var hasVisitInPast2Weeks = visitHcwIds.Contains(hcw.Id);
                var hcwNotifications = notifications.Where(x => x.To == hcw.User.Id.ToString()).Select(x => x.Id.ToString()).ToList();

                if (hasVisitInPast2Weeks)
                {
                    // disable notifications if there is a visit completed
                    if (hcwNotifications.Count > 0)
                    {
                        foreach (var notificationId in hcwNotifications)
                        {
                            await _notificationService.DisableNotification(notificationId);
                        }
                    }
                }
                else
                {
                    if (hcwNotifications.Count == 0)
                    {
                        // add 
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "CHWFirstName",
                                ReplacementValue = hcw.User.FirstName
                            },
                            new TagsReplacements()
                            {
                                FindValue = "HealthCareWorkerId",
                                ReplacementValue = hcw.Id.ToString()
                            }
                        };

                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPortalCHWNotCompletedVisitIn2Weeks, DateTime.Now.Date, hcw.User, "", MessageStatusConstants.Amber, replacements, null,
                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(hcw.Id, "HealthCareWorker") });

                    }
                }
            }
        }
    }
}
