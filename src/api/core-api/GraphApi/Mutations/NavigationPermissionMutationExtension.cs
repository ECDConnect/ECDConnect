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
    public class NavigationPermissionMutationExtension
    {
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.Update)]
        public async Task<bool> AddPermissionsToNavigation(
          [Service] NavigationPermissionRepository permissionRepository,
          Guid navigationId,
          List<Guid> permissionIds)
        {
            await permissionRepository.AddPermissionsToNavigation(navigationId, permissionIds);

            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public async Task<bool> RemovePermissionsFromNavigation(
            [Service] NavigationPermissionRepository permissionRepository,
            Guid navigationId,
            List<Guid> permissionIds)
        {
            await permissionRepository.RemovePemissionsFromNavigation(navigationId, permissionIds);

            return true;
        }
    }
}
