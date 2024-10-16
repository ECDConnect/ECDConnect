using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace EcdLink.Api.CoreApi.Services
{
    public partial class NotificationTasksService : INotificationTasksService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ApplicationUserManager _userManager;
        private readonly INotificationService _notificationService;

        private IHttpContextAccessor _contextAccessor;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<Coach, Guid> _coachRepo;
        private Guid _applicationUserId;

        public NotificationTasksService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId().Value);

            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _applicationUserId);

            _notificationService = notificationService;
            _userManager = userManager;

        }

        public async Task DailyUserOfflineNotification()
        {

            DateTime today = DateTime.Today;
            var twentyOneDaysAgo = today.AddDays(-21).Date;
            var thirtyDaysAgo = today.AddDays(-30).Date;

            var practitioners = _practitionerRepo.GetAll()
                                                .Where(x => x.IsActive == true && x.IsRegistered.HasValue && x.IsRegistered.Value)
                                                .Include(x => x.User)
                                                .Where(x => x.User.LastSeen.Date == twentyOneDaysAgo || x.User.LastSeen.Date == thirtyDaysAgo)
                                                .Select(x => x.User)
                                                .OrderByDescending(x => x.LastSeen)
                                                .ToList();

            var replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "ApplicationName",
                    ReplacementValue = TenantExecutionContext.Tenant.ApplicationName
                }
            };

            foreach (var user in practitioners)
            {
                TimeSpan daysToCheck = DateTime.Now - user.LastSeen;

                if (daysToCheck.Days >= 21)
                {
                    if (daysToCheck.Days >= 21 && daysToCheck.Days < 30)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ThreeWeekNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });
                    }
                    else if (daysToCheck.Days >= 30)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FourWeekNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });
                    }
                }
            }

            var coaches = _coachRepo.GetAll()
                                    .Where(x => x.IsActive == true && x.IsRegistered.HasValue && x.IsRegistered.Value)
                                    .Include(x => x.User)
                                    .Where(x => x.User.LastSeen.Date == twentyOneDaysAgo)
                                    .Select(x => x.User)
                                    .OrderByDescending(x => x.LastSeen)
                                    .ToList();

            foreach (var user in coaches)
            {
                TimeSpan daysToCheck = DateTime.Now - user.LastSeen;
                if (daysToCheck.Days >= 14)
                {
                    if (daysToCheck.Days >= 14 && daysToCheck.Days < 21)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FourteenDaysNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                                relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });
                    }
                    else if (daysToCheck.Days >= 21 && daysToCheck.Days < 30)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ThreeWeekNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });
                    }
                }
            }
        }

        /// <summary>
        /// Remove notification for coach when all practitioners linked, are registered
        /// </summary>
        /// <param name="coachUserId"></param>
        /// <returns></returns>
        public async Task RemoveCoachNotification(Guid coachUserId)
        {
            var practitionerCount = _practitionerRepo.GetAll()
                                                     .Where(x => x.IsActive == true && x.IsRegistered == false && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == coachUserId)
                                                     .Count();
            if (practitionerCount == 0 )
            {
                await _notificationService.ExpireNotificationsTypesForUser(coachUserId.ToString(), TemplateTypeConstants.CoachNewPractitionersLinked);
            }

        }


    }
}
