using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
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
        public IQueryable<HealthCareWorker> GetAllHealthCareWorkers(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            CancellationToken cancellationToken, 
            PagedQueryInput pagingInput = null,
            string search = null,
            string provinceSearch = null,
            string clinicSearch = null,
            string teamLeadSearch = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var healthCareWorkers = healthCareWorkerRepo.GetAll(pagingInput);

            if (!string.IsNullOrWhiteSpace(search))
                healthCareWorkers = healthCareWorkers
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));

            if (!string.IsNullOrWhiteSpace(teamLeadSearch))
            {
                healthCareWorkers = healthCareWorkers
                    .Include(h => h.TeamLead.User)
                    .Where(h => EF.Functions.ILike(h.TeamLead.User.FullName, $"%{teamLeadSearch}%")
                    || EF.Functions.ILike(h.TeamLead.User.IdNumber, $"%{teamLeadSearch}%")
                    || EF.Functions.ILike(h.TeamLead.User.PhoneNumber, $"%{teamLeadSearch}%")
                    || EF.Functions.ILike(h.TeamLead.User.Email, $"%{teamLeadSearch}%"));
            }

            if (!string.IsNullOrWhiteSpace(provinceSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.TeamLead.Clinic.SiteAddress.Province.Description, $"%{provinceSearch}%"));

            if (!string.IsNullOrWhiteSpace(clinicSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.TeamLead.Clinic.Name, $"%{clinicSearch}%"));
            
            if (cancellationToken.IsCancellationRequested)
                return null;
            return healthCareWorkers;
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
                healthCareWorkers = healthCareWorkers
                    .Where(h => EF.Functions.ILike(h.User.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            if (!string.IsNullOrWhiteSpace(provinceSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.TeamLead.Clinic.SiteAddress.Province.Description, $"%{provinceSearch}%"));
            if (!string.IsNullOrWhiteSpace(clinicSearch))
                healthCareWorkers = healthCareWorkers.Where(h => EF.Functions.ILike(h.TeamLead.Clinic.Name, $"%{clinicSearch}%"));

            return healthCareWorkers.Count();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HealthCareWorker GetHealthCareWorkerByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IPointsEngineService pointsEngineService,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            HealthCareWorker healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId.Equals(userId)).OrderBy(x => x.Id).FirstOrDefault();
            DateTime today = DateTime.Now.Date;

            var pointsEngineData = new HCWPointsEngine();
            pointsEngineData.PointsLibrary = pointsEngineService.GetPointsLibraryForTenant();  // use this for showing points that can be earned
            pointsEngineData.PointsUserSummary = pointsEngineService.GetSummaryUserPoints(healthCareWorker.Id.ToString(), today.Year); // this is a summary of points earned

            healthCareWorker.PointsEngineData = pointsEngineData;
            return healthCareWorker;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HCWVisitStatus GetHealthCareWorkerVisitStatus([Service] VisitManager visitManager, string userId)
        {
            HCWVisitStatus visitStatus = new HCWVisitStatus();
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

            highlights.totalThisWeekFamilyVisits = visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_mother, true) + visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_child, true);
            highlights.totalThisWeekGrowthMonitored = visitDataManager.GetTotalGrowthInfantsForWeek(userId, true);
            highlights.totalThisWeekNewClients = motherManager.GetTotalNewMothersForWeek(userId, true) + infantManager.GetTotalNewInfantsForWeek(userId, true);

            highlights.totalLastWeekFamilyVisits = visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_mother, false) + visitManager.GetTotalVisitsForWeek(userId, Constants.GGSettings.client_child, false); ;
            highlights.totalLastWeekGrowthMonitored = visitDataManager.GetTotalGrowthInfantsForWeek(userId, false);
            highlights.totalLastWeekNewClients = motherManager.GetTotalNewMothersForWeek(userId, false) + infantManager.GetTotalNewInfantsForWeek(userId, false);

            return highlights;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HCWSummary GetHealthCareWorkerSummaryForPeriod(
            [Service] VisitManager visitManager,
            [Service] InfantManager infantManager,
            [Service] MotherManager motherManager,
            string userId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            DateTime today = DateTime.Today;

            // Take given date or take start of this week.
            var _startDate = startDate ?? DateTimeExtensions.StartOfWeek(startDate ?? DateTime.Today, DayOfWeek.Monday);
            // Take given date or use end of this week.
            var _endDate = endDate ?? _startDate.Add(TimeSpan.FromDays(7).Subtract(TimeSpan.FromMilliseconds(1)));

            HCWSummary summary = new HCWSummary();

            // TODO: its meant to be filtered to the current date range: , _startDate, _endDate);
            summary.totalPregnantMoms = visitManager.GetTotalPregnantMothers(userId, _startDate, _endDate);
            summary.totalChildren = infantManager.GetTotalInfantCountForPeriod(userId, _startDate, _endDate);
            
            var mothersAdnChildren = new string[] { Constants.GGSettings.client_mother, Constants.GGSettings.client_child };
            summary.totalClientsVisited = visitManager.GetTotalVisitsCompletedForPeriod(userId, mothersAdnChildren, startDate, endDate);

            // Mothers are folders.
            summary.totalFoldersOpened = motherManager.GetTotalNewMothersForPeriod(userId, _startDate, _endDate);

            // Pregnant Mom Visits cannot be missed and will only be overdue.
            summary.totalVisitsMissed = visitManager.GetTotalVisitsMissedForPeriod(userId, Constants.GGSettings.client_child, _startDate, _endDate);

            summary.totalPregnantMomsWithUrgentIssues = visitManager.GetTotalPregnantMothersWithUrgentIssues(userId, _startDate, _endDate);
            summary.totalCaregiversAndChildrenWithUrgentIssues = visitManager.GetTotalCaregiversAndChildrenWithUrgentIssues(userId, _startDate, _endDate);
            
            // Pregnant Mom Visits cannot be missed and will only be overdue.
            summary.totalVisitsOverdue = visitManager.GetTotalVisitsMissedForPeriod(userId, Constants.GGSettings.client_mother, _startDate, _endDate);
            summary.totalPregnantMomsWithIssues = visitManager.GetTotalPregnantMothersWithIssues(userId, _startDate, _endDate);
            summary.totalCaregiversAndChildrenWithIssues = visitManager.GetTotalCaregiversAndChildrenWithIssues(userId, _startDate, _endDate); ;

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
            List<Caregiver> caregivers = caregiverManager.GetAllCaregiversForHCW(userId, recordsPerPage, pageNumber);

            foreach (var caregiver in caregivers)
            {
                caregiver.Infants = infantManager.GetAllInfantsForCaregiver(caregiver.Id.ToString());
                caregiver.Mother = motherManager.GetMotherForCaregiver(caregiver.Id.ToString());
            }

            return caregivers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Document> GetDocumentsForHCW([Service] IHttpContextAccessor contextAccessor, IGenericRepositoryFactory repoFactory, string createdUserId)
        {

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var documentRepo = repoFactory.CreateGenericRepository<Document>(userContext: uId);
            List<Document> documents = documentRepo.GetAll().Where(x => x.CreatedUserId == createdUserId || x.UpdatedBy == createdUserId).OrderBy(x => x.Name).ToList();
            return documents;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> HealthCareWorkerTemplateGenerator(
          [Service] IFileGenerationService fileService)
        {
            var fieldDefinitionList = new List<List<string>>
            {
                new List<string>{"Column", "Type Description"},
                new List<string>{"Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string>{"ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string>{"Passport number", "Number, (required if type of identification is 'passport')"},
                new List<string>{"First name", "Text, (required)"},
                new List<string>{"Surname", "Text, (required)"},
                new List<string>{"Cellphone number", "Number, (required, 10 digits)"},
                new List<string>{"Team Lead ID", "Team Lead's ID number, (required; please add all TLs before linking them to CHWs, the ID number added must match a Team Lead currently on CHW Connect)" }
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
                    "Team Lead ID"
                }
            };
            var templateHeaderSheet = $"Community Health Worker Template";

            var fileName = templateHeaderSheet.Replace(" ", "_");
            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList },
            };

            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

    }
}
