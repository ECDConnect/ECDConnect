using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CoachMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<bool> SendCoachInviteToApplication(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ApplicationUserManager userManager,
          string userId)
        {
            // TODO: Make a service for invitations.
            SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
            return await invite.SendInviteToApplication(invitationManager, notificationManager, userManager, userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Coach UpdateCoach([Service] IHttpContextAccessor contextAccessor,
          [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
          IGenericRepositoryFactory repoFactory,
          Guid? id,
          Coach input)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);

            Coach coach = dbRepo.GetById(input.Id);
            
            if (coach != null)
            {
                if (input.StartDate != default)
                    coach.StartDate = input.StartDate;
                if (input.AreaOfOperation != null)
                    coach.AreaOfOperation = input.AreaOfOperation;
                if (input.SiteAddress != null)
                {
                    if (input.SiteAddressId is not null && input.SiteAddressId.HasValue)
                    {
                        var addressRepo = repoFactory.CreateRepository<SiteAddress>(userContext: uId);
                        SiteAddress address = addressRepo.GetById(input.SiteAddressId.Value);
                        if (input?.SiteAddress?.Ward != null)
                            address.Ward = input.SiteAddress.Ward;
                        if (input?.SiteAddress?.AddressLine1 != null)
                            address.AddressLine1 = input.SiteAddress.AddressLine1;
                        if (input?.SiteAddress?.AddressLine2 != null)
                            address.AddressLine2 = input.SiteAddress.AddressLine2;
                        if (input?.SiteAddress?.AddressLine3 != null)
                            address.AddressLine3 = input.SiteAddress.AddressLine3;
                        if (input?.SiteAddress?.PostalCode != null)
                            address.PostalCode = input.SiteAddress.PostalCode;
                        if (input?.SiteAddress.ProvinceId != null)
                            address.ProvinceId = input.SiteAddress.ProvinceId;
                        var updateAddressResult = addressRepo.Update(address);
                    }

                    if (input.SiteAddressId is null)
                    {
                        //create siteaddress
                        var addressRepo = repoFactory.CreateRepository<SiteAddress>(userContext: uId);
                        SiteAddress newAddress = new SiteAddress();
                        if (input.SiteAddress.Ward != null)
                            newAddress.Ward = input.SiteAddress.Ward;
                        if (input.SiteAddress.AddressLine1 != null)
                            newAddress.AddressLine1 = input.SiteAddress.AddressLine1;
                        if (input.SiteAddress.AddressLine2 != null)
                            newAddress.AddressLine2 = input.SiteAddress.AddressLine2;
                        if (input.SiteAddress.AddressLine3 != null)
                            newAddress.AddressLine3 = input.SiteAddress.AddressLine3;
                        if (input.SiteAddress.PostalCode != null)
                            newAddress.PostalCode = input.SiteAddress.PostalCode;
                        if (input.SiteAddress.ProvinceId != null)
                            newAddress.ProvinceId = input.SiteAddress.ProvinceId;
                        var updateAddressResult = addressRepo.Insert(newAddress);
                        if (updateAddressResult != null)
                            coach.SiteAddressId = updateAddressResult.Id;
                    }
                }
                if (input.SigningSignature != null)
                    coach.SigningSignature = input.SigningSignature;

                var updateResult = dbRepo.Update(coach);
            }
            return coach;
        }

        public Practitioner AddPractitionerToCoach([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            string practitionerId,
            string coachId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId == Guid.Parse(practitionerId));
            if (practitioner != null)
            {
                practitioner.CoachHierarchy = Guid.Parse(coachId);
                practitioner.CoachLinkDate = DateTime.Now.Date;
                var updateResult = practitionerRepo.Update(practitioner);
                return practitioner;
            }
            else return new Practitioner();
        }

        public Practitioner DeletePractitionerForCoach([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            string practitionerId, string coachId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId == Guid.Parse(practitionerId));
            if (practitioner != null)
            {
                practitioner.CoachHierarchy = null;
                practitioner.CoachLinkDate = null;
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Coach UpdateCoachAboutInfo([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId, string aboutInfo)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            Coach coach = dbRepo.GetByUserId(userId);

            if (coach != null)
            {
                coach.AboutInfo = aboutInfo;
                coach.UpdatedDate = DateTime.UtcNow;
                coach.UpdatedBy = uId.ToString();
                dbRepo.Update(coach);

                return coach;
            }
            return coach;
        }

        public Coach UpdateCoachCommunityTabStatus(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid coachUserId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var coach = coachRepo.GetByUserId(coachUserId);
            if (coach != null)
            {
                coach.ClickedCommunityTab = true;
                coach.UpdatedDate = DateTime.Now;
                coach.UpdatedBy = uId.ToString();
                return coachRepo.Update(coach);
            }
            return null;
        }


    }
}
