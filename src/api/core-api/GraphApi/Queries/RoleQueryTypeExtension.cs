using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class RoleQueryTypeExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<IdentityRole> GetRoles([Service] RoleManager<IdentityRole> roleManager)
        {
            return roleManager.Roles.ToList();
        }
    }
}
