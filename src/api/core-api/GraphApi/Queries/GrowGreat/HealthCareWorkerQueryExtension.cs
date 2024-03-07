using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
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
    public class HealthCareWorkerQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalUsersHCWModel> GetAllHealthCareWorkers([Service] IHttpContextAccessor contextAccessor,
                                                              IGenericRepositoryFactory repoFactory,
                                                              CancellationToken cancellationToken, 
                                                              PagedQueryInput pagingInput = null,
                                                              string search = null,
                                                              string provinceSearch = null,
                                                              string clinicSearch = null,
                                                              string subDistrictSearch = null,
                                                              string visitSearch = null,
                                                              string connectUsageSearch = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var healthCareWorkers = healthCareWorkerRepo.GetAll(pagingInput);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var shortenUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);

            // FILTER HEALTH CARE WORKERS
            if (!string.IsNullOrWhiteSpace(search))
                healthCareWorkers = healthCareWorkers
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));

            if (!string.IsNullOrWhiteSpace(subDistrictSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.Clinic.SubDistrict.Name, $"%{subDistrictSearch}%"));

            if (!string.IsNullOrWhiteSpace(provinceSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.Clinic.SubDistrict.District.Province.Description, $"%{provinceSearch}%"));

            if (!string.IsNullOrWhiteSpace(clinicSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.Clinic.Name, $"%{clinicSearch}%"));

            if (cancellationToken.IsCancellationRequested)
                return null;

            // Get ids and tokens
            List<Guid> userIds = healthCareWorkers.Select(x => (Guid)x.UserId).ToList();
            List<ShortenUrlEntity> invitations = shortenUrlRepo
                    .GetAll().Where(x => userIds.Contains((Guid)x.UserId) && x.MessageType == TemplateTypeConstants.Invitation && x.IsActive && x.Clicked == 0)
                    .ToList();

            List<PortalUsersHCWModel> workers = healthCareWorkers.Select(item => new PortalUsersHCWModel
            {
                Id = item.Id,
                User = new PortalUserModel(item.User, invitations),
                ClinicId = item.ClinicId,
                InsertedDate = item.InsertedDate,
            }).ToList();

            if (!string.IsNullOrWhiteSpace(connectUsageSearch))
            {
                var today = DateTime.Now;
                var sixMonths = today.AddMonths(-6);
                var twelveMonths = today.AddMonths(-12);

                if (connectUsageSearch == Constants.PortalSettings.usage_invitation_active)
                {
                    workers = workers.Where(x => x.User.ConnectUsage == Constants.PortalSettings.usage_invitation_active).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_invitation_expired)
                {
                    workers = workers.Where(x => x.User.ConnectUsage == Constants.PortalSettings.usage_invitation_expired).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_last_online_6_months)
                {
                    workers = workers.Where(x => x.User.LastSeen.Date >= sixMonths.GetStartOfMonth().Date).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_last_online_12_months)
                {
                    workers = workers.Where(x => x.User.LastSeen.Date <= twelveMonths.GetStartOfMonth().Date).ToList();
                }
                else if (connectUsageSearch == Constants.PortalSettings.usage_removed)
                {
                    workers = workers.Where(x => x.User.IsActive == false).ToList();
                }
            }

            if (!string.IsNullOrWhiteSpace(visitSearch))
            {
               var visits = visitRepo.GetAll().Where(x => x.Attended == true &&
                                                           x.ActualVisitDate.HasValue &&
                                                           (x.ActualVisitDate.Value.Date >= DateTime.Now.GetStartOfMonth() && x.ActualVisitDate.Value.Date <= DateTime.Now.GetEndOfMonth()) &&
                                                           (x.Mother.IsActive && userIds.Contains((Guid)x.Mother.HealthCareWorker.UserId) ||
                                                           (x.Infant.IsActive && userIds.Contains((Guid)x.Infant.Caregiver.HealthCareWorker.UserId))
                                                           )
                                                           ).ToList();
                
                List<PortalUsersHCWModel> visitHCWs = new List<PortalUsersHCWModel>();
                foreach (var item in workers)
                {
                    var totalClientsVisits = visits.Where(x => x.Mother.HealthCareWorker.UserId == item.User.Id || x.Infant.Caregiver.HealthCareWorker.UserId == item.User.Id).Count();

                    if (visitSearch == Constants.PortalSettings.visit_high_activity)
                    {
                        if (totalClientsVisits >= 20)
                        {
                            visitHCWs.Add(item);
                        }
                    } else if (visitSearch == Constants.PortalSettings.visit_medium_activity)
                    {
                        if (totalClientsVisits > 0 && totalClientsVisits <= 10)
                        {
                            visitHCWs.Add(item);
                        }
                    }
                    else // Low activity (no home visits in the past month)
                    {
                        if (totalClientsVisits == 0)
                        {
                            visitHCWs.Add(item);
                        }
                    }
                }
                return visitHCWs;
            }

            return workers;
        }
       
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        public int GetCountHealthCareWorkers(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            PagedQueryInput pagingInput = null,
            string search = null,
            string provinceSearch = null,
            string clinicSearch = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var healthCareWorkers = healthCareWorkerRepo.GetAll(pagingInput);

            if (!string.IsNullOrWhiteSpace(search))
            {
                healthCareWorkers = healthCareWorkers
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            }

            if (!string.IsNullOrWhiteSpace(provinceSearch))
            {
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.Clinic.SiteAddress.Province.Description, $"%{provinceSearch}%"));
            }

            if (!string.IsNullOrWhiteSpace(clinicSearch))
            {
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.Clinic.Name, $"%{clinicSearch}%"));
            }

            return healthCareWorkers.Count();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HealthCareWorkerModel GetHealthCareWorkerByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IPointsEngineService pointsEngineService,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId == Guid.Parse(userId)).OrderBy(x => x.Id).FirstOrDefault();
           
            return new HealthCareWorkerModel(healthCareWorker);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HCWVisitStatus GetHealthCareWorkerVisitStatus([Service] VisitManager visitManager, string userId)
        {
            var visitStatus = new HCWVisitStatus();
            visitStatus.MotherOverDueVisits = visitManager.GetMissedVisitsForHCWCount(userId, Constants.GGSettings.client_mother);
            visitStatus.MotherDueVisits = visitManager.GetVisitsDueForHCWCount(userId, Constants.GGSettings.client_mother);
            visitStatus.ChildDueVisits = visitManager.GetVisitsDueForHCWCount(userId, Constants.GGSettings.client_child);

            return visitStatus;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HCWHighlights GetHealthCareWorkerHighlights(
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            [Service] InfantManager infantManager,
            [Service] MotherManager motherManager,
            string userId)
        {
            HCWHighlights highlights = new HCWHighlights();

            highlights.TotalThisWeekFamilyVisits = visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_mother, true) + visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_child, true);
            highlights.TotalThisWeekGrowthMonitored = visitDataManager.GetTotalGrowthInfantsForWeek(userId, true);
            highlights.TotalThisWeekNewClients = motherManager.GetTotalNewMothersForWeek(userId, true) + infantManager.GetTotalNewInfantsForWeek(Guid.Parse(userId), true);

            highlights.TotalLastWeekFamilyVisits = visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_mother, false) + visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_child, false); ;
            highlights.TotalLastWeekGrowthMonitored = visitDataManager.GetTotalGrowthInfantsForWeek(userId, false);
            highlights.TotalLastWeekNewClients = motherManager.GetTotalNewMothersForWeek(userId, false) + infantManager.GetTotalNewInfantsForWeek(Guid.Parse(userId), false);

            return highlights;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HCWSummary GetHealthCareWorkerSummaryForPeriod(
            [Service] VisitManager visitManager,
            [Service] InfantManager infantManager,
            [Service] MotherManager motherManager,
            IGenericRepositoryFactory repoFactory,
            string userId,
            string healthCareWorkerId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            // Take given date or take now with 30 days back
            var _endDate = (endDate?.ToUniversalTime() ?? DateTime.UtcNow).Date.AddDays(1).Subtract(TimeSpan.FromMicroseconds(1));
            DateTime _startDate = DateTime.UtcNow;

            if (startDate >= endDate)
            {
                var a = _startDate;
                _startDate = _endDate.Date;
                _endDate = a;
            }
            else
                _startDate = (startDate?.ToUniversalTime().Date ?? DateTime.UtcNow.Date.Subtract(TimeSpan.FromDays(30)));

            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>();
            Guid.TryParse(healthCareWorkerId, out Guid hcwId);
            var communityHealthWorker = healthCareWorkerRepo.GetById(hcwId);

            var healthCareWorkerUserId = communityHealthWorker == null ? Guid.Parse(userId) : communityHealthWorker.UserId.Value;

            //if (healthCareWorkerUserId is null)
            //    throw new QueryException("User does not exist.");

            HCWSummary summary = new HCWSummary();

            // TODO: its meant to be filtered to the current date range: , _startDate, _endDate);
            summary.TotalPregnantMoms = motherManager.GetTotalPregnantMothers(healthCareWorkerUserId, _startDate, _endDate);
            summary.TotalChildren = infantManager.GetTotalInfantCountForPeriod(healthCareWorkerUserId, _startDate, _endDate);

            summary.TotalClientsVisited = visitManager.GetTotalVisitsCompletedForPeriod(healthCareWorkerUserId.ToString(), null, _startDate, _endDate);

            // Mothers and Infants are folders.
            summary.TotalFoldersOpened = motherManager.GetTotalNewClientsForPeriod(healthCareWorkerUserId, _startDate, _endDate);

            summary.TotalVisitsMissed = visitManager.GetTotalVisitsMissedForPeriod(healthCareWorkerUserId.ToString(), Constants.GGSettings.client_child, _startDate, _endDate);

            var motherVisitsOverdue = visitManager.GetTotalVisitsOverdueForPeriod(healthCareWorkerUserId.ToString(), Constants.GGSettings.client_mother, _startDate, _endDate);
            var infantVisitsOverdue = visitManager.GetTotalVisitsOverdueForPeriod(healthCareWorkerUserId.ToString(), Constants.GGSettings.client_mother, _startDate, _endDate);
            summary.TotalVisitsOverdue = motherVisitsOverdue + infantVisitsOverdue;

            summary.TotalPregnantMomsWithUrgentIssues = visitManager.GetTotalPregnantMothersWithUrgentIssues(healthCareWorkerUserId.ToString(), _startDate, _endDate);
            summary.TotalCaregiversAndChildrenWithUrgentIssues = visitManager.GetTotalCaregiversAndChildrenWithUrgentIssues(healthCareWorkerUserId.ToString(), _startDate, _endDate);

            summary.TotalPregnantMomsWithIssues = visitManager.GetTotalPregnantMothersWithIssues(healthCareWorkerUserId.ToString(), _startDate, _endDate);
            summary.TotalCaregiversAndChildrenWithIssues = visitManager.GetTotalCaregiversAndChildrenWithIssues(healthCareWorkerUserId.ToString(), _startDate, _endDate); ;

            summary.TotalPregnantMomsWithNoIssues = visitManager.GetTotalPregnantMothersWithNoIssues(healthCareWorkerUserId.ToString(), _startDate, _endDate);
            summary.TotalChildrenWithNoIssues = visitManager.GetTotalCaregiversAndChildrenWithNoIssues(healthCareWorkerUserId.ToString(), _startDate, _endDate); ;

            return summary;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiversForHCW(
            [Service] CaregiverManager caregiverManager,
            [Service] InfantManager infantManager,
            [Service] MotherManager motherManager,
            string userId,
            int recordsPerPage = Constants.GGSettings.recordsPerPage,
            int pageNumber = Constants.GGSettings.pageNumber)
        {
            List<Caregiver> caregivers = caregiverManager.GetAllCaregiversForHCW(Guid.Parse(userId), recordsPerPage, pageNumber);

            foreach (var caregiver in caregivers)
            {
                caregiver.Infants = infantManager.GetAllInfantsForCaregiver(caregiver.Id);
                caregiver.Mother = motherManager.GetMotherForCaregiver(caregiver.Id);
            }

            return caregivers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Document> GetDocumentsForHCW([Service] IHttpContextAccessor contextAccessor, IGenericRepositoryFactory repoFactory, string createdUserId)
        {

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var documentRepo = repoFactory.CreateGenericRepository<Document>(userContext: uId);
            List<Document> documents = documentRepo.GetAll().Where(x => x.CreatedUserId == Guid.Parse(createdUserId) || x.UpdatedBy == createdUserId).OrderBy(x => x.Name).ToList();
            return documents;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> HealthCareWorkerTemplateGenerator(
          [Service] IFileGenerationService fileService,
          [Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory)
        {

            var user = contextAccessor.HttpContext.GetUser();
            var uId = user.Id;

            var fieldDefinitionList = new List<List<string>>
            {
                new List<string>{"Column", "Type Description"},
                new List<string>{"Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string>{"ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string>{"Passport number", "Number, (required if type of identification is 'passport')"},
                new List<string>{"First name", "Text, (required)"},
                new List<string>{"Surname", "Text, (required)"},
                new List<string>{"Cellphone number", "Number, (required, 10 digits)"},
                new List<string>{"Clinic ID", "Clinic's ID, (required)" }
            };
            var fieldDefinitionSheet = $"Field Definition";

            var templateHeaders = new List<List<string>>
            {
                new List<string>{
                    "Type of identification",
                    "ID number",
                    "Passport number",
                    "First name",
                    "Surname",
                    "Cellphone number",
                    "Clinic ID"
                }
            };
            var templateHeaderSheet = $"Community Health Worker Template";

            var clinicNameSheet = $"Clinic Names";
            var clinicRepo = repoFactory.CreateGenericRepository<Clinic>(userContext: uId);
            var clinicNames = clinicRepo.GetAll().Where(c => c.TenantId == TenantExecutionContext.Tenant.Id).Select(c => new List<string> { c.Name, c.Id.ToString(), "" }).ToList();

            var fileName = templateHeaderSheet.Replace(" ", "_");
            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList },
                { clinicNameSheet, clinicNames }
            };

            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

    }
}
