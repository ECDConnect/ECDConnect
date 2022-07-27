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
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PrincipalQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Practitioner> GetAllPrincipal([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> principals = principalRepo.GetAll().Where(x => x.IsPrincipal == true).ToList();

            return principals;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Practitioner> GetPrincipalByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> principal = principalRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();

            return principal;
        }

        public List<Practitioner> GetAllPractitionersForPrincipal([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = principalRepo.GetAll().Where(x => x.PrincipalHierarchy.Contains(userId)).ToList();

            return practitioners;
        }

        public List<Child> GetAllChildrenForPrincipal([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practitionerrRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioner = practitionerrRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
            List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practitioner.FirstOrDefault().Hierarchy)).ToList();

            return children;
        }
    }
}
