using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Moodle.Managers;
using ECDLink.Moodle.Models;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {

        public UserQueryTypeExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<IEnumerable<ApplicationUser>> GetUsers([Service]UserManager<ApplicationUser> userManager)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return userManager.Users.Where(x => x.TenantId.Equals(tenantId));
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<ApplicationUser> GetUserById(
            [Service] UserManager<ApplicationUser> userManager, 
            [Service] RoleManager<IdentityRole> roleManager, 
            IGenericRepositoryFactory repoFactory, 
            string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;

            var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);

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

        public UserByToken GetUserByToken(
            [Service] UserManager<ApplicationUser> userManager, 
            IGenericRepositoryFactory repoFactory, 
            string token)
        {
            UserByToken tokenuser = new UserByToken();
            if (token != null)
            {
                var shortUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: null);

                var tokenusr = shortUrlRepo.GetAll().Where(x => x.URL.Contains(token)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
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

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public string getMoodleSessionForUserId(
            [Service] MoodleManager moodleManager,
            [Service] UserManager<ApplicationUser> userManager,
            string userId)
        {

            var user = userManager.FindByIdAsync(userId).Result;
            var moodleUserName = user.IdNumber + "@ecdconnect.co.za";
            var moodlePassword = "Test@1234";
            var cohortName = "Grow Great";
            string orgName = TenantExecutionContext.Tenant.OrganisationName;

            if (orgName == "SmartStart")
            {
                cohortName = "Smart Start";
            }


            // create the moodle user
            var moodleUser = new MoodleUser()
            {
                UserName = moodleUserName,
                Password = moodlePassword,
                IdNumber = user.IdNumber,
                Firstname = user.FirstName,
                Lastname = user.Surname,
                Email = user.Email,
                Phone1 = user.PhoneNumber
            };
            // create user for moodle
            moodleManager.CreateUserAsync(moodleUser, cohortName).Wait();
            // create session for moodle user
            return moodleManager.CreateUserSessionAsync(moodleUserName).Result;
        }

    }
}
