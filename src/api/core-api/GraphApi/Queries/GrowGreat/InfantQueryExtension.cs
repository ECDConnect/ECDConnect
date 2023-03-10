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

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat {
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
            string id,
            string visitType = Constants.GGSettings.visitType_all) // visitType can be all / due)
        {
            List<Infant> infants = new List<Infant>();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            
            List<Infant> children = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true)).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true)).ToList();

            if (visitType == Constants.GGSettings.visitType_due)
            {
                foreach (var child in children)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, true);
                    child.NextVisitDate = infantManager.GetClientsNextVisitDate(child.Id);
                    if (child.StatusInfo.Color == MetricsIconEnum.Warning.ToString() && child.StatusInfo.Subject.Contains(" due "))
                    {
                        infants.Add(child);
                    }
                }

                foreach (var child in childrenMother)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, true);
                    child.NextVisitDate = infantManager.GetClientsNextVisitDate(child.Id);
                    if (child.StatusInfo.Color == MetricsIconEnum.Warning.ToString() && child.StatusInfo.Subject.Contains(" due "))
                    {
                        infants.Add(child);
                    }
                }

            } else
            {
                foreach (var child in children)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, false);
                    child.NextVisitDate = infantManager.GetClientsNextVisitDate(child.Id);
                    infants.Add(child);
                }

                foreach (var child in childrenMother)
                {
                    child.StatusInfo = infantManager.GetStatusInfo(child, false);
                    child.NextVisitDate = infantManager.GetClientsNextVisitDate(child.Id);
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
            List<Infant> childrenCaregiver = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId.Equals(userId) &&
                                                                           x.IsActive.Equals(true) &&
                                                                           x.InsertedDate.Month == today.Month &&
                                                                           x.InsertedDate.Year == today.Year).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(userId) &&
                                                                        x.IsActive.Equals(true) &&
                                                                        x.InsertedDate.Month == today.Month &&
                                                                        x.InsertedDate.Year == today.Year).ToList();

            childCount = childrenCaregiver.Count + childrenMother.Count;

            return childCount;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Visit> GetInfantVisits([Service] VisitManager visitManager, string id) {
            return visitManager.GetVisitsForClient(id, Constants.GGSettings.client_child);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataStatus> GetReferralsForInfant([Service] VisitDataStatusManager visitDataStatusManager, string id) {
            return visitDataStatusManager.GetReferralDataForClient(id, Constants.GGSettings.client_child);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
         public List<VisitData> GetVisitAnswersForInfant([Service] VisitDataManager visitDataManager, string visitId, string visitName, string visitSection) {
             return visitDataManager.GetVisitAnswersForClient(visitId, visitName, visitSection);
         }

         [Permission(PermissionGroups.USER, GraphActionEnum.View)]
         public Progress_VisitDataStatus GetPreviousVisitInformationForInfant([Service] VisitDataStatusManager visitDataStatusManager, string visitId) {
             return visitDataStatusManager.GetPreviousVisitInformationForClient(visitId);
         }

         [Permission(PermissionGroups.USER, GraphActionEnum.View)]
         public List<VisitData> GetGrowthDataForInfant([Service] VisitDataManager visitDataManager, string id) {
             return visitDataManager.GetGrowthDataForInfant(id);
         }

    }
}
