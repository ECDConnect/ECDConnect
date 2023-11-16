using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.ObjectTypes
{
    [ExtendObjectType(typeof(ApplicationUser))]
    public class ApplicationUserExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<IEnumerable<IdentityRole<Guid>>> GetRolesAsync(
          [Parent] ApplicationUser user,
          [Service] RoleManager<IdentityRole<Guid>> roleManager,
          [Service] UserManager<ApplicationUser> userManager)
        {
            var roles = await userManager.GetRolesAsync(user);

            return roleManager.Roles.Where(x => roles.Contains(x.Name)).ToList();
        }
    }
}
