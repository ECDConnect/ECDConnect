using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
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
            [Service] IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().ToList();

            return children;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfantsForHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] InfantManager infantManager,
            string id)
        {
            List<Infant> infants = new List<Infant>();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true)).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true)).ToList();

            foreach (var child in children)
            {
                child.StatusInfo = infantManager.GetStatusInfo(child);
            }

            foreach (var child in childrenMother)
            {
                child.StatusInfo = infantManager.GetStatusInfo(child);
            }

            infants.AddRange(children);
            infants.AddRange(childrenMother);
            return infants;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetInfantCountForHealthCareWorkerForMonth(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
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
        public List<Visit> GetInfantVisits(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: uId);

            List<Visit> infantsVisits = new List<Visit>();
            infantsVisits = (
                from visit in visitRepo.GetAll().Where(x => x.Infant.UserId.Equals(id)).OrderBy(x => x.PlannedVisitDate)
                join visitType in visitTypeRepo.GetAll().Where(y => y.Type.Equals("child")) on visit.VisitTypeId equals visitType.Id
                select visit
            ).ToList();

            return infantsVisits;
        }

    }
}
