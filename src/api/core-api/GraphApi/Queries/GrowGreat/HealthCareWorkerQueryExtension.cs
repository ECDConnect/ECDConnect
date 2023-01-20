using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class HealthCareWorkerQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<HealthCareWorker> GetAllHealthCareWorkers(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            List<HealthCareWorker> healthCareWorkers = healthCareWorkerRepo.GetAll().ToList();

            return healthCareWorkers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public HealthCareWorker GetHealthCareWorkerByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            HealthCareWorker healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId.Equals(userId)).FirstOrDefault();

            return healthCareWorker;
        }
    }
}
