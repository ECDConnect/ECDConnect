using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Navigation;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(typeof(Navigation))]
    public class NavigationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public IEnumerable<Permission> Permissions(
          [Service] NavigationPermissionRepository permissionRepository,
          [Parent] Navigation parent)
        {
            var permissions = permissionRepository.GetPermissionsForNavigation(new[] { parent.Id });

            return permissions;
        }
    }
}
