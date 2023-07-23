//using ECDLink.Abstractrions.GraphQL.Enums;
//using ECDLink.DataAccessLayer.Entities;
//using ECDLink.DataAccessLayer.Entities.Notifications;
//using ECDLink.DataAccessLayer.Entities.Users;
//using ECDLink.DataAccessLayer.Repositories.Factories;
//using ECDLink.EGraphQL.Authorization;
//using ECDLink.Moodle.Managers;
//using ECDLink.Moodle.Models;
//using ECDLink.Security;
//using ECDLink.Tenancy.Context;
//using HotChocolate;
//using HotChocolate.Types;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using ECDLink.DataAccessLayer.Helpers;
//using ECDLink.Abstractrions.GraphQL.Attributes;
//using Microsoft.AspNetCore.Http;
//using ECDLink.Security.Extensions;

//namespace EcdLink.Api.CoreApi.GraphApi.Queries
//{
//    [ExtendObjectType(OperationTypeNames.Query)]
//    public class PortalTypeExtension
//    {
//        private const string USER = PermissionGroups.USER;
//        private static readonly string[] _customFilterTypes = new string[] { nameof(SiteAddress.Province).ToLowerInvariant(), Roles.ADMINISTRATOR.ToLowerInvariant() };
//        public PortalTypeExtension()
//        {
//        }

//        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
//        public async Task<ApplicationUser> GetUserById(
//            [Service] UserManager<ApplicationUser> userManager,
//            [Service] RoleManager<IdentityRole> roleManager,
//            IGenericRepositoryFactory repoFactory,
//            string userId)
//        {
//            var user = userManager.FindByIdAsync(userId).Result;

//            if (user is null)
//            {
//                return default(ApplicationUser);
//            }

//            var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);

//            //Franchisor
//            if (roles.Any(x => x.Name.Contains(Roles.FRANCHISOR)))
//            {
//                var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: user.Id);
//                user.franchisorObjectData = franchisorRepo.GetByUserId(user.Id);
//            }
//            //Coach
//            if (roles.Any(x => x.Name.Contains(Roles.COACH)))
//            {
//                var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: user.Id);
//                user.coachObjectData = coachRepo.GetByUserId(user.Id);
//            }
//            //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
//            if (roles.Any(x => x.Name.Contains(Roles.PRINCIPAL) || x.Name.Contains(Roles.PRACTITIONER)))
//            {
//                var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: user.Id);
//                var userData = practiRepo.GetByUserId(user.Id);
//                if (userData != null)
//                {
//                    if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
//                    {
//                        user.practitionerObjectData = null;
//                        user.principalObjectData = userData;
//                    }
//                    else
//                    {
//                        user.principalObjectData = null;
//                        user.practitionerObjectData = userData;
//                    }
//                }
//            }
//            //Child
//            if (roles.Any(x => x.Name.Contains(Roles.CHILD)))
//            {
//                var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: user.Id);
//                user.childObjectData = childRepo.GetByUserId(user.Id);
//            }

//            return user.IsActive ? user : default(ApplicationUser);
//        }

//        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
//        public async Task<ApplicationUser> GetUserSummaryById(
//            [Service] UserManager<ApplicationUser> userManager,
//            [Service] RoleManager<IdentityRole> roleManager,
//            IGenericRepositoryFactory repoFactory,
//            string userId)
//        {
//            var user = userManager.FindByIdAsync(userId).Result;

//            if (user is null)
//            {
//                return default(ApplicationUser);
//            }

//            var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);

//            //Franchisor
//            if (roles.Any(x => x.Name.Contains(Roles.FRANCHISOR)))
//            {
//                var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: user.Id);
//                user.franchisorObjectData = franchisorRepo.GetByUserId(user.Id);
//            }
//            //Coach
//            if (roles.Any(x => x.Name.Contains(Roles.COACH)))
//            {
//                var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: user.Id);
//                user.coachObjectData = coachRepo.GetByUserId(user.Id);
//            }
//            //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
//            if (roles.Any(x => x.Name.Contains(Roles.PRINCIPAL) || x.Name.Contains(Roles.PRACTITIONER)))
//            {
//                var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: user.Id);
//                var userData = practiRepo.GetByUserId(user.Id);
//                if (userData != null)
//                {
//                    if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
//                    {
//                        user.practitionerObjectData = null;
//                        user.principalObjectData = userData;
//                    }
//                    else
//                    {
//                        user.principalObjectData = null;
//                        user.practitionerObjectData = userData;
//                    }
//                }
//            }
//            //Child
//            if (roles.Any(x => x.Name.Contains(Roles.CHILD)))
//            {
//                var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: user.Id);
//                user.childObjectData = childRepo.GetByUserId(user.Id);
//            }

//            return user.IsActive ? user : default(ApplicationUser);
//        }

//    }
//}
