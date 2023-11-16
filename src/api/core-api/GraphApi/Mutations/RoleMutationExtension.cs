using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class RoleMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public ApplicationIdentityRole AddRole(
            [Service] ApplicationRoleManager roleManager,
             string name,
             string normalizedName)
        {
            var newRole = new ApplicationIdentityRole
            {
                Name = name,
                NormalizedName = normalizedName
            };

            var isSuccessful = roleManager.CreateAsync(newRole).Result;

            if (!isSuccessful.Succeeded)
            {
                throw new Exception("Could not add new role");
            }

            return newRole;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public ApplicationIdentityRole UpdateRole(
            [Service] ApplicationRoleManager roleManager,
             string id,
             string name,
             string normalizedName)
        {
            var roleToUpdate = roleManager.FindByIdAsync(id).Result;

            if (roleToUpdate == default(ApplicationIdentityRole))
            {
                throw new KeyNotFoundException();
            }

            roleToUpdate.Name = name;
            roleToUpdate.NormalizedName = normalizedName;

            var isRoleUpdated = roleManager.UpdateAsync(roleToUpdate).Result;

            if (!isRoleUpdated.Succeeded)
            {
                throw new Exception("Unable to update role");
            }

            return roleToUpdate;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public bool DeleteRole(
            [Service] ApplicationRoleManager roleManager,
            string id)
        {
            var roleToDelete = roleManager.FindByIdAsync(id).Result;

            if (roleToDelete == default(ApplicationIdentityRole))
            {
                throw new KeyNotFoundException();
            }

            var isRoleDeleted = roleManager.DeleteAsync(roleToDelete).Result;

            return isRoleDeleted.Succeeded;
        }
    }
}
