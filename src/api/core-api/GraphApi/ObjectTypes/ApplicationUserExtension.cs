using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.ObjectTypes
{
    [ExtendObjectType(typeof(ApplicationUser))]
    public class ApplicationUserExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<IEnumerable<ApplicationIdentityRole>> GetRolesAsync(
          [Parent] ApplicationUser user,
          [Service] ApplicationRoleManager roleManager,
          [Service] ApplicationUserManager userManager)
        {
            var roles = await userManager.GetRolesAsync(user);

            return roleManager.Roles.Where(x => roles.Contains(x.Name)).ToList();
        }
    }
}
