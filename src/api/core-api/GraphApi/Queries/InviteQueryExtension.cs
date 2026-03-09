using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
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
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{

    [ExtendObjectType(OperationTypeNames.Query)]
    public class InviteQueryExtension
    {
        public InviteQueryExtension()
        {
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.View)]
        public List<Invite> GetInvitesByPrincipalId(
        [Service] IHttpContextAccessor contextAccessor,
        IGenericRepositoryFactory repoFactory,
        string id)
        {
            if (!Guid.TryParse(id, out var pracGuid))
            {
                throw new ArgumentException("Invalid practitioner ID format. Expected a valid GUID.");
            }

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Invite>(userContext: uId);

            var invites = dbRepo.GetAll()
                .Include(x => x.User)
                .Include(x => x.Practitioner)
                .ThenInclude(p => p.User)
                .Include(x => x.Principal)
                .ThenInclude(p => p.User)
                .Where(x => x.IsActive && x.PrincipalId.Equals(pracGuid) && (x.Status == InviteStatus.Pending))
                .ToList();

            if(invites.Count == 0)
            {
                return invites;
            }

            foreach (var invite in invites)
            {

                if (!invite?.Practitioner?.IsRegistered ?? false)
                {
                    invite.Status = "Not registered on Funda App";
                }
                else if (invite.IsAccepted.HasValue && !invite.IsAccepted.Value)
                {
                    invite.Status = "Rejected invitation";
                }
                else
                {
                    invite.Status = "Has not joined programme";
                }
            }

            return invites;
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.View)]
        public Invite GetInviteByPractitionerId(
        [Service] IHttpContextAccessor contextAccessor,
        IGenericRepositoryFactory repoFactory,
        string id)
        {
            if (!Guid.TryParse(id, out var pracGuid))
            {
                throw new ArgumentException("Invalid practitioner ID format. Expected a valid GUID.");
            }

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Invite>(userContext: uId);

            var invite = dbRepo.GetAll()
                .Include(x => x.Practitioner)
                .FirstOrDefault(x => !x.IsAccepted.HasValue && x.IsActive && (x.PractitionerId == pracGuid || x.Practitioner.UserId == pracGuid) && DateTime.Now <= x.InsertedDate.AddDays(30));


            return invite;
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.View)]
        public Invite GetInviteByPhoneNumber(
        [Service] IHttpContextAccessor contextAccessor,
        IGenericRepositoryFactory repoFactory,
        string phoneNumber)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Invite>(userContext: uId);

            var invite = dbRepo.GetAll()
                .Include(x => x.User)
                .FirstOrDefault(x => x.IsActive && !x.IsAccepted.HasValue && x.User.PhoneNumber.Equals(phoneNumber));

            return invite;
        }
    }
}
