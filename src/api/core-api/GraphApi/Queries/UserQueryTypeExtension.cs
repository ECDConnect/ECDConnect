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
        private readonly ITokenManager<ApplicationUser, InvitationTokenManager> _invitationManager;

        public UserQueryTypeExtension(ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager)
        {
            _invitationManager = invitationManager;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<ApplicationUser> GetUsers([Service] UserManager<ApplicationUser> userManager)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return userManager.Users.Where(x => x.TenantId.Equals(tenantId));//.OrderBy(y => y.FirstName);
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
                    user.coachObjectData = new CoachQueryExtension().GetCoachByCoachUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.Name.Contains("Principal") || x.Name.Contains("Practitioner")))
                {
                    var userData = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, repoFactory, userId);
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
                    user.childObjectData = new ChildQueryExtension().GetChildByUserId(contextAccessor, dbFactory, repoFactory, userId);
                }
                

                return user.IsActive ? user : default(ApplicationUser);
            }
            return default(ApplicationUser);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserByToken GetUserByToken([Service] IServiceProvider serviceProvider, [Service] UserManager<ApplicationUser> userManager, [Service] RoleManager<IdentityRole> roleManager, [Service] IHttpContextAccessor contextAccessor, [Service] IDbContextFactory<AuthenticationDbContext> dbFactory, [Service] IGenericRepositoryFactory repoFactory, string token)
        {
            UserByToken tokenuser = new UserByToken();
            if (token != null)
            {
                var uId = contextAccessor.HttpContext.GetUser().Id;
                var shortUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);

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
