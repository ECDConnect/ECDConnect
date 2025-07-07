using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class RolePermissionMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<bool> AddPermissionsToRole(
          [Service] RolePermissionRepository permissionRepository,
          string roleId,
          List<Guid> permissionIds)
        {
            await permissionRepository.AddPermissionsToRole(Guid.Parse(roleId), permissionIds);

            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public async Task<bool> RemovePermissionsFromRole(
            [Service] RolePermissionRepository permissionRepository,
            string roleId,
            List<Guid> permissionIds)
        {
            await permissionRepository.RemovePemissionsFromRole(Guid.Parse(roleId), permissionIds);

            return true;
        }
    }
}
