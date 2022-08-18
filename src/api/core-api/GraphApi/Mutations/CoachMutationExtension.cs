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
using EcdLink.Api.CoreApi.GraphApi.Queries;

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

        public Practitioner AddPractitionerToCoach([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId,
            string coachId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId));
            if (practitioner != null)
            {
                practitioner.CoachHierarchy = coachId;
                var updateResult = practitionerRepo.Update(practitioner);
                return practitioner;
            }
            else return new Practitioner();


            return practitioner;
        }

        public Practitioner DeletePractitionerForCoach([Service] IHttpContextAccessor contextAccessor,            
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, string coachId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId));
            if (practitioner != null)
            {
                practitioner.CoachHierarchy = practitioner.CoachHierarchy.Replace(coachId, "");
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Coach DeleteCoachForFranchisor([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string coachId, string franchisorId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            Coach coach = new CoachQueryExtension().GetCoachByUserId(contextAccessor, dbFactory, repoFactory, coachId);
            coach.FranchisorId = null;
            var updateResult = dbRepo.Update(coach);

            return coach;
        }

        public Coach AddCoachToFranchisor([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string coachId, string franchisorId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            Coach coach = new CoachQueryExtension().GetCoachByUserId(contextAccessor, dbFactory, repoFactory, coachId);
            if (coach != null)
            {
                coach.FranchisorId = new Guid(franchisorId);
                var updateResult = dbRepo.Update(coach);

                return coach;
            }
            return coach;
        }


    }
}
