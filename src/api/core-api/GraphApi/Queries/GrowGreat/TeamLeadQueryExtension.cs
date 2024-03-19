using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Services.Interfaces;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class TeamLeadQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalUsersTLModel> GetAllTeamLeads([Service] IHttpContextAccessor contextAccessor,
                                                      IGenericRepositoryFactory repoFactory,
                                                      CancellationToken cancellationToken,
                                                      PagedQueryInput pagingInput = null,
                                                      string search = null,
                                                      List<string> provinceSearch = null,
                                                      List<string> clinicSearch = null,
                                                      List<string> visitSearch = null,
                                                      List<string> connectUsageSearch = null,
                                                      List<string> subDistrictSearch = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var teamLeads = repoFactory.CreateRepository<TeamLead>(userContext: uId).GetAll(pagingInput);
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var shortenUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);
            var hasFilters = false;

            if (cancellationToken.IsCancellationRequested)
                return null;

            if (!string.IsNullOrWhiteSpace(search))
                teamLeads = teamLeads 
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));

            // Get ids and tokens
            List<Guid> userIds = teamLeads.Select(x => (Guid)x.UserId).ToList();
            List<ShortenUrlEntity> invitations = shortenUrlRepo
                    .GetAll().Where(x => userIds.Contains((Guid)x.UserId) && x.MessageType == TemplateTypeConstants.Invitation && x.IsActive && x.Clicked == 0)
                    .ToList();

            List<PortalUsersTLModel> teamLeaders = teamLeads.Select(item => new PortalUsersTLModel
            {
                Id = item.Id,
                User = new PortalUserModel(item.User, invitations),
                ClinicIds = item.Clinics.Where(x => x.IsActive).Select(x => x.ClinicId).ToList(),
                ClinicNames = item.Clinics.Where(x => x.IsActive).Select(x => x.Clinic.Name).ToList(),
                InsertedDate = item.InsertedDate,
                IsRegistered = item.IsRegistered,
                ProvinceIds = item.Clinics.Where(x => x.IsActive).Select(x => x.Clinic.SubDistrict.District.ProvinceId).ToList(),
                SubDistrictIds = item.Clinics.Where(x => x.IsActive).Select(x => (Guid)x.Clinic.SubDistrictId).ToList()
            }).ToList();

            List<PortalUsersTLModel> filteredUsers = new List<PortalUsersTLModel>();

            if (provinceSearch != null && provinceSearch.Count != 0)
            {
                hasFilters = true;
                filteredUsers.AddRange(teamLeaders.Where(h => h.ProvinceIds.Any(c => provinceSearch.Contains(c.ToString()))));
            }

            if (clinicSearch != null && clinicSearch.Count != 0)
            {
                hasFilters = true;
                filteredUsers.AddRange(teamLeaders.Where(h => h.ClinicNames.Any(c => clinicSearch.Contains(c))));
            }

            if (subDistrictSearch != null && subDistrictSearch.Count != 0)
            {
                hasFilters = true;
                filteredUsers.AddRange(teamLeaders.Where(h => h.SubDistrictIds.Any(c => provinceSearch.Contains(c.ToString()))));
            }


            if (connectUsageSearch != null && connectUsageSearch.Count != 0)
            {
                var today = DateTime.Now;
                var sixMonths = today.AddMonths(-6);
                hasFilters = true;

                if (connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_active))
                {
                    filteredUsers.AddRange(teamLeaders.Where(x => x.User.ConnectUsage == Constants.PortalSettings.usage_invitation_active).ToList());
                }
                if (connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_expired))
                {
                    filteredUsers.AddRange(teamLeaders.Where(x => x.User.ConnectUsage == Constants.PortalSettings.usage_invitation_expired).ToList());
                }
                if (connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
                {
                    filteredUsers.AddRange(teamLeaders.Where(x => x.User.LastSeen.Date >= sixMonths.GetStartOfMonth().Date).ToList());
                }
                if (connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_months))
                {
                    filteredUsers.AddRange(teamLeaders.Where(x => x.User.LastSeen.Date <= sixMonths.GetStartOfMonth().Date).ToList());
                }
                if (connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
                {
                    filteredUsers.AddRange(teamLeaders.Where(x => x.User.IsActive == false).ToList());
                }
            }

            if (visitSearch != null && visitSearch.Count != 0)
            {
                hasFilters = true;
                var startOfMonth = DateTime.Now.GetStartOfMonth();
                var endOfMonth = DateTime.Now.GetEndOfMonth();
                var clinicIds = teamLeaders.Select(x => x.ClinicIds).Distinct().ToList();
                var combinedClinicIds = clinicIds.SelectMany(x => x).Distinct().ToList();
                var hcwIds = hcwRepo.GetAll().Where(x => x.IsActive && x.ClinicId != null && combinedClinicIds.Contains((Guid)x.ClinicId)).Select(x => x.UserId).ToList();

                var visits = visitRepo.GetAll().Where(x => x.Attended == true &&
                                                           x.ActualVisitDate.HasValue &&
                                                           (x.ActualVisitDate.Value.Date >= startOfMonth.Date && x.ActualVisitDate.Value.Date <= endOfMonth.Date) &&
                                                           (x.Mother.IsActive && hcwIds.Contains((Guid)x.Mother.HealthCareWorker.User.Id) ||
                                                           (x.Infant.IsActive && hcwIds.Contains((Guid)x.Infant.Caregiver.HealthCareWorker.User.Id)))
                                                           ).ToList();

                foreach (var item in teamLeaders)
                {
                    var totalClientsVisits = visits.Where(x => item.ClinicIds.Contains((Guid)x.Mother.HealthCareWorker.ClinicId) || item.ClinicIds.Contains((Guid)x.Infant.Caregiver.HealthCareWorker.ClinicId)).Count();

                    if (visitSearch.Contains(Constants.PortalSettings.visit_high_activity))
                    {
                        if (totalClientsVisits >= 20)
                        {
                            filteredUsers.Add(item);
                        }
                    }
                    if (visitSearch.Contains(Constants.PortalSettings.visit_medium_activity))
                    {
                        if (totalClientsVisits > 0 && totalClientsVisits <= 10)
                        {
                            filteredUsers.Add(item);
                        }
                    }
                    if (visitSearch.Contains(Constants.PortalSettings.visit_low_activity))
                    {
                        if (totalClientsVisits == 0)
                        {
                            filteredUsers.Add(item);
                        }
                    }
                }
            }
            if (hasFilters)
            {
                return filteredUsers;
            }

            return teamLeaders;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        public int GetCountTeamLeads(
            [Service] IHttpContextAccessor contextAccessor,
             IGenericRepositoryFactory repoFactory,
             PagedQueryInput pagingInput = null,
             string search = null,
             string provinceSearch = null,
             string clinicSearch = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var teamLeadRepo = repoFactory.CreateRepository<TeamLead>(userContext: uId).GetAll(pagingInput);

            if (!string.IsNullOrWhiteSpace(search))
            {
                teamLeadRepo = teamLeadRepo
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            }

            if (!string.IsNullOrWhiteSpace(provinceSearch))
            {
                teamLeadRepo = teamLeadRepo.Where(h => h.Clinics.Any(c => EF.Functions.ILike(c.Clinic.SiteAddress.Province.Description, $"%{provinceSearch}%")));
            }
            if (!string.IsNullOrWhiteSpace(clinicSearch))
            {
                teamLeadRepo = teamLeadRepo.Where(h => h.Clinics.Any(c => EF.Functions.ILike(c.Clinic.Name, $"%{clinicSearch}%")));
            }

            return teamLeadRepo.Count();
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> TeamLeadTemplateGenerator(
          [Service] IFileGenerationService fileService,
          [Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory)
        {
            var user = contextAccessor.HttpContext.GetUser();
            var uId = user.Id;
            
            var fieldDefinitionSheet = $"Field Definition";
            var fieldDefinitionList = new List<List<string>>
            {
                new List<string> { "Column", "Type Description"},
                new List<string> { "Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string> { "ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string> {"Passport", "Text, (required if type of identification is 'passport')"},
                new List<string> {"First name", "Text, (required)"},
                new List<string> {"Surname", "Text, (required)"},
                new List<string> {"Cellphone number", "Number, (required, 10 digits)"},
                new List<string> {"Email address", "email, (optional)"},
            };
            
            var templateHeaderSheet = $"Team Lead Template";
            var templateHeaders = new List<List<string>>()
            {
                new List<string> {
                    "Type of identification",
                    "ID number",
                    "Passport",
                    "First name",
                    "Surname",
                    "Cellphone number",
                    "Email address"
                }
            };

            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList }
            };

            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PortalTeamLeadModel GetTeamLeadSummary([Service] IHttpContextAccessor contextAccessor,
                                      IGenericRepositoryFactory repoFactory,
                                      [Service] IPersonnelService personnelService,
                                      Guid teamLeadId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var hcwRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: uId);
            var teamRepo = repoFactory.CreateRepository<TeamLead>(userContext: uId);
            var infantRepo = repoFactory.CreateRepository<Infant>(userContext: uId);
            
            var teamLead = teamRepo.GetAll().Where(x => x.Id == teamLeadId).FirstOrDefault();
            if (teamLead != null)
            {
                var siteAddress = personnelService.GetUserSiteAddress(teamLead.User.Id.ToString());
                var clinicTeamLeadRecords = teamLead.Clinics.Where(x => x.IsActive).ToList();

                var clinicNameList = new List<string>();
                var clinicIds = new List<Guid>();
                foreach (var item in clinicTeamLeadRecords)
                {
                    var league = item.Clinic.Leagues.Where(x => x.IsActive).FirstOrDefault();
                    if (league != null)
                    {
                        clinicNameList.Add(item.Clinic.Name + " (" + league?.League.Name + ")");
                    } else
                    {
                        clinicNameList.Add(item.Clinic.Name);
                    }
                    clinicIds.Add(item.ClinicId);
                }
                var healthCareWorkers = hcwRepo.GetAll().Where(x => x.IsActive && x.ClinicId != null && clinicIds.Contains((Guid)x.ClinicId))
                    .Include(x => x.Mothers)
                    .Include(x => x.Caregivers)
                    .ToList();
                var caregiverIds = healthCareWorkers.SelectMany(x => x.Caregivers.Where(x => x.IsActive).Select(x => x.Id)).Distinct().ToList();

                var clinicNames = string.Join(",", clinicNameList);
                var totalHealthCareWorkers = healthCareWorkers.Count();
                var totalPregnantMoms = healthCareWorkers.SelectMany(x => x.Mothers.Where(x => x.IsActive)).Distinct().Count();
                var totalChildren = infantRepo.GetAll().Where(x => x.IsActive && caregiverIds.Contains((Guid)x.CaregiverId)).Distinct().Count();
                // TODO: get these totals when app dev is done
                var totalMeetingReportsSubmitted = 0;
                var totalInFieldVisitsCompleted = 0;
                return new PortalTeamLeadModel(teamLead.User, clinicNames, siteAddress, clinicNameList.Count, totalHealthCareWorkers,
                                          totalPregnantMoms, totalChildren, totalMeetingReportsSubmitted, totalInFieldVisitsCompleted);
            }
            return null;
        }

    }
}
