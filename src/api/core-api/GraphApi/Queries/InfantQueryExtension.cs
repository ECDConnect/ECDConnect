using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Users;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class InfantQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfants([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().ToList();

            return children;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfantsForHealthCareWorker([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory,
         string id)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerId = GetHealthCareWorkerIdByUserId(contextAccessor, dbFactory, repoFactory);
            var childRepo = repoFactory.CreateRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorkerId.Equals(healthCareWorkerId)).ToList();

            return children;
        }

        private Guid? GetHealthCareWorkerIdByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: uId);
            HealthCareWorker healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId.Contains(uId)).FirstOrDefault();
            return healthCareWorker.Id;
        }
    }
}
