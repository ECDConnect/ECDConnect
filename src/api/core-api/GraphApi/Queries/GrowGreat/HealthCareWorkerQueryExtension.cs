using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class HealthCareWorkerQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<HealthCareWorker> GetAllHealthCareWorkers(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            List<HealthCareWorker> healthCareWorkers = healthCareWorkerRepo.GetAll().ToList();

            return healthCareWorkers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HealthCareWorker GetHealthCareWorkerByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            HealthCareWorker healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId.Equals(userId)).OrderBy(x => x.Id).FirstOrDefault();

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
            return documentRepo.GetAll().Where(x => x.CreatedUserId == createdUserId).OrderBy(x => x.Name).ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> HealthCareWorkerTemplateGenerator(
          [Service] IFileGenerationService fileService,
          IGenericRepositoryFactory repoFactory)
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
                new List<string>{"Clinic unique ID", "UniqueId, (required; please add all Clinics before linking them to CHWs; to find the unique ID, go to the Clinics section on the admin portal and search for the clinic)"}
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
                    "Clinic unique ID"
                }
            };
            var templateHeaderSheet = $"Healthcare Worker Template";

            var fileName = templateHeaderSheet.Replace(" ", "_");
            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList },
            };

            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

    }
}
