using DotLiquid.Util;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clinics;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class HealthCareWorkerManager
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _applicationUserManager;

        private IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<ShortenUrlEntity, Guid> _shortenUrlEntityRepo;
        private IGenericRepository<ClinicMeeting, Guid> _clinicMeetingRepo;

        private Guid _applicationUserId;

        public HealthCareWorkerManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            ApplicationUserManager applicationUserManager,
            [Service] INotificationService notificationService)
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().Value);

            _notificationService = notificationService;
            _applicationUserManager = applicationUserManager;

            _healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: _applicationUserId);
            _visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _shortenUrlEntityRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: _applicationUserId);
            _clinicMeetingRepo = repoFactory.CreateGenericRepository<ClinicMeeting>(userContext: _applicationUserId);
        }

        public Guid? GetHealthCareWorkerIdByUserId(string userId)
        {
            return _healthCareWorkerRepo.GetAll()
                .Where(x => x.UserId.ToString() == userId.ToString())
                .OrderBy(x => x.Id)
                .Select(x => x.Id)
                .FirstOrDefault();
        }


        public void OnRemoveCheckNotifications(Guid healthCareWorkerId)
        {
            // Find any opted out notifications featuring this user
            var notifications = _notificationService.GetMessages(TemplateTypeConstants.HealthCareWorkersOptedOut, healthCareWorkerId)
                .Where(x => x.GroupingId.HasValue)
                .GroupBy(x => x.GroupingId.Value)
                .Select(x => new { GroupingId = x.Key, RelatedEntities = x.First().MessageLogRelatedTos.Select(x => x.RelatedEntityId).ToList() });

            if (!notifications.Any())
            {
                return;
            }

            foreach (var notification in notifications)
            {
                // Check if all CHWs have been removed
                var allRemoved = _healthCareWorkerRepo.GetAll()
                    .Where(x => notification.RelatedEntities.Contains(x.Id))
                    .All(x => !x.IsActive);

                if (allRemoved)
                {
                    _notificationService.DeleteGroupNotifications(notification.GroupingId);
                }
            }
        }

        public List<PortalUsersHCWModel> GetAllHealthCareWorkers(
            string search = null,
            List<Guid> provinceSearch = null,
            List<Guid> subDistrictSearch = null,
            List<string> clinicNameSearch = null,
            List<string> visitSearch = null,
            List<string> connectUsageSearch = null)
        {
            // Check if team lead or admin
            var currentUser = _applicationUserManager.FindByIdAsync(_applicationUserId).Result;
            var isUserAdmin = _applicationUserManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR).Result;

            var sixMonthsAgo = DateTime.Now.AddMonths(-6).GetStartOfMonth().Date;

            // If only a team lead, filter to only CHWs at relavant clinics
            var healthCareWorkersQuery = _healthCareWorkerRepo.GetAll()
                .Where(x =>
                    isUserAdmin
                    || x.Clinic.TeamLeads.Any(y => y.TeamLead.UserId == _applicationUserId));

            var hasFilters = false;

            // General search term
            if (!string.IsNullOrWhiteSpace(search))
            {
                healthCareWorkersQuery = healthCareWorkersQuery
                    .Where(h => 
                        EF.Functions.ILike(h.User.FullName, $"%{search}%")
                        || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            }

            // Province search
            if (provinceSearch != null && provinceSearch.Any())
            {
                healthCareWorkersQuery = healthCareWorkersQuery.Where(x => provinceSearch.Contains(x.Clinic.SubDistrict.District.ProvinceId));
            }

            // Sub district search
            if (subDistrictSearch != null && subDistrictSearch.Any())
            {
                healthCareWorkersQuery = healthCareWorkersQuery.Where(x => x.Clinic.SubDistrictId.HasValue && subDistrictSearch.Contains(x.Clinic.SubDistrictId.Value));
            }

            // Clinic name search
            if (clinicNameSearch != null && clinicNameSearch.Any())
            {
                healthCareWorkersQuery = healthCareWorkersQuery.Where(x => clinicNameSearch.Contains(x.Clinic.Name));
            }

            // Some connect status search items
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
            {
                healthCareWorkersQuery = healthCareWorkersQuery.Where(x => x.User.IsActive == false);
            }

            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
            {
                healthCareWorkersQuery = healthCareWorkersQuery.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.InsertedDate.HasValue
                    && x.User.LastSeen.Date != x.User.InsertedDate.Value.Date
                    && x.User.LastSeen.Date >= sixMonthsAgo);
            }

            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_6_months))
            {
                healthCareWorkersQuery = healthCareWorkersQuery.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.InsertedDate.HasValue
                    && x.User.LastSeen.Date != x.User.InsertedDate.Value.Date
                    && x.User.LastSeen.Date <= sixMonthsAgo);
            }

            var healthCareWorkers = healthCareWorkersQuery.ToList();
            var healthCareWorkerIds = healthCareWorkers.Select(x => x.Id);

            // Visit search
            if (visitSearch != null && visitSearch.Count != 0)
            {
                var startOfMonth = DateTime.Now.GetStartOfMonth();
                var endOfMonth = DateTime.Now.GetEndOfMonth();

                var visits = _visitRepo.GetAll()
                    .Where(x =>
                        x.Attended == true
                        && x.ActualVisitDate.HasValue
                        && x.ActualVisitDate.Value.Date >= startOfMonth.Date
                        && x.ActualVisitDate.Value.Date <= endOfMonth.Date
                        && (x.Mother.IsActive && healthCareWorkerIds.Contains(x.Mother.HealthCareWorkerId.Value)
                            || (x.Infant.IsActive && healthCareWorkerIds.Contains(x.Infant.Caregiver.HealthCareWorkerId.Value))))
                    .Select(x => new { MotherHealthCareWorkerId = x.Mother.HealthCareWorkerId, InfantHealthCareWorkerId = x.Infant.Caregiver.HealthCareWorkerId, VisitId = x.Id })
                    .ToList()
                    .Select(x => new { HealthCareWorkerId = (x.MotherHealthCareWorkerId ?? x.InfantHealthCareWorkerId).Value, x.VisitId })
                    .GroupBy(x => x.HealthCareWorkerId)
                    .Select(x => new { HealthCareWorkerId = x.Key, VisitCount = x.Count()})
                    .ToList();

                if (visitSearch.Contains(Constants.PortalSettings.visit_high_activity))
                {
                    healthCareWorkers = healthCareWorkers.Where(x => visits.FirstOrDefault(y => y.HealthCareWorkerId == x.Id)?.VisitCount > 20).ToList();
                }

                if (visitSearch.Contains(Constants.PortalSettings.visit_medium_activity))
                {
                    healthCareWorkers = healthCareWorkers.Where(x => visits.FirstOrDefault(y => y.HealthCareWorkerId == x.Id)?.VisitCount > 10).ToList();
                }

                if (visitSearch.Contains(Constants.PortalSettings.visit_low_activity))
                {
                    healthCareWorkers = healthCareWorkers.Where(x => visits.FirstOrDefault(y => y.HealthCareWorkerId == x.Id)?.VisitCount == 0).ToList();
                }
            }

            // Fetch invitations for connect usage and convert to model
            var userIds = healthCareWorkers.Select(x => x.UserId.Value).ToList();
            var invitations = _shortenUrlEntityRepo.GetAll()
                .Where(x => 
                    userIds.Contains(x.UserId.Value) 
                    && x.MessageType == TemplateTypeConstants.Invitation 
                    && x.IsActive 
                    && x.Clicked == 0)
                .Select(x => new { x.UserId, x.InsertedDate })
                .OrderByDescending(x => x.InsertedDate)
                .GroupBy(x => x.UserId)
                .ToDictionary(x => x.Key, x => x.First().InsertedDate);

            var healthCareWorkerModels = healthCareWorkers
                .Select(item => new PortalUsersHCWModel
                {
                    Id = item.Id,
                    User = new PortalUserModel(item.User, item.IsRegistered, invitations.ContainsKey(item.UserId) ? invitations[item.UserId] : null),
                    ClinicId = item.ClinicId,
                    ClinicName = item.Clinic != null ? item.Clinic.Name : null,
                    InsertedDate = item.InsertedDate,
                    IsRegistered = item.IsRegistered,
                    ProvinceId = item.Clinic != null && item.Clinic.SubDistrict != null ? item.Clinic.SubDistrict.District.ProvinceId : null,
                    SubDistrictId = item.Clinic != null ? item.Clinic.SubDistrictId : null,
                })
                .ToList();

            // Last connect usage filter
            if (connectUsageSearch != null && connectUsageSearch.Any())
            {
                healthCareWorkerModels = healthCareWorkerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList();
            }

            return healthCareWorkerModels;
        }

        public List<PortalHealthCareWorkerModel> GetHealthCareWorkersOptedOutOfMonthlyMeetings(
            int month,
            int year)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.GetEndOfMonth();

            var healthCareWorkers = _clinicMeetingRepo.GetAll()
                .Where(x => x.MeetingDate >= startDate && x.MeetingDate <= endDate)
                .SelectMany(x => x.ParticipantsOptedOut).Select(x => x.HealthCareWorker)
                .ToList();

            // Fetch invitations for connect usage and convert to model
            var userIds = healthCareWorkers.Select(x => x.UserId.Value).ToList();
            var invitations = _shortenUrlEntityRepo.GetAll()
                .Where(x =>
                    userIds.Contains(x.UserId.Value)
                    && x.MessageType == TemplateTypeConstants.Invitation
                    && x.IsActive
                    && x.Clicked == 0)
                .Select(x => new { x.UserId, x.InsertedDate })
                .OrderByDescending(x => x.InsertedDate)
                .GroupBy(x => x.UserId)
                .ToDictionary(x => x.Key, x => x.First().InsertedDate);

            var healthCareWorkerModels = healthCareWorkers
                .Select(item => new PortalHealthCareWorkerModel(
                    item.Id,
                    item.UserId.Value,
                    item.User.IdNumber,
                    $"{item.User.FirstName} {item.User.Surname}",
                    item.IsActive && item.User.IsActive,
                    item.IsRegistered, 
                    item.User.LastSeen,
                    item.User.UpdatedDate,
                    invitations.ContainsKey(item.UserId) ? invitations[item.UserId] : null)
                    ).ToList();

            return healthCareWorkerModels;
        }



        public PortalUsersHCWModel GetPortalHealthCareWorkerById(Guid healthCareWorkerId)
        {
            // If only a team lead, filter to only CHWs at relavant clinics
            var healthCareWorker = _healthCareWorkerRepo.GetById(healthCareWorkerId);

            // Fetch invitations for connect usage and convert to model
            var invitation = _shortenUrlEntityRepo.GetAll()
                .Where(x =>
                   x.UserId.Value == healthCareWorker.UserId
                    && x.MessageType == TemplateTypeConstants.Invitation
                    && x.IsActive
                    && x.Clicked == 0)
                .OrderByDescending(x => x.InsertedDate)
                .FirstOrDefault();

            return new PortalUsersHCWModel
            {
                Id = healthCareWorker.Id,
                User = new PortalUserModel(healthCareWorker.User, healthCareWorker.IsRegistered, invitation != null ? invitation.InsertedDate : null),
                ClinicId = healthCareWorker.ClinicId,
                ClinicName = healthCareWorker.Clinic != null ? healthCareWorker.Clinic.Name : null,
                InsertedDate = healthCareWorker.InsertedDate,
                IsRegistered = healthCareWorker.IsRegistered,
                ProvinceId = healthCareWorker.Clinic != null && healthCareWorker.Clinic.SubDistrict != null ? healthCareWorker.Clinic.SubDistrict.District.ProvinceId : null,
                SubDistrictId = healthCareWorker.Clinic != null ? healthCareWorker.Clinic.SubDistrictId : null,
            };
        }
    }
}

