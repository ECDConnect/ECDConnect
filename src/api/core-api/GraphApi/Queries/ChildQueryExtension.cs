using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ChildQueryExtension
    {
        public ChildQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Child GetChildByUserId([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            Child child = new Child();
            List<Child> children = dbRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();
            if (children.Count > 0)
            {
                child = children.FirstOrDefault();
            }

            return child;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Child> GetChildrenByClassroomId([Service] IHttpContextAccessor contextAccessor,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
string classroomId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGrooupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: uId);
            List<Child> children = new List<Child>();
            List<ClassroomGroup> group = classroomGrooupRepo.GetAll().Where(x => x.ClassroomId.Equals(classroomId)).ToList();
            foreach (var groupItem in group)
            {
                foreach (var item in groupItem.Learners)
                {
                    List<Child> learnerChildren = dbRepo.GetAll().Where(x => x.UserId.Contains(item.UserId)).ToList();
                    children.AddRange(learnerChildren);
                }
            }

            return children;
        }

    }
}
