using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
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
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
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
            [Service] VisitManager visitManager,
            string id,
            string visitType = Constants.GGSettings.visitType_all) // visitType can be all / overdue / due
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);

            // first validate if the linked mothers should not be archive because of maternal case records missing after 60 days from when client was registered.
            motherManager.ArchiveMotherProfilesWithoutMaternalRecord(id);

            // Now we can return all active mothers to the FE
            List<Mother> allMothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == Guid.Parse(id) && x.IsActive.Equals(true)).ToList();
            List<Mother> mothers = new List<Mother>();

            if (visitType == Constants.GGSettings.visitType_due)
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother, true);
                    mother.NextVisitDate = visitManager.GetClientsNextDueVisitDate(mother.Id, Constants.GGSettings.client_mother);
                    var nextVisit = visitManager.GetNextVisitLessThan7DaysAway(mother.Id, Constants.GGSettings.client_mother, true);
                     if (nextVisit != "")
                    {
                        mothers.Add(mother);
                    }
                }
            } else if (visitType == Constants.GGSettings.visitType_overdue)
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother, false);
                    mother.NextVisitDate = visitManager.GetClientsNextDueVisitDate(mother.Id, Constants.GGSettings.client_mother);
                    var missedVisit = visitManager.GetFirstMissedVisit(mother.Id, Constants.GGSettings.client_mother);
                    if (missedVisit != "")
                    {
                        mothers.Add(mother);
                    }
                }
            } else
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother, false);
                    mother.NextVisitDate = visitManager.GetClientsNextDueVisitDate(mother.Id, Constants.GGSettings.client_mother);
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
            Mother mother = motherRepo.GetById(Guid.Parse(id));

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
            List<Mother> mothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == Guid.Parse(id) &&
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
        public List<VisitDataStatus> GetReferralsForMother([Service] VisitDataStatusManager visitDataStatusManager, string id, string visitId)
        {
            return visitDataStatusManager.GetReferralDataForClient(id, Constants.GGSettings.client_mother, visitId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataStatus> GetCompletedReferralsForMother([Service] VisitDataStatusManager visitDataStatusManager, string id, string visitId)
        {
            return visitDataStatusManager.GetCompletedReferralDataForClient(id, Constants.GGSettings.client_mother, visitId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitData> GetVisitAnswersForMother([Service] VisitDataManager visitDataManager, string visitId, string visitName, string visitSection)
        {
            return visitDataManager.GetVisitAnswersForClient(visitId, visitName, visitSection);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Progress_VisitDataStatus GetPreviousVisitInformationForMother([Service] VisitDataStatusManager visitDataStatusManager, string visitId)
        {
            var _visitId = new Guid(visitId);
            return visitDataStatusManager.GetPreviousVisitInformationForClient(_visitId);
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
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: uId);

            List<VisitDataSummary> sumData = new List<VisitDataSummary>();
            List<String> visitSections = new List<String>();
            visitSections = (
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
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
                    from visit in visitRepo.GetAll().Where(x => x.Mother.UserId.ToString() == id).OrderBy(x => x.PlannedVisitDate)
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
        public List<VisitBackReferral> GetBackReferralsForMother([Service] VisitBackReferralManager visitBackReferralManager, string id, Boolean referralCompleted, Boolean backReferralCompleted)
        {
            return visitBackReferralManager.GetBackReferralDataForClient(id, Constants.GGSettings.client_mother, referralCompleted, backReferralCompleted);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<ClientSummary> GetMotherSummaryByGroup(
            [Service] VisitManager visitManager,
            [Service] VisitDataStatusManager visitDataStatusManager,
            string visitId)
        {
            List<ClientSummary> summary = new List<ClientSummary>();

            Guid _visitId = new Guid(visitId);

            var sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.antenatalCare;
            sumObj.Order = 1;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pregnancyCare);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.nutrition;
            sumObj.Order = 2;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.nutrition);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.pregnancyCare;
            sumObj.Order = 3;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pregnancyCare);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.dangerSigns;
            sumObj.Order = 4;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.dangerSigns);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.idDocSection;
            sumObj.Order = 5;
            sumObj.DocumentData = visitDataStatusManager.GetIDDocSummaryDataForVisit(_visitId, MetricsColorEnum.Success.ToString());
            if (sumObj.DocumentData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.idDocSection;
            sumObj.Order = 6;
            sumObj.DocumentData = visitDataStatusManager.GetIDDocSummaryDataForVisit(_visitId, MetricsColorEnum.Warning.ToString());
            if (sumObj.DocumentData != null)
            {
                summary.Add(sumObj);
            }

            return summary;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<ClientSummaryByPriority> GetMotherSummaryByPriority(
           [Service] VisitManager visitManager,
           [Service] VisitDataStatusManager visitDataStatusManager,
           string visitId)
        {
            List<ClientSummaryByPriority> summary = new List<ClientSummaryByPriority>();

            Guid _visitId = new Guid(visitId);

            var sumObj = new ClientSummaryByPriority();
            sumObj.AreaName = Constants.GGSettings.doingWell;
            sumObj.Order = 1;
            sumObj.Color = MetricsColorEnum.Success.ToString().ToLower();
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByPriority(_visitId, MetricsColorEnum.Success.ToString());
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummaryByPriority();
            sumObj.AreaName = Constants.GGSettings.needSupport;
            sumObj.Order = 2;
            sumObj.Color = MetricsColorEnum.Warning.ToString().ToLower();
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByPriority(_visitId, MetricsColorEnum.Warning.ToString());
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummaryByPriority();
            sumObj.AreaName = Constants.GGSettings.needUrgentSupport;
            sumObj.Order = 3;
            sumObj.Color = MetricsColorEnum.Error.ToString().ToLower();
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByPriority(_visitId, MetricsColorEnum.Error.ToString());
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummaryByPriority();
            sumObj.AreaName = Constants.GGSettings.idDocSection;
            sumObj.Order = 4;
            sumObj.Color = MetricsColorEnum.Success.ToString().ToLower();
            sumObj.DocumentData = visitDataStatusManager.GetIDDocSummaryDataForVisit(_visitId, MetricsColorEnum.Success.ToString());
            if (sumObj.DocumentData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummaryByPriority();
            sumObj.AreaName = Constants.GGSettings.idDocSection;
            sumObj.Order = 5;
            sumObj.Color = MetricsColorEnum.Warning.ToString().ToLower();
            sumObj.DocumentData = visitDataStatusManager.GetIDDocSummaryDataForVisit(_visitId, MetricsColorEnum.Warning.ToString());
            if (sumObj.DocumentData != null)
            {
                summary.Add(sumObj);
            }

            return summary;
        }

    }
}
