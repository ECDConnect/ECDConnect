using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserRoleMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public bool AddUsersToRole(
          [Service] UserManager<ApplicationUser> userManager,
          [Service] IHttpContextAccessor contextAccessor,
          [Service] HierarchyEngine engine,
          string userId,
          List<string> roleNames)
        {
            var user = userManager.FindByIdAsync(userId).Result;

            var result = userManager.AddToRolesAsync(user, roleNames).Result;
            if (user == default(ApplicationUser))
            {
                throw new Exception("User does not exist");
            }

            // TODO: Remove this temp fix and move role and hierarchy federation to the userrepo layer
            if (roleNames.Contains(Roles.ADMINISTRATOR))
            {
                if (string.IsNullOrEmpty(engine.GetUserHierarchy(userId)))
                {
                    engine.AddHierarchyEntity<ApplicationUser>(userId, userId);
                }
            }

            return result.Succeeded;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public bool RemoveUserFromRoles(
          [Service] UserManager<ApplicationUser> userManager,
          string userId,
          List<string> roleNames)
        {
            var user = userManager.FindByIdAsync(userId).Result;


            var result = userManager.RemoveFromRolesAsync(user, roleNames).Result;
            if (user == default(ApplicationUser))
            {
                throw new Exception("User does not exist");
            }

            return result.Succeeded;
        }
    }
}
