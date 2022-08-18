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

        public Practitioner AddPractitionerToPrincipal([Service] IServiceProvider serviceProvider, [Service] IHttpContextAccessor contextAccessor,
    [Service] UserManager<ApplicationUser> userManager,
    [Service] RoleManager<IdentityRole> roleManager,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
    string firstName,
    string lastName,
    string idNumber,
    string userId)
        {
            List<Practitioner> practitioners = new List<Practitioner>();

            var principal = userManager.FindByIdAsync(userId).Result;
            
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitionerUser = new PractitionerQueryExtension().GetPractitionerByIdNumber(serviceProvider, contextAccessor,userManager,roleManager,dbFactory, repoFactory, idNumber);            
            if (practitionerUser != null)
            {
                Practitioner practitioner = (practitionerUser.practitionerObjectData != null ? practitionerUser.practitionerObjectData : practitionerUser.principalObjectData);
                if (practitioner != null)
                {
                    practitioner.PrincipalHierarchy = userId;
                    var practitionerUpdateResult = practitionerRepo.Update(practitioner);

                    //update users nicknames
                    var user = userManager.FindByIdAsync(practitioner.UserId).Result;
                    user.NickFirstName = firstName;
                    user.NickSurname = lastName;
                    user.NickFullName = firstName + " " + lastName;

                    var userUpdateResult = userManager.UpdateAsync(user).Result;
                }

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
            string userId, string principalId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).FirstOrDefault();
            {
                practitioner.CoachHierarchy = practitioner.PrincipalHierarchy.Replace(principalId, "");
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Practitioner PromotePractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
            Practitioner practitionerToPromote = new Practitioner();
            if (practitioners.Count > 0)
            {
                practitionerToPromote = practitioners.FirstOrDefault();
                practitionerToPromote.IsPrincipal = true;
                var updateResult = practitionerRepo.Update(practitionerToPromote);

                //now add user to principal
                var user = userManager.FindByIdAsync(userId).Result;
                userManager.RemoveFromRoleAsync(user, Roles.PRACTITIONER);
                userManager.AddToRoleAsync(user, Roles.PRINCIPAL);
            }
            return practitionerToPromote;
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
            Practitioner practitionerToDemote = new Practitioner();
            if (practitioners.Count > 0)
            {
                practitionerToDemote = practitioners.FirstOrDefault();
                practitionerToDemote.IsPrincipal = false;
                var updateResult = practitionerRepo.Update(practitionerToDemote);

                //now add user back to practitioner
                var user = userManager.FindByIdAsync(userId).Result;
                userManager.RemoveFromRoleAsync(user, Roles.PRINCIPAL);
                userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
            }

            return practitionerToDemote;
        }

    }
}
