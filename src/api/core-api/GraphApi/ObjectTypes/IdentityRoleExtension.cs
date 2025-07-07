using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(typeof(ApplicationIdentityRole))]
    public class ApplicationIdentityRoleExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public IEnumerable<Permission> Permissions(
          [Service] RolePermissionRepository permissionRepository,
          [Parent] ApplicationIdentityRole parent)
        {
            var permissions = permissionRepository.GetPermissionsForRole(new[] { parent.Id });

            return permissions;
        }
    }
}
