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
using ECDLink.DataAccessLayer.Entities.Notifications;
using Microsoft.EntityFrameworkCore;
using ECDLink.DataAccessLayer.Context;

using ECDLink.DataAccessLayer.Configuration.Setup.Seed.TestSeedData;
using ECDLink.Tenancy.Context;
using HotChocolate.Data.Sorting.Expressions;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Security.Helpers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Security.Managers;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {

        public UserQueryTypeExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<ApplicationUser> GetUsers([Service] UserManager<ApplicationUser> userManager)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return userManager.Users.Where(x => x.TenantId.Equals(tenantId));
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ApplicationUser GetUserById([Service] IServiceProvider serviceProvider,[Service] UserManager<ApplicationUser> userManager, [Service] RoleManager<IdentityRole> roleManager, [Service] IHttpContextAccessor contextAccessor, [Service] IDbContextFactory<AuthenticationDbContext> dbFactory, [Service] IGenericRepositoryFactory repoFactory, string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;

            var roles = new ObjectTypes.ApplicationUserExtension().GetRoles(user, roleManager, userManager);

            if (user != null)
            {
                //Franchisor
                if (roles.Any(x => x.Name.Contains("Franchisor")))                
                {
                    var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: user.Id);
                    user.franchisorObjectData = franchisorRepo.GetByUserId(user.Id);                    
                }
                //Coach
                if (roles.Any(x => x.Name.Contains("Coach")))
                    {
                    var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: user.Id);
                    user.coachObjectData = coachRepo.GetByUserId(user.Id);                    
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.Name.Contains("Principal") || x.Name.Contains("Practitioner")))
                {
                    var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: user.Id);
                    var userData = practiRepo.GetByUserId(user.Id);                    
                    if (userData != null)
                    {
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
                }
                //Child
                if (roles.Any(x => x.Name.Contains("Child")))
                {
                    var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: user.Id);
                    user.childObjectData = childRepo.GetByUserId(user.Id);                    
                }

                return user.IsActive ? user : default(ApplicationUser);
            }
            return default(ApplicationUser);
        }

        public UserByToken GetUserByToken([Service] IServiceProvider serviceProvider, [Service] UserManager<ApplicationUser> userManager, [Service] RoleManager<IdentityRole> roleManager, [Service] IHttpContextAccessor contextAccessor, [Service] IGenericRepositoryFactory repoFactory, string token)
        {
            UserByToken tokenuser = new UserByToken();
            if (token != null)
            {
                var shortUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: null);

                var tokenusr = shortUrlRepo.GetAll().Where(x => x.URL.Contains(token)).FirstOrDefault();
                if (tokenusr != null)
                {
                    var user = userManager.FindByIdAsync(tokenusr.UserId).Result;
                    if (user != null)
                    {
                        tokenuser.FullName = user.FullName;
                        tokenuser.PhoneNumber = user.PhoneNumber;
                        tokenuser.UserId = user.Id;
                        tokenuser.RoleName = (user.practitionerObjectData != null ? "Practitioner" : user.principalObjectData != null ? "Principal" : user.coachObjectData != null ? "Coach" : "User");
                    }
                }
            }
            return tokenuser;
            }
        }
}
