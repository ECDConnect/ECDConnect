using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
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
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NPOI.XWPF.UserModel;
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
                                                      string provinceSearch = null,
                                                      string clinicSearch = null,
                                                      string visitSearch = null,
                                                      string connectUsageSearch = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var teamLeads = repoFactory.CreateRepository<TeamLead>(userContext: uId).GetAll(pagingInput);
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var shortenUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);

            if (!string.IsNullOrWhiteSpace(search))
                teamLeads = teamLeads
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));

            if (!string.IsNullOrWhiteSpace(provinceSearch))
            {
                teamLeads = teamLeads.Where(h => h.Clinics.Any(c => EF.Functions.ILike(c.Clinic.SiteAddress.Province.Description, $"%{provinceSearch}%")));
            }

            if (!string.IsNullOrWhiteSpace(clinicSearch))
            {
                teamLeads = teamLeads.Where(h => h.Clinics.Any(c => EF.Functions.ILike(c.Clinic.Name, $"%{clinicSearch}%")));
            }

            if (cancellationToken.IsCancellationRequested)
                return null;


            // Get ids and tokens
            List<Guid> userIds = teamLeads.Select(x => (Guid)x.UserId).ToList();
            List<ShortenUrlEntity> invitations = shortenUrlRepo
                    .GetAll().Where(x => userIds.Contains((Guid)x.UserId) && x.MessageType == TemplateTypeConstants.Invitation && x.IsActive && x.Clicked == 0)
                    .ToList();

            List<PortalUsersTLModel> teamLeaders = teamLeads.Select(item => new PortalUsersTLModel
            {
                Id = item.Id,
                User = new PortalUserModel(item.User, invitations),
                ClinicIds = item.Clinics.Select(x => (Guid)x.Id).ToList(),
                InsertedDate = item.InsertedDate
            }).ToList();


            if (!string.IsNullOrWhiteSpace(connectUsageSearch))
            {
                var today = DateTime.Now;
                var sixMonths = today.AddMonths(-6);
                var twelveMonths = today.AddMonths(-12);

                if (connectUsageSearch == Constants.PortalSettings.usage_invitation_active)
                {
                    teamLeaders = teamLeaders.Where(x => x.User.ConnectUsage == Constants.PortalSettings.usage_invitation_active).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_invitation_expired)
                {
                    teamLeaders = teamLeaders.Where(x => x.User.ConnectUsage == Constants.PortalSettings.usage_invitation_expired).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_last_online_6_months)
                {
                    teamLeaders = teamLeaders.Where(x => x.User.LastSeen.Date >= sixMonths.GetStartOfMonth().Date).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_last_online_12_months)
                {
                    teamLeaders = teamLeaders.Where(x => x.User.LastSeen.Date <= twelveMonths.GetStartOfMonth().Date).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_removed)
                {
                    teamLeaders = teamLeaders.Where(x => x.User.IsActive == false).ToList();
                }
            }

            if (!string.IsNullOrWhiteSpace(visitSearch))
            {
                var clinicIds = teamLeaders.Select(x => x.ClinicIds).ToList();
                var combinedClinicIds = clinicIds.SelectMany(x => x).ToList();
                var hcwIds = hcwRepo.GetAll().Where(x => combinedClinicIds.Contains((Guid)x.ClinicId)).Select(x => x.UserId).ToList();

                var visits = visitRepo.GetAll().Where(x => x.Attended == true &&
                                                           x.ActualVisitDate.HasValue &&
                                                           (x.ActualVisitDate.Value.Date >= DateTime.Now.GetStartOfMonth() && x.ActualVisitDate.Value.Date <= DateTime.Now.GetEndOfMonth()) &&
                                                           (x.Mother.IsActive && hcwIds.Contains((Guid)x.Mother.HealthCareWorker.UserId) ||
                                                           (x.Infant.IsActive && hcwIds.Contains((Guid)x.Infant.Caregiver.HealthCareWorker.UserId)))
                                                           ).ToList();

                List<PortalUsersTLModel> visitTeamLeaders = new List<PortalUsersTLModel>();
                foreach (var item in teamLeaders)
                {
                    var totalClientsVisits = visits.Where(x => item.ClinicIds.Contains((Guid)x.Mother.HealthCareWorker.ClinicId) || item.ClinicIds.Contains((Guid)x.Infant.Caregiver.HealthCareWorker.ClinicId)).Count();

                    if (visitSearch == Constants.PortalSettings.visit_high_activity)
                    {
                        if (totalClientsVisits >= 20)
                        {
                            visitTeamLeaders.Add(item);
                        }
                    }
                    else if (visitSearch == Constants.PortalSettings.visit_medium_activity)
                    {
                        if (totalClientsVisits > 0 && totalClientsVisits <= 10)
                        {
                            visitTeamLeaders.Add(item);
                        }
                    }
                    else // Low activity (no home visits in the past month)
                    {
                        if (totalClientsVisits == 0)
                        {
                            visitTeamLeaders.Add(item);
                        }
                    }
                }
                return visitTeamLeaders;
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
                new List<string> {"Passport", "Number, (required if type of identification is 'passport')"},
                new List<string> {"First name", "Text, (required)"},
                new List<string> {"Surname", "Text, (required)"},
                new List<string> {"Cellphone number", "Number, (required, 10 digits)"},
                new List<string> {"Email address", "email, (optional)"},
                new List<string> {"Clinic ID 1", "Clinic ID 1, (required)" },
                new List<string> {"Clinic ID 2", "Clinic ID 2, (optional)" }
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
                    "Email address",
                    "Clinic Id 1",
                    "Clinic Id 2"
                }
            };

            var clinicNameSheet = $"Clinic Names";
            var clinicRepo = repoFactory.CreateGenericRepository<Clinic>(userContext: uId);
            var clinicNames = clinicRepo.GetAll().Where(c => c.TenantId == TenantExecutionContext.Tenant.Id).Select(c => new List<string> { c.Name, c.Id.ToString(), "" }).ToList();

            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList },
                { clinicNameSheet, clinicNames }
            };

            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }
    }
}
