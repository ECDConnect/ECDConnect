using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Managers;
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
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CoachMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public async Task<bool> SendCoachInviteToApplication(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] UserManager<ApplicationUser> userManager,
          string userId)
        {
            SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
            return await invite.SendInviteToApplication(invitationManager, notificationManager, userManager, userId);
        }

        private Practitioner AddPractitionerToCoach([Service] IHttpContextAccessor contextAccessor, 
            [Service] UserManager<ApplicationUser> userManager, 
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string firstName, 
            string lastName, 
            string idNumber, 
            string coachId)
        {
            Practitioner practitioner = new Practitioner();
            //find the practitioner
            var coach = userManager.FindByIdAsync(coachId).Result;
            

            var practi = userManager.FindByNameAsync(idNumber).Result;//find practitioner by Username/Id number, if exists, add coach to practitioner
            if (practi != null)
            {
                using var scope = dbFactory.CreateDbContext();
                using var dbContextTransaction = scope.Database.BeginTransaction();
                var userId = contextAccessor.HttpContext.GetUser().Id;
                var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
                practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practi.Id));
                practitioner.CoachHierarchy = coachId;
                var updateResult = practitionerRepo.Update(practitioner);
            } else
            {
                //TODO: create user and practitioner with NotYetInvited set and a basic practitioner outline
            }

            return practitioner;
        }

        private Practitioner DeletePractitionerForPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            Practitioner practitioner, string coachId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            practitioner.CoachHierarchy = practitioner.CoachHierarchy.Replace(coachId,"");
            var updateResult = practitionerRepo.Update(practitioner);

            return practitioner;
        }

        private List<Practitioner> GetAllPractitionersForCoach([Service] IHttpContextAccessor contextAccessor,
     [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
     [Service] IGenericRepositoryFactory repoFactory,
     Coach coach)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.CoachHierarchy.Contains(coach.UserId)).ToList();

            return practitioners;
        }

        private List<Child> GetAllChildrenForCoach([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        Coach coach)
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
