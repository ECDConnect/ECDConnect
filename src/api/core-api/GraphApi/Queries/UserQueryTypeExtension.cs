using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories;
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
using Microsoft.Extensions.DependencyInjection;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;

using Microsoft.EntityFrameworkCore;
using ECDLink.DataAccessLayer.Context;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {
        private readonly IServiceProvider serviceProvider;
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<ApplicationUser> GetUsers([Service] UserManager<ApplicationUser> userManager)
        {
            return userManager.Users;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ApplicationUser GetUserById([Service] UserManager<ApplicationUser> userManager, [Service] RoleManager<IdentityRole> roleManager, [Service] IHttpContextAccessor contextAccessor, [Service] IDbContextFactory<AuthenticationDbContext> dbFactory, [Service] IGenericRepositoryFactory repoFactory, string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;

            if (user != null)
            {
                //Franchisor            
                if (userManager.IsInRoleAsync(user, "Franchisor").Result)
                {
                    user.franchisorObjectData = new FranchisorQueryExtension().GetFranchisorByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                //Coach
                if (userManager.IsInRoleAsync(user, "Coach").Result)
                {
                    user.coachObjectData = new CoachQueryExtension().GetCoachByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (userManager.IsInRoleAsync(user, "Principal").Result || userManager.IsInRoleAsync(user, "Practitioner").Result)
                {
                    var userData = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, dbFactory, repoFactory, userId);
                    if ((bool)userData.IsPrincipal)
                        user.principalObjectData = userData; //new PrincipalQueryExtension().GetPrincipalByUserId(contextAccessor, dbFactory, repoFactory, userId);
                    else
                        user.practitionerObjectData = userData;
                }
                //Child
                if (userManager.IsInRoleAsync(user, "Child").Result)
                {
                    user.childObjectData = new ChildQueryExtension().GetChildByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }


                return user.IsActive ? user : default(ApplicationUser);
            }
            return default(ApplicationUser);
        }
    }
}
