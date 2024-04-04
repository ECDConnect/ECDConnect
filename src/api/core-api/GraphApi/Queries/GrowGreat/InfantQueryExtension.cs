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
    public class InfantQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfants(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().ToList();

            return children;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfantsForHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] InfantManager infantManager,
            [Service] VisitManager visitManager,
            string id,
            string visitType = Constants.GGSettings.visitType_all) // visitType can be all / due)
        {
            List<Infant> infants = new List<Infant>();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);

            List<Infant> children = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == Guid.Parse(id) && x.IsActive.Equals(true)).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId == Guid.Parse(id) && x.IsActive.Equals(true)).ToList();

            if (visitType == Constants.GGSettings.visitType_due)
            {
                foreach (var child in children)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, true);
                    child.NextVisitDate = visitManager.GetClientsNextDueVisitDate(child.Id, Constants.GGSettings.client_child);
                    var nextVisit = visitManager.GetNextVisitLessThan7DaysAway(child.Id, Constants.GGSettings.client_child, true);
                    if (nextVisit != "")
                    {
                        infants.Add(child);
                    }
                }

                foreach (var child in childrenMother)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, true);
                    child.NextVisitDate = visitManager.GetClientsNextDueVisitDate(child.Id, Constants.GGSettings.client_child);
                    var nextVisit = visitManager.GetNextVisitLessThan7DaysAway(child.Id, Constants.GGSettings.client_child, true);
                    if (nextVisit != "")
                    {
                        infants.Add(child);
                    }
                }
            }
            else
            {
                foreach (var child in children)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, false);
                    child.NextVisitDate = visitManager.GetClientsNextDueVisitDate(child.Id, Constants.GGSettings.client_child);
                    infants.Add(child);
                }

                foreach (var child in childrenMother)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, false);
                    child.NextVisitDate = visitManager.GetClientsNextDueVisitDate(child.Id, Constants.GGSettings.client_child);
                    infants.Add(child);
                }
            }
            return infants;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetInfantCountForHealthCareWorkerForMonth(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            DateTime today = DateTime.Today;

            var childCount = 0;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            List<Infant> childrenCaregiver = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == Guid.Parse(userId) &&
                                                                           x.IsActive.Equals(true) &&
                                                                           x.InsertedDate.Month == today.Month &&
                                                                           x.InsertedDate.Year == today.Year).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId == Guid.Parse(userId) &&
                                                                        x.IsActive.Equals(true) &&
                                                                        x.InsertedDate.Month == today.Month &&
                                                                        x.InsertedDate.Year == today.Year).ToList();

            childCount = childrenCaregiver.Count + childrenMother.Count;

            return childCount;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Visit> GetInfantVisits([Service] VisitManager visitManager, string id)
        {
            return visitManager.GetVisitsForClient(id, Constants.GGSettings.client_child);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataStatus> GetReferralsForInfant([Service] VisitDataStatusManager visitDataStatusManager, string id, string visitId)
        {
            return visitDataStatusManager.GetReferralDataForClient(id, Constants.GGSettings.client_child, visitId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataStatus> GetCompletedReferralsForInfant([Service] VisitDataStatusManager visitDataStatusManager, string id, string visitId)
        {
            return visitDataStatusManager.GetCompletedReferralDataForClient(id, Constants.GGSettings.client_child, visitId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitBackReferral> GetBackReferralsForInfant([Service] VisitBackReferralManager visitBackReferralManager, string id, Boolean referralCompleted, Boolean backReferralCompleted)
        {
            return visitBackReferralManager.GetBackReferralDataForClient(id, Constants.GGSettings.client_child, referralCompleted, backReferralCompleted);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitData> GetVisitAnswersForInfant([Service] VisitDataManager visitDataManager, string visitId, string visitName, string visitSection)
        {
            return visitDataManager.GetVisitAnswersForClient(visitId, visitName, visitSection);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Progress_VisitDataStatus GetPreviousVisitInformationForInfant([Service] VisitDataStatusManager visitDataStatusManager, string visitId)
        {
            var _visitId = new Guid(visitId);
            return visitDataStatusManager.GetPreviousVisitInformationForClient(_visitId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitData> GetGrowthDataForInfant([Service] VisitDataManager visitDataManager, string id)
        {
            return visitDataManager.GetGrowthDataForInfant(id);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<ClientSummary> GetInfantSummaryByGroup(
            [Service] VisitManager visitManager,
            [Service] VisitDataStatusManager visitDataStatusManager,
            string visitId)
        {
            List<ClientSummary> summary = new List<ClientSummary>();

            Guid _visitId = new Guid(visitId);

            var sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.careForMom;
            sumObj.Order = 1;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.careForMom);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.CareForBaby;
            sumObj.Order = 2;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.CareForBaby);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.pillar1_report;
            sumObj.Order = 3;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pillar1_db);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.pillar2_report;
            sumObj.Order = 4;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pillar2_db);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.pillar3_report;
            sumObj.Order = 5;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pillar3_db);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.pillar4_report;
            sumObj.Order = 6;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pillar4_db);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.pillar5_report;
            sumObj.Order = 7;
            sumObj.SummaryData = visitDataStatusManager.GetSummaryDataForVisitByGroup(_visitId, Constants.GGSettings.pillar5_db);
            if (sumObj.SummaryData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.idDocSection;
            sumObj.Order = 8;
            sumObj.DocumentData = visitDataStatusManager.GetIDDocSummaryDataForVisit(_visitId, MetricsColorEnum.Success.ToString());
            if (sumObj.DocumentData != null)
            {
                summary.Add(sumObj);
            }

            sumObj = new ClientSummary();
            sumObj.VisitName = Constants.GGSettings.idDocSection;
            sumObj.Order = 9;
            sumObj.DocumentData = visitDataStatusManager.GetIDDocSummaryDataForVisit(_visitId, MetricsColorEnum.Warning.ToString());
            if (sumObj.DocumentData != null)
            {
                summary.Add(sumObj);
            }

            return summary;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<ClientSummaryByPriority> GetInfantSummaryByPriority(
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
