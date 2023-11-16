using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserRoleMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<bool> AddUsersToRoleAsync(
          [Service] ApplicationUserManager userManager,
          [Service] HierarchyEngine engine,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ApplicationRoleManager roleManager,
          string userId,
          List<string> roleNames)
        {
            // No reason to look this up from DB, it's all hardcoded already...
            var validRoleNames = roleManager.Roles.Select(r => r.Name).ToList();
            var distinctRoleNamesToBeAdded = roleNames?.Distinct().Where(r => validRoleNames.Contains(r));
            var user = await userManager.FindByIdAsync(userId);

            if (user == default(ApplicationUser))
            {
                throw new Exception("User does not exist");
            }

            var systemUserIsAdmin = await userManager.IsInRoleAsync(new ApplicationUser() { Id = httpContextAccessor.HttpContext.GetUser().Id }, Roles.ADMINISTRATOR);

            // Remove admin from list if user adding roles is not an admin.
            if (!systemUserIsAdmin)
            {
                distinctRoleNamesToBeAdded = distinctRoleNamesToBeAdded?.Where(r => r != Roles.ADMINISTRATOR.ToString());
            }

            var result = await userManager.AddToRolesAsync(user, distinctRoleNamesToBeAdded);

            // If user is being added as an admin, add them to the hierarchy.
            if (distinctRoleNamesToBeAdded.Contains(Roles.ADMINISTRATOR))
            {
                if (string.IsNullOrEmpty(engine.GetUserHierarchy(Guid.Parse(userId))))
                {
                    engine.AddHierarchyEntity<ApplicationUser>(Guid.Parse(userId), Guid.Parse(userId));
                }
            }

            return result.Succeeded;
        }

        // TODO: Refactor
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<bool> RemoveUserFromRolesAsync(
          [Service] ApplicationUserManager userManager,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] HierarchyEngine engine,
          string userId,
          List<string> roleNames)
        {
            // If nothing to remove, just return
            if (!(roleNames?.Any() ?? false))
                return true;

            var user = await userManager.FindByIdAsync(userId);
            var currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;

            if (user == default(ApplicationUser) || currentUserId is null)
            {
                throw new Exception("User does not exist");
            }

            var distinctRoleNames = roleNames?.Distinct();
            bool userIsAdmin = false;
            IdentityResult result = null;

            if (distinctRoleNames.Contains(Roles.ADMINISTRATOR.ToString()))
            {
                userIsAdmin = await userManager.IsInRoleAsync(user, Roles.ADMINISTRATOR);
                // If user having its roles removed is an admin, remove them only if requesting user is an admin
                var currentUserIsAdmin = await userManager.IsInRoleAsync(new ApplicationUser() { Id = currentUserId.Value }, Roles.ADMINISTRATOR);
                result = currentUserIsAdmin ? await userManager.RemoveFromRolesAsync(user, distinctRoleNames) : result;
            }

            // If user having its roles removed is not an admin, remove them... no this is still not right.
            // TODO: Use hierarchy to check if user has authority to remove target users roles...
            if (!userIsAdmin)
            {
                result = await userManager.RemoveFromRolesAsync(user, distinctRoleNames);
            }

            bool hierarchySuccess = true;
            if (distinctRoleNames.Contains(Roles.ADMINISTRATOR)
                && !string.IsNullOrEmpty(engine.GetUserHierarchy(Guid.Parse(userId))))
            {
                // Make false or return would be false if not admin
                hierarchySuccess = !engine.RemoveHierarchy(Guid.Parse(userId));
            }

            return (result?.Succeeded ?? false) && hierarchySuccess;
        }
    }
}
