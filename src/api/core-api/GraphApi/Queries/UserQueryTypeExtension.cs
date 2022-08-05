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

using ECDLink.DataAccessLayer.Configuration.Setup.Seed.TestSeedData;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<ApplicationUser> GetUsers([Service] UserManager<ApplicationUser> userManager)
        {
            return userManager.Users;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ApplicationUser GetUserById([Service] IServiceProvider serviceProvider,[Service] UserManager<ApplicationUser> userManager, [Service] RoleManager<IdentityRole> roleManager, [Service] IHttpContextAccessor contextAccessor, [Service] IDbContextFactory<AuthenticationDbContext> dbFactory, [Service] IGenericRepositoryFactory repoFactory, string userId)
        {
            //new TestSeed(serviceProvider);
            var user = userManager.FindByIdAsync(userId).Result;

            var roles = new ObjectTypes.ApplicationUserExtension().GetRoles(user, roleManager, userManager);

            if (user != null)
            {
                //Franchisor
                if (roles.Any(x => x.Name.Contains("Franchisor")))                
                {
                    user.franchisorObjectData = new FranchisorQueryExtension().GetFranchisorByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                //Coach
                if (roles.Any(x => x.Name.Contains("Coach")))
                    {
                    user.coachObjectData = new CoachQueryExtension().GetCoachByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.Name.Contains("Principal") || x.Name.Contains("Practitioner")))
                {
                    var userData = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, dbFactory, repoFactory, userId);
                    if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
                    {
                        user.practitionerObjectData = null;
                        user.principalObjectData = userData;
                    }
                    else
                    {
                        user.principalObjectData = null;
                        user.practitionerObjectData = userData;
                    }
                }
                //Child
                if (roles.Any(x => x.Name.Contains("Child")))
                    {
                    user.childObjectData = new ChildQueryExtension().GetChildByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                

                return user.IsActive ? user : default(ApplicationUser);
            }
            return default(ApplicationUser);
        }
    }
}
