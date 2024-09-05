using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
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
            var tenantId = TenantExecutionContext.Tenant.Id;

            var newRole = new ApplicationIdentityRole
            {
                Name = name,
                NormalizedName = normalizedName,
                TenantId = tenantId,
                SystemName = normalizedName
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
            // roleToUpdate.SystemName = normalizedName;  Not updating - should always stay as the original system defined name.

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
