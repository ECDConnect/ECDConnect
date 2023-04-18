using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<string> GetRoleForUser(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            [Service] RoleManager<IdentityRole> roleManager,
            string userId = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            if (userId == null)
                userId = uId;
            var user = userManager.FindByIdAsync(userId).Result;
            if (user != null)
            {
                var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);
                if (roles.Any(x => x.Name.Contains("Admin")))
                {
                    return "Admin";
                }
                if (roles.Any(x => x.Name.Contains("Franchisor")))
                {
                    return "Franchisor";
                }
                //Coach
                if (roles.Any(x => x.Name.Contains("Coach")))
                {
                    return "Coach";
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.Name.Contains("Principal") || x.Name.Contains("Practitioner")))
                {
                    var userData = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, repoFactory, userId);
                    if (userData != null)
                    {
                        if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
                        {
                            return "Principal";
                        }
                        else
                        {
                            return "Practitioner";
                        }
                    }
                }
                //Child
                if (roles.Any(x => x.Name.Contains("Child")))
                {
                    return "Child";
                }
                else return "Unsure";
            }
            else return "Unsure";
        }
    }
}
