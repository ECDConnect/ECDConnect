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
    public class CoachQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Practitioner> GetAllPractitionersForCoach([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory,
         string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.CoachHierarchy.Contains(userId)).ToList();

            return practitioners;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Coach> GetCoachByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            List<Coach> coach = coachRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();

            return coach;
        }

        public List<Child> GetAllChildrenForCoach([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            //using var scope = dbFactory.CreateDbContext();
            //using var dbContextTransaction = scope.Database.BeginTransaction();
            //var userId = contextAccessor.HttpContext.GetUser().Id;
            //var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);
            //List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(coach.)).ToList();

            return new List<Child>();
        }
    }
}
