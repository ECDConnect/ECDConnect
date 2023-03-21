using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat {
    [ExtendObjectType(OperationTypeNames.Query)]
    public class MotherQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothers(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().ToList();

            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothersForHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] MotherManager motherManager,
            string id,
            string visitType = Constants.GGSettings.visitType_all) // visitType can be all / overdue / due
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> allMothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true)).ToList();
            List<Mother> mothers = new List<Mother>();

            if (visitType == Constants.GGSettings.visitType_due)
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother.Id, true);
                    mother.NextVisitDate = motherManager.GetClientsNextVisitDate(mother.Id);
                    if (mother.StatusInfo.Color == MetricsIconEnum.Warning.ToString() && mother.StatusInfo.Subject.Contains(" due "))
                    {
                        mothers.Add(mother);
                    }
                }
            } else if (visitType == Constants.GGSettings.visitType_overdue)
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother.Id, true);
                    mother.NextVisitDate = motherManager.GetClientsNextVisitDate(mother.Id);
                    if (mother.StatusInfo.Color == MetricsIconEnum.Error.ToString() && mother.StatusInfo.Subject.Contains(" overdue "))
                    {
                        mothers.Add(mother);
                    }
                }
            } else
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother.Id, false);
                    mother.NextVisitDate = motherManager.GetClientsNextVisitDate(mother.Id);
                    mothers.Add(mother);
                }
            }
            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Mother GetMotherById(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            Mother mother = motherRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();

            return mother;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetMotherCountForHealthCareWorkerForMonth(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string id)
        {
            DateTime today = DateTime.Today;

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == id &&
                                                                  x.IsActive.Equals(true) && 
                                                                  x.InsertedDate.Month == today.Month &&
                                                                  x.InsertedDate.Year == today.Year).ToList();

            return mothers.Count;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Visit> GetMotherVisits([Service] VisitManager visitManager, string id)
        {
            return visitManager.GetVisitsForClient(id, Constants.GGSettings.client_mother);
        }

       [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataStatus> GetReferralsForMother([Service] VisitDataStatusManager visitDataStatusManager, string id)
        {
            return visitDataStatusManager.GetReferralDataForClient(id, Constants.GGSettings.client_mother);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitData> GetVisitAnswersForMother([Service] VisitDataManager visitDataManager, string visitId, string visitName, string visitSection) {
            return visitDataManager.GetVisitAnswersForClient( visitId, visitName, visitSection );
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Progress_VisitDataStatus GetPreviousVisitInformationForMother([Service] VisitDataStatusManager visitDataStatusManager, string visitId) {
            return visitDataStatusManager.GetPreviousVisitInformationForClient(visitId);
        }
        
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Progress_VisitDataStatus GetVisitClientSummaryDataForMother([Service] VisitDataStatusManager visitDataStatusManager, string id)
        {
            var totalGreen = 0;
            var totalRed = 0;
            var totalAmber = 0;
            Progress_VisitDataStatus result = new Progress_VisitDataStatus();

            // Allows user to review all progress information generated during the visit & allows user to share the summary with the client (generates G9);
            List<VisitDataStatus> visitDataStatus = visitDataStatusManager.GetSummaryDataForClient(id, Constants.GGSettings.client_mother);

            totalGreen = visitDataStatus.Where(x => x.Color == MetricsColorEnum.Success.ToString()).Count();
            totalRed = visitDataStatus.Where(x => x.Color == MetricsColorEnum.Error.ToString()).Count();
            totalAmber = visitDataStatus.Where(x => x.Color == MetricsColorEnum.Warning.ToString()).Count();

            result.Score = totalGreen.ToString() + " / " + (totalGreen + totalRed + totalAmber).ToString();
            result.VisitDataStatus = visitDataStatus;
            return result;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataSummary> GetVisitClientSummaryForMother(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            IDbContextFactory<AuthenticationDbContext> dbContextFactory,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbContext = dbContextFactory.CreateDbContext();
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(dbContext, userContext: uId);
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(dbContext, userContext: uId);
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(dbContext, userContext: uId);

            List<VisitDataSummary> sumData = new List<VisitDataSummary>();
            List<String> visitSections = new List<String>();
            visitSections = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.Type == Constants.GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
            ).Select(y => y.Section).Distinct().ToList();

            foreach (string section in visitSections)
            {
                VisitDataSummary summaryData = new VisitDataSummary();
                summaryData.VisitSection = section;

                List<VisitDataStatus> visitDataStatus = new List<VisitDataStatus>();
                visitDataStatus = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                    join visitData in visitDataRepo.GetAll() on visit.Id equals visitData.VisitId
                    join visitStatusData in visitDataStatusRepo.GetAll().Where(x => x.Type == Constants.GGSettings.visit_data_client_summary) on visitData.Id equals visitStatusData.VisitDataId
                    select visitStatusData
                ).ToList();

                summaryData.VisitDataStatus = visitDataStatus;
                sumData.Add(summaryData);
            }

            return sumData;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitBackReferral> GetBackReferralsForMother([Service] VisitBackReferralManager visitBackReferralManager, string id, bool referralCompleted, bool backReferralCompleted) {
            return visitBackReferralManager.GetBackReferralDataForClient(id, Constants.GGSettings.client_mother, referralCompleted, backReferralCompleted);
        }

    }
}
