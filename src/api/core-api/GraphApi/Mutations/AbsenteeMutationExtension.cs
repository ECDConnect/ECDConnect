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
    public class AbsenteeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public Absentees AddAbsenteeForPractitioner([Service] IHttpContextAccessor contextAccessor, 
            [Service] UserManager<ApplicationUser> userManager, 
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, 
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classProgram,
            string reassignedToPractitioner)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            //Abse practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId));            
            
            //else return new Practitioner();


            return new Absentees();
        }

        public Practitioner DeletePractitionerForCoach([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, string coachId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId));
            if (practitioner != null)
            {
                practitioner.CoachHierarchy = practitioner.CoachHierarchy.Replace(coachId, "");
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Coach DeletCoachForFranchisor([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string coachId, string franchisorId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Coach>(userContext: userId);
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
            //Franchisor franchise = new FranchisorQueryExtension().GetFranchisorByUserId(contextAccessor, dbFactory, repoFactory, franchisorId);
            //practitioners = practitionerRepo.GetAll().Where(x => x.UserId.Equals(practionerUser.Id)).ToList();
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
