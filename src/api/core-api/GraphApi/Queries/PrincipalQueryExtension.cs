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
        public PrincipalQueryExtension()
        {
        }

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

        public List<Principal> GetAllPrincipals([Service] IHttpContextAccessor contextAccessor,
[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
[Service] IGenericRepositoryFactory repoFactory)
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

        public Practitioner GetPrincipalByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner principal = new Practitioner();
            List<Practitioner> principals = principalRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();
            if (principals.Count > 0)
            {
                principal = principals.FirstOrDefault();
            }

            return principal;
        }

        public Practitioner GetPrincipalById([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string id)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var principalRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner principal = new Practitioner();
            List<Practitioner> principals = principalRepo.GetAll().Where(x => x.Id.Equals(id)).ToList();
            if (principals.Count > 0)
            {
                principal = principals.FirstOrDefault();
            }

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
            if (userId != null)
            {
                return new PractitionerQueryExtension().GetAllChildrenForPractitioner(contextAccessor, dbFactory, repoFactory, userId);
            } else return new List<Child>();

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
                MaxChildren = practitioner.MaxChildren,
                ConsentForPhoto = practitioner.ConsentForPhoto,
                ParentFees = practitioner?.ParentFees,
                LanguageUsedInGroups = practitioner?.LanguageUsedInGroups,
                StartDate = practitioner.StartDate,
                MonthSinceFranchisee = practitioner?.MonthSinceFranchisee,
                UserId = practitioner.UserId,
                SiteAddressId = practitioner?.SiteAddressId,
                IsPrincipal = true,
                CoachHierarchy = practitioner?.CoachHierarchy,
                IsFundaAppAdmin = practitioner?.IsFundaAppAdmin,
                IsTrainee = practitioner?.IsTrainee,
                SigningSignature = practitioner?.SigningSignature
                //NotInvitedYet = practitioner.NotInvitedYet,
                //Signature = practitioner.Signature,
                //PrincipalHierarchy = practitioner?.PrincipalHierarchy,           
            };

            return userToMap;
        }
    }
}
