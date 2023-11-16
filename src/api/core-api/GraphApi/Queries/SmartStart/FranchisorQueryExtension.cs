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
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class FranchisorQueryExtension
    {
        public FranchisorQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Franchisor GetFranchisorByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Franchisor>(userContext: uId);
            return dbRepo.GetByUserId(userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Coach> GetAllCoachesForFranchisor(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            List<Coach> coaches = coachRepo.GetAll().Where(x => x.FranchisorId == Guid.Parse(userId)).ToList();

            return coaches;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Child> GetAllChildrenForFranchisor(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            List<Coach> coaches = coachRepo.GetAll().Where(x => x.FranchisorId == Guid.Parse(userId)).ToList();
            List<Child> children = new List<Child>();
            foreach (var c in coaches)
            {
                var coachChild = new CoachQueryExtension().GetAllChildrenForCoach(contextAccessor, repoFactory, c.UserId.ToString());
                children.AddRange(coachChild);
            }


            return children;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public SiteAddress GetFranchisorSiteAddressById([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string franchisorId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: uId);
            var franchisor = dbRepo.GetByUserId(franchisorId);

            if (franchisor == null)
            {
                return null;
            }

            return franchisor.SiteAddress;
        }

    }
}
