using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class RoleQueryTypeExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<ApplicationIdentityRole> GetRoles([Service] ApplicationRoleManager roleManager)
        {
            //var tenantId = TenantExecutionContext.Tenant.Id;
            var roles = roleManager.Roles.ToList();
            return roles;
        }

        public async Task<string> GetRoleForUser(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory,
            [Service] ApplicationRoleManager roleManager,
            [Service] PersonnelService personnelService,
            string userId = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            if (userId == null)
                userId = uId.ToString();
            var user = userManager.FindByIdAsync(userId).Result;
            if (user != null)
            {
                var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);
                if (roles.Any(x => x.SystemName.Contains(Roles.ADMINISTRATOR.ToUpper())))
                {
                    return Roles.ADMINISTRATOR;
                }
                //Coach
                if (roles.Any(x => x.SystemName.Contains(Roles.COACH.ToUpper())))
                {
                    return Roles.COACH;
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.SystemName.Contains(Roles.PRINCIPAL.ToUpper()) || x.SystemName.Contains(Roles.PRACTITIONER.ToUpper())))
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
                if (roles.Any(x => x.SystemName.Contains(Roles.CHILD.ToUpper())))
                {
                    return Roles.CHILD;
                }
                else return "Unsure";
            }
            else return "Unsure";
        }
    }
}
