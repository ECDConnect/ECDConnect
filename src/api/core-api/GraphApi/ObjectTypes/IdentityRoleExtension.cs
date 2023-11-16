using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(typeof(IdentityRole<Guid>))]
    public class IdentityRoleExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public IEnumerable<Permission> Permissions(
          [Service] RolePermissionRepository permissionRepository,
          [Parent] IdentityRole<Guid> parent)
        {
            var permissions = permissionRepository.GetPermissionsForRole(new[] { parent.Id });

            return permissions;
        }
    }
}
