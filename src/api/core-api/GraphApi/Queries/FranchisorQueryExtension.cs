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
    public class FranchisorQueryExtension
    {   
        public FranchisorQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Franchisor GetFranchisorByUserId([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Franchisor>(userContext: uId);
            Franchisor franchisor = new Franchisor();
            List<Franchisor> franchisors = dbRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();
            if (franchisors.Count > 0)
            {
                franchisor = franchisors.FirstOrDefault();
            }

            return franchisor;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Coach> GetAllCoachesForFranchisor([Service] IHttpContextAccessor contextAccessor,
     [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
     [Service] IGenericRepositoryFactory repoFactory,
     string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            List<Coach> coaches = coachRepo.GetAll().Where(x => x.FranchisorHierarchy.Contains(userId)).ToList();

            return coaches;
        }

    }
}
