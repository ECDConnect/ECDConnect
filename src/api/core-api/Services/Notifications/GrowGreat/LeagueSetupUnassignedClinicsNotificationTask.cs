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

namespace EcdLink.Api.CoreApi.Services
{
    public class LeagueSetupUnassignedClinicsNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;

        private IGenericRepository<Clinic, Guid> _clinicRepo;

        public LeagueSetupUnassignedClinicsNotificationTask(
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
            return DateTime.Now.Month == 11;
        }

        public async Task SendNotifications()
        {
            // TODO - Reset this so it is working for the next season (should be this year, to next year)
            var startDate = new DateTime(DateTime.Now.Year - 1, 10, 1);
            var endDate = new DateTime(DateTime.Now.Year, 9, 30);

            // Unassigned clinics
            var anyUnassignedClinics = _clinicRepo.GetAll()
                .Where(x => !x.Leagues.Any(x => x.IsActive && x.League.IsActive && x.League.StartDate == startDate && x.League.EndDate == endDate))
                .Any();

            if (!anyUnassignedClinics)
            {
                return;
            }

            var adminUsers = _applicationUserManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;

            var replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "year",
                    ReplacementValue = DateTime.Now.Year.ToString()
                },
            };

            foreach (var user in adminUsers)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.LeagueSetupUnassignedClinics, DateTime.Now.Date, user, "", MessageStatusConstants.Amber, replacements, new DateTime(DateTime.Now.Year, DateTime.Now.Month + 1, 1));
            }
        }
    }
}
