using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GenericQueryTypeExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public TenantModel TenantContext()
        {
            return TenantExecutionContext.Tenant;
        }

        public List<Absentees> GetAbsentees([Service] IHttpContextAccessor contextAccessor,
    [Service] IGenericRepositoryFactory repoFactory,
    string userId, DateTime fromDate, DateTime toDate)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);

            var absentees = absenteeRepo.GetAll().Where(x => x.UserId == userId).ToList();
            return absentees.Where(x => x.AbsentDate >= fromDate && x.AbsentDate <= toDate).ToList();
        }

    }
}
