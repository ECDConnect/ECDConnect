using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services;
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
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PrincipalQueryExtension
    {
        public PrincipalQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Practitioner> GetAllPrincipal(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> principals = principalRepo.GetAll().Where(x => x.IsPrincipal == true).ToList();

            return principals;
        }

        public List<Principal> GetAllPrincipals(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> principals = principalRepo.GetAll().Where(x => x.IsPrincipal == true).ToList();

            List<Principal> list = new List<Principal>();
            foreach (var principal in principals)
            {
                list.Add(MapPractitionerToPrincipal(principal));
            }

            return list;
        }

        public Practitioner GetPrincipalByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var principal = principalRepo.GetAll().Where(x => x.UserId.ToString().Contains(userId)).OrderBy(x => x.Id).FirstOrDefault();
            if (principal == null) principal = new Practitioner();
            return principal;
        }

        public List<Practitioner> GetAllPractitionersForPrincipal([Service] PersonnelService personnelManager,
        string userId)
        {
            return personnelManager.GetAllPractitionersForPrincipal(userId);
        }

        public Principal MapPractitionerToPrincipal(Practitioner practitioner)
        {
            Principal userToMap = new Principal()
            {
                Id = practitioner.Id,
                IsActive = practitioner.IsActive,
                InsertedDate = practitioner.InsertedDate,
                UpdatedBy = practitioner.UpdatedBy,
                UpdatedDate = practitioner.UpdatedDate,
                Hierarchy = practitioner.Hierarchy,
                AttendanceRegisterLink = practitioner.AttendanceRegisterLink,
                ConsentForPhoto = practitioner.ConsentForPhoto,
                ParentFees = practitioner?.ParentFees,
                LanguageUsedInGroups = practitioner?.LanguageUsedInGroups,
                StartDate = practitioner.StartDate,
                UserId = practitioner.UserId,
                SiteAddressId = practitioner?.SiteAddressId,
                IsPrincipal = true,
                CoachHierarchy = practitioner?.CoachHierarchy,
                SigningSignature = practitioner?.SigningSignature,
                ShareInfo = practitioner?.ShareInfo,
                IsRegistered = practitioner.IsRegistered       
            };

            return userToMap;
        }

        public List<Classroom> GetAllClassroomsForPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);

            List<Classroom> classes = classroomRepo.GetAll().Where(x => x.UserId == System.Guid.Parse(userId)).ToList();
            return classes;
        }

        public List<ClassroomGroup> GetAllClassroomGroupsByPrincipal(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            List<ClassroomGroup> allClassGroups = new List<ClassroomGroup>();
            List<Classroom> classes = classroomRepo.GetAll().Where(x => x.UserId == System.Guid.Parse(userId)).ToList();
            foreach (Classroom classroom in classes)
            {
                List<ClassroomGroup> cgroups = classroomGroupRepo.GetAll().Where(x => x.ClassroomId == classroom.Id).ToList();
                allClassGroups.AddRange(cgroups);
            }
            return allClassGroups;
        }

        public List<Child> GetAllChildrenUnderPrincipal(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            List<Child> children = new List<Child>();

            if (userId != null)
            {
                var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
                List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue).ToList();
                practitioners.Where(x => x.PrincipalHierarchy == System.Guid.Parse(userId)).ToList();
                Practitioner principalPrac = dbRepo.GetByUserId(userId);
                if (!practitioners.Contains(principalPrac))  //add principal user to the list
                    practitioners.Add(principalPrac);
                foreach (var practioner in practitioners)
                {
                    List<Child> practitionerChildren = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practioner.Hierarchy)).ToList();
                    children.AddRange(practitionerChildren);
                }
            }
            return children;
        }
        public List<Child> GetAllChildrenUnderPrincipalByClassrooms(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: uId);
            List<Child> children = new List<Child>();
            List<ClassroomGroup> cGroups = GetAllClassroomGroupsByPrincipal(contextAccessor, repoFactory, userId).ToList();
            foreach (var cg in cGroups)
            {
                List<Learner> learnerList = new List<Learner>();
                learnerList = learnerRepo.GetAll().Where(x => x.ClassroomGroupId == cg.Id).ToList();

                foreach (Learner learner in learnerList)
                {
                    var child = childRepo.GetByUserId(learner.UserId.ToString());
                    children.Add(child);
                }
            }
            return children;
        }
    }
}
