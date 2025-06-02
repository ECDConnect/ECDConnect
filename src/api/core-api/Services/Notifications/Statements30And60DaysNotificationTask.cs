using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class Statements30And60DaysNotificationTask : INotificationTask
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private readonly INotificationService _notificationService;
        private IGenericRepository<MessageLog, Guid> _messageRepo;
        private IGenericRepository<StatementsIncomeStatement, Guid> _statementsRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;


        public Statements30And60DaysNotificationTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _notificationService = notificationService;
            _messageRepo = _repoFactory.CreateGenericRepository<MessageLog>(userContext: _applicationUserId);
            _statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {
            var today = DateTime.Now;
            var sixtyDaysBack = today.AddDays(-60);
            var thirtyDaysBack = today.AddDays(-30);
            var oneTwentyDaysBack = today.AddDays(-120);

            var allPrincipalsForBothPeriods = _practitionerRepo.GetAll()
                                                .Where(x => x.IsActive == true &&
                                                            x.IsRegistered == true &&
                                                            x.IsPrincipal == true &&
                                                            x.StartDate.HasValue).ToList();
            var allPrincipalUserIds = allPrincipalsForBothPeriods.Select(x => x.UserId).ToList();
            var allPrincipalStatements = _statementsRepo.GetAll()
                                            .Where(x => x.Year >= sixtyDaysBack.Year &&
                                                        allPrincipalUserIds.Contains((Guid)x.UserId) &&
                                                        (x.IncomeItems.Count != 0 && x.ExpenseItems.Count != 0))
                                            .Distinct()
                                            .ToList();

            // get principals joining the app before 120 days and 60 days back
            var allPrincipalsBefore120Days = allPrincipalsForBothPeriods.Where(x => x.StartDate.Value.Date <= oneTwentyDaysBack.Date).ToList();
            var allPrincipals60DaysBack = allPrincipalsForBothPeriods.Where(x => x.StartDate.Value.Date >= sixtyDaysBack.Date).ToList();

            // Principal has not added ANY income or expense items to the app over the past 30 days AND user DID NOT join the app within the past 120 days
            if (allPrincipalsBefore120Days.Count > 0)
            {
                var allPrincipalUserIdsBefore120Days = allPrincipalsBefore120Days.Select(x => x.UserId).Distinct().ToList();
                var allUserIdsWithIncomeExpenses = allPrincipalStatements
                                                        .Where(x => x.Year >= sixtyDaysBack.Year && x.Month >= thirtyDaysBack.Month &&
                                                                    allPrincipalUserIdsBefore120Days.Contains((Guid)x.UserId))
                                                        .Select(x => x.UserId)
                                                        .Distinct()
                                                        .ToList();
                if (allUserIdsWithIncomeExpenses.Count > 0)
                {
                    var usersToGetNotifications = allPrincipalsBefore120Days.Where(x => !allUserIdsWithIncomeExpenses.Contains(x.UserId)).ToList();
                    if (usersToGetNotifications.Count > 0)
                    {
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "ApplicationName",
                                ReplacementValue = TenantExecutionContext.Tenant.ApplicationName
                            }
                        };
                        foreach (var practitioner in usersToGetNotifications)
                        {
                            // remove previous notification for user, before adding a new one
                            _notificationService.DeleteGroupNotifications(TemplateTypeConstants.Statements30DaysNotification,  practitioner.Id);
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.Statements30DaysNotification, DateTime.Now.Date, practitioner.User, "", MessageStatusConstants.Blue, replacements, null,
                                                                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(practitioner.Id, "Practitioner") });
                        }
                    }
                }
            }

            // 60 days after joining the app IF principal has not added ANY income or expense items on the app.
            if (allPrincipals60DaysBack.Count > 0)
            {
                var allPrincipalUserIds60DaysBack = allPrincipals60DaysBack.Select(x => x.UserId).Distinct().ToList();
                var allUserIdsWithIncomeExpenses = allPrincipalStatements
                                                            .Where(x => x.Year >= sixtyDaysBack.Year &&
                                                                        allPrincipalUserIds60DaysBack.Contains((Guid)x.UserId))
                                                            .Select(x => x.UserId)
                                                            .Distinct()
                                                            .ToList();
                var usersToGetNotifications = allPrincipals60DaysBack.Where(x => !allUserIdsWithIncomeExpenses.Contains(x.UserId)).ToList();
                if (usersToGetNotifications.Count > 0)
                {
                    foreach (var practitioner in usersToGetNotifications)
                    {
                        // remove previous notification for user, before adding a new one
                        _notificationService.DeleteGroupNotifications(TemplateTypeConstants.Statements60DaysNotification,  practitioner.Id);

                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.Statements60DaysNotification, DateTime.Now.Date, practitioner.User, "", MessageStatusConstants.Blue, null, DateTime.Now.Date.AddDays(7),
                                                                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(practitioner.Id, "Practitioner") });
                    }
                }
            }


        }
    }
}
