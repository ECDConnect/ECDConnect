using ECDLink.DataAccessLayer.Context;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.Tenancy.Context;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Entities.Users;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using EcdLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.GraphApi.Models.Input;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChildMutationExtention
    {
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public bool UpdateChildAndCaregiver(
            [Service] IChildService childService,
            UpdateChildAndCaregiverInput input)
        {
            childService.UpdateChild(input);
            return true;
        }

        [Obsolete]
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public bool UpdateCareGiverGrants(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] AuthenticationDbContext context,
            Guid childUserId,
            List<Guid> grantIds)
        {
            if (grantIds == null || !grantIds.Any())
            {
                return false;
            }

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var caregiverRepo = repoFactory.CreateRepository<Caregiver>(userContext: uId);

            //retrieve careGiverId from child
            var child = childRepo.GetByUserId(childUserId);
            if (child == null)
            {
                return false;
            }

            var caregiverId = child.CaregiverId;
                        
            var grantsToAdd = grantIds.Select(x => new UserGrant
            {
                GrantId = x,
                UserId = caregiverId,
                TenantId = _tenantId
            });

            var existingGrants = context.UserGrants
                .Where(x => x.UserId == caregiverId);

            try
            {
                //remove
                context.UserGrants.RemoveRange(existingGrants);
                context.SaveChanges();
                //reinsert
                context.UserGrants.AddRange(grantsToAdd);
                context.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                // Error
                return false;
            }
        }
    }
}
