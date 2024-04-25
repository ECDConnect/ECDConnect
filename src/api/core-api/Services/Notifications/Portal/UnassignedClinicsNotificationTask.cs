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
using static EcdLink.Api.CoreApi.Services.LeagueService;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class UnassignedClinicsNotificationTask : INotificationTask
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;

        private IGenericRepository<Clinic, Guid> _clinicRepo;

        public UnassignedClinicsNotificationTask(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            ApplicationUserManager applicationUserManager,
            HierarchyEngine hierarchyEngine)
        {
            _notificationService = notificationService;
            _applicationUserManager = applicationUserManager;

            var applicationUserId = hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _clinicRepo = repositoryFactory.CreateGenericRepository<Clinic>(userContext: applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return DateTime.Now.Month == 10 && DateTime.Now.Month == 11;
        }

        public async Task SendNotifications()
        {
            var startDate = LeagueHelpers.GetCurrentSeasonStartDate();
            var endDate = LeagueHelpers.GetCurrentSeasonEndDate(); ;

            var anyUnassignedClinics = _clinicRepo.GetAll()
                .Where(x => !x.Leagues.Any(x => x.IsActive && x.League.IsActive && x.League.StartDate == startDate && x.League.EndDate == endDate))
                .Any();

            if (!anyUnassignedClinics)
            {
                return;
            }

            var adminUsers = _applicationUserManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;

            var groupingId = Guid.NewGuid();
            foreach (var user in adminUsers)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClinics, DateTime.Now.Date, user, "", MessageStatusConstants.Amber,
                    groupingId: groupingId);
            }
        }
    }
}
