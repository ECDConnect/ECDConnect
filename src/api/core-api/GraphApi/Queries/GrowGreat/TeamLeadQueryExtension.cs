using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Services.Interfaces;
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
            var teamLeadsQuery = repoFactory.CreateRepository<TeamLead>(userContext: uId).GetAll(pagingInput);
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var shortenUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);
            var sixMonthsAgo = DateTime.Now.AddMonths(-6).GetStartOfMonth().Date;

            if (cancellationToken.IsCancellationRequested)
                return null;

            if (!string.IsNullOrWhiteSpace(search))
                teamLeadsQuery = teamLeadsQuery
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));

            // Get ids and tokens
            var userIds = teamLeadsQuery.Select(x => (Guid)x.UserId).ToList();

            var defaultInvitations = new List<ShortenUrlEntity>();
            /*var defaultInvitations = shortenUrlRepo.GetAll()
                .Where(x =>
                    userIds.Contains(x.UserId.Value)
                    && x.MessageType == TemplateTypeConstants.TeamLeadInvitation
                    && x.IsActive
                    && x.Clicked == 0).GroupBy(l => l.UserId)
                .Select(g => g.OrderByDescending(c => c.InsertedDate).FirstOrDefault())
                .ToList();*/

            var invitations = defaultInvitations
                .Select(x => new { x.UserId, x.InsertedDate })
                .GroupBy(x => x.UserId)
                .ToDictionary(x => x.Key, x => x.LastOrDefault().InsertedDate);

            List<PortalUsersTLModel> teamLeadModels = teamLeadsQuery.Select(item => new PortalUsersTLModel
            {
                Id = item.Id,
                User = new PortalUserModel(item.User, item.IsRegistered, invitations.ContainsKey(item.UserId) ? invitations[item.UserId] : null),
                ClinicIds = item.Clinics.Where(x => x.IsActive).Select(x => x.ClinicId).Distinct().ToList(),
                ClinicNames = item.Clinics.Where(x => x.IsActive).Select(x => x.Clinic.Name).Distinct().ToList(),
                InsertedDate = item.InsertedDate,
                IsRegistered = item.IsRegistered,
                ProvinceIds = item.Clinics.Where(x => x.IsActive && x.Clinic.SubDistrict != null).Select(x => x.Clinic.SubDistrict.District.ProvinceId).Distinct().ToList(),
                SubDistrictIds = item.Clinics.Where(x => x.IsActive && x.Clinic.SubDistrict != null).Select(x => (Guid)x.Clinic.SubDistrictId).Distinct().ToList()
            }).ToList();


            List<PortalUsersTLModel> filteredUsers = new List<PortalUsersTLModel>();

            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_active))
            {
                filteredUsers.AddRange(teamLeadModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_expired))
            {
                filteredUsers.AddRange(teamLeadModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
            {
                filteredUsers.AddRange(teamLeadModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date >= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_6_months))
            {
                filteredUsers.AddRange(teamLeadModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date <= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
            {
                filteredUsers.AddRange(teamLeadModels.Where(x => x.User.IsActive == false).ToList());
            }

            if (provinceSearch != null && provinceSearch.Any())
            {
                foreach (var item in teamLeadModels)
                {
                    foreach (var province in item.ProvinceIds)
                    {
                        if (provinceSearch.Contains(province.ToString()))
                        {
                            filteredUsers.Add(item);
                        }
                    }
                }
            }
            if (clinicSearch != null && clinicSearch.Any())
            {
                foreach (var item in teamLeadModels)
                {
                    foreach (var name in item.ClinicNames)
                    {
                        if (clinicSearch.Contains(name))
                        {
                            filteredUsers.Add(item);
                        }
                    }
                }
            }

            if (subDistrictSearch != null && subDistrictSearch.Any())
            {
                foreach (var item in teamLeadModels)
                {
                    foreach (var sub in item.SubDistrictIds)
                    {
                        if (subDistrictSearch.Contains(sub.ToString()))
                        {
                            filteredUsers.Add(item);
                        }
                    }
                }
            }

            return connectUsageSearch.Any() || provinceSearch.Any() || clinicSearch.Any() || subDistrictSearch.Any() 
                ? filteredUsers.DistinctBy(x => x.Id).ToList() 
                : teamLeadModels;
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
                var clinics = new List<BaseClinicModel>();
                var totalClinicMeetings = 0;
                var totalVisitsCompleted = 0;
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
                    clinics.Add(new BaseClinicModel
                    {
                        Id = item.Clinic.Id,
                        Name = item.Clinic.Name,
                    });
                    totalClinicMeetings += item.Clinic.ClinicMeetings.Where(x => x.IsActive && x.MeetingDate.Year == DateTime.Now.Year).Count();
                    totalVisitsCompleted += item.Clinic.ClinicMeetings.Where(x => x.IsActive && x.MeetingDate.Year == DateTime.Now.Year).Select(x => x.TotalSupportVisits).Sum();
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
                var totalMeetingReportsSubmitted = totalClinicMeetings;
                var totalInFieldVisitsCompleted = totalVisitsCompleted;
                return new PortalTeamLeadModel(teamLead.User, clinicNames, siteAddress, clinicNameList.Count, totalHealthCareWorkers,
                                          totalPregnantMoms, totalChildren, totalMeetingReportsSubmitted, totalInFieldVisitsCompleted, clinics);
            }
            return null;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PortalUsersTLModel GetTeamLeadById(
            [Service] ITeamLeadService teamLeadService,
            Guid teamLeadUserId)
        {
            var teamLead = teamLeadService.GetTeamLeadById(teamLeadUserId);

            return teamLead;
        }
    }
}
