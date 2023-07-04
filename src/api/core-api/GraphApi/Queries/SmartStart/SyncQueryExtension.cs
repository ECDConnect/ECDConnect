using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class SyncQueryExtension
    {
        public SyncQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public bool GetChangesToSync(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory, DateTime lastUpdated)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<IntegrationAudit>(userContext: uId);
            //TODO: add more logic here as learners of principal may have changed for example but that affects this current user - so reverse lookup
            var changes = dbRepo.GetAll().Where(x => (string.Equals(x.UserId, uId) || string.Equals(x.RelatedId, uId)) && x.InsertedDate >= lastUpdated.AddMinutes(-5)).ToList();

            return (changes.Count > 0);
        }

        public List<string> GetEntityChangesToSync(
    [Service] IHttpContextAccessor contextAccessor,
    IGenericRepositoryFactory repoFactory, DateTime lastUpdated)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<IntegrationAudit>(userContext: uId);

            var changes = dbRepo.GetAll().Where(x => (string.Equals(x.UserId, uId) || string.Equals(x.RelatedId, uId)) && x.InsertedDate >= lastUpdated.AddMinutes(-5)).ToList();

            return changes.Select(x => x.Entity).ToList();
        }

    }
}
