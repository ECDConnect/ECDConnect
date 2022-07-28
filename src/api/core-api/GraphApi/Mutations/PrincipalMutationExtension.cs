using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Queries;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PrincipalMutationExtension
    {
        public Practitioner AddPractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
    [Service] UserManager<ApplicationUser> userManager,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
    string firstName,
    string lastName,
    string idNumber,
    string userId)
        {
            List<Practitioner> practitioners = new List<Practitioner>();

            var principal = userManager.FindByIdAsync(userId).Result;

            var practionerUser = userManager.FindByNameAsync(idNumber).Result;//find practitioner by Username/Id number, if exists, add principal to practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, dbFactory, repoFactory, userId);            
            if (practitioner != null)
            {
                practitioner.PrincipalHierarchy = userId;
                var updateResult = practitionerRepo.Update(practitioner);

                return practitioner;
            }
            else
            {
                //Create basic user and practitioner
                var pracRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

                var pOne = new ApplicationUser
                {
                    FirstName =firstName,
                    Surname = lastName,
                    FullName = firstName + " " + lastName,
                    UserName = idNumber,
                    IdNumber = idNumber,
                    IsActive = true,
                    NickFirstName = firstName,
                    NickSurname = lastName,
                    NickFullName = firstName + " " + lastName
                };

                var result = userManager.CreateAsync(pOne).Result;
                string practitionerId = pOne.Id;

                var passwordResult = userManager.AddPasswordAsync(pOne, idNumber).Result;

                pracRepo.Insert(new Practitioner
                {                    
                    Id = Guid.NewGuid(),
                    UserId = practitionerId,
                    IsPrincipal = false,
                    PrincipalHierarchy = userId,
                    NotInvitedYet = true});

                return new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, dbFactory, repoFactory, practitionerId);
            }
        }

        public Practitioner DeletePractitionerForPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            Practitioner practitioner, string principalId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            practitioner.CoachHierarchy = practitioner.PrincipalHierarchy.Replace(principalId, "");
            var updateResult = practitionerRepo.Update(practitioner);

            return practitioner;
        }

        public Practitioner PromotePractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             Practitioner practitioner)
        {
             using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            practitioner.IsPrincipal = true;
            var updateResult = practitionerRepo.Update(practitioner);

            return practitioner;
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             Practitioner practitioner)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            practitioner.IsPrincipal = false;
            var updateResult = practitionerRepo.Update(practitioner);

            return practitioner;
        }

        



    }
}
