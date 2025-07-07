using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
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
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _applicationUserId);

            _notificationService = notificationService;
            _userManager = userManager;

        }

        public async Task DailyUserOfflineNotification()
        {
            DateTime today = DateTime.Today;
            var start14Days = today.AddDays(-14).Date;
            var end14Days = today.AddDays(-13).Date;
            var start21Days = today.AddDays(-21).Date;
            var end21Days = today.AddDays(-20).Date;

            var start30Days = today.AddDays(-30).Date;
            var end30Days = today.AddDays(-29).Date;

            // Don't run this on weekends
            // Only send the message on week days between 7am and 5pm (roll forward to the next week day). 
            // So if 21 days is reached at 2pm on a Sunday, only send the message at 7am the next day (Monday)"
            // Cronjob linked to this job: 0 7-17 * * 1-5
            // Every hour between 7am to 5pm and only on week days.
            if (!DateTime.Now.Date.IsWeekend()) {
                
                var practitioners = _practitionerRepo.GetAll()
                                                    .Where(x => x.IsActive == true && x.IsRegistered.HasValue && x.IsRegistered.Value)
                                                    .Include(x => x.User)
                                                    .Where(x => x.IsActive == true && 
                                                    (
                                                        (x.User.LastSeen >= start14Days && x.User.LastSeen < end14Days) || 
                                                        (x.User.LastSeen >= start21Days && x.User.LastSeen < end21Days) || 
                                                        (x.User.LastSeen >= start30Days && x.User.LastSeen < end30Days)
                                                    )
                                                    )
                                                    .Select(x => x.User)
                                                    .OrderByDescending(x => x.LastSeen)
                                                    .ToList();

                if (practitioners.Count != 0) {
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
                        TimeSpan timeDifference = DateTime.Now - user.LastSeen;
                        var totalDays = timeDifference.Days;

                        if (totalDays >= 14 && totalDays < 21)
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.TwoWeekNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                                   relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });

                        else if (totalDays >= 21 && totalDays < 30)
                        {
                            // _notificationManager.SendOfflineSmsAsync(user, TemplateTypeConstants.ThreeWeekNotLoggedOn);
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ThreeWeekNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                                relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });
                        }
                        else if (totalDays >= 30)
                        {
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FourWeekNotLoggedOn, DateTime.Now.Date, user, "", null, replacements, null, false, false, null,
                                relatedEntities: new List<RelatedEntity> { new RelatedEntity(user.Id, "ApplicationUser") });
                        }
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
