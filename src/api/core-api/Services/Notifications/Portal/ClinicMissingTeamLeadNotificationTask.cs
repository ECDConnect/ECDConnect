using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clinics;
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
    public class ClinicMissingTeamLeadNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;

        private IGenericRepository<Clinic, Guid> _clinicRepo;

        public ClinicMissingTeamLeadNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            ApplicationUserManager applicationUserManager,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _applicationUserManager = applicationUserManager;

            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _clinicRepo = repositoryFactory.CreateGenericRepository<Clinic>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {
            var clinicsMissingTeamLeads = _clinicRepo.GetAll()
                .Where(x => !x.TeamLeads.Any(y => y.IsActive))
                .Select(x => new { x.Name, x.Id })
                .ToList();

            if (!clinicsMissingTeamLeads.Any())
            {
                return;
            }

            var adminUsers = _applicationUserManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;
            foreach (var clinic in clinicsMissingTeamLeads)
            {

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
                };

                var groupingId = Guid.NewGuid();
                foreach (var user in adminUsers)
                {
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ClinicMissingTeamLead, DateTime.Now.Date, user, "", MessageStatusConstants.Red, replacements,
                        groupingId: groupingId,
                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(clinic.Id, "Clinic") });
                }
            }
        }
    }
}
