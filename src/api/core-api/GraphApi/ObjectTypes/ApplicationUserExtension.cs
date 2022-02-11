using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.ObjectTypes
{
    [ExtendObjectType(typeof(ApplicationUser))]
    public class ApplicationUserExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<IdentityRole> GetRoles(
          [Parent] ApplicationUser user,
          [Service] RoleManager<IdentityRole> roleManager,
          [Service] UserManager<ApplicationUser> userManager)
        {
            var roles = userManager.GetRolesAsync(user).Result;

            return roleManager.Roles.Where(x => roles.Contains(x.Name)).ToList();
        }
    }
}
