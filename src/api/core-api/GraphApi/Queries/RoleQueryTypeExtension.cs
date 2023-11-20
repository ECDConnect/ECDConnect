using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
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
        public IEnumerable<ApplicationIdentityRole> GetRoles([Service] RoleManager<ApplicationIdentityRole> roleManager)
        {
            return roleManager.Roles.ToList();
        }

        public async Task<string> GetRoleForUser(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            [Service] RoleManager<ApplicationIdentityRole> roleManager,
            [Service] PersonnelService personnelService,
            string userId = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            if (userId == null)
                userId = uId;
            var user = userManager.FindByIdAsync(userId).Result;
            if (user != null)
            {
                var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);
                if (roles.Any(x => x.Name.Contains(Roles.ADMINISTRATOR)))
                {
                    return Roles.ADMINISTRATOR;
                }
                if (roles.Any(x => x.Name.Contains(Roles.FRANCHISOR)))
                {
                    return Roles.FRANCHISOR;
                }
                //Coach
                if (roles.Any(x => x.Name.Contains(Roles.COACH)))
                {
                    return Roles.COACH;
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.Name.Contains(Roles.PRINCIPAL) || x.Name.Contains(Roles.PRACTITIONER)))
                {
                    var userData = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, repoFactory, personnelService, userId);
                    if (userData != null)
                    {
                        if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
                        {
                            return Roles.PRINCIPAL;
                        }
                        else
                        {
                            return Roles.PRACTITIONER;
                        }
                    }
                }
                //Child
                if (roles.Any(x => x.Name.Contains(Roles.CHILD)))
                {
                    return Roles.CHILD;
                }
                else return "Unsure";
            }
            else return "Unsure";
        }
    }
}
