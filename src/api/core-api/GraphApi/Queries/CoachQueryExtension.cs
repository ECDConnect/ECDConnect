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
using HotChocolate.Utilities;
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
        public CoachQueryExtension()
        {
        }

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
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.CoachHierarchy.Equals(userId)).ToList();

            return practitioners;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByCoachUserId([Service] IHttpContextAccessor contextAccessor,
[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
[Service] IGenericRepositoryFactory repoFactory,
string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            Coach coach = new Coach();
            List<Coach> coaches = dbRepo.GetAll().ToList();
            if (coaches.Count > 0)
            {
                coach = coaches.Where(x => x.UserId.Contains(userId)).FirstOrDefault();
            }

            return coach;
            //return dbRepo.GetByUserId(userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            //this was used wrong in FE, so adjust to align with FE
            return GetCoachByPractitionerId(contextAccessor,dbFactory, repoFactory, userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByPractitionerId([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory,
         string practitionerId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.UserId.Contains(practitionerId)).ToList();
            Coach coach = new Coach();
            if (practitioners.Count > 0)
            {
                coach = this.GetCoachByCoachUserId(contextAccessor,dbFactory,repoFactory, practitioners.FirstOrDefault().CoachHierarchy.ToString());
            }
            return coach;
        }

        public List<Child> GetAllChildrenForCoach([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);

            List<Child> children = new List<Child>();
            var practitionerrRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerrRepo.GetAll().Where(x => x.CoachHierarchy.Equals(userId)).ToList();
            foreach (var practioner in practitioners)
            {
                List<Child> practitionerChildren = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practioner.Hierarchy)).ToList();
                children.AddRange(practitionerChildren);
            }
            return children;
        }

        public List<Classroom> GetAllClassroomsForCoach([Service] IHttpContextAccessor contextAccessor,
[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
[Service] IGenericRepositoryFactory repoFactory,
string userId)
        {

            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);

            List<Classroom> classrooms = new List<Classroom>();
            var practitionerrRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerrRepo.GetAll().Where(x => x.CoachHierarchy.Equals(userId)).ToList();
            foreach (var practioner in practitioners)
            {
                List<Classroom> practitionerClasses = classRepo.GetAll().Where(x => x.UserId.Contains(practioner.UserId)).ToList();
                classrooms.AddRange(practitionerClasses);
            }
            return classrooms;
        }
    }
}
