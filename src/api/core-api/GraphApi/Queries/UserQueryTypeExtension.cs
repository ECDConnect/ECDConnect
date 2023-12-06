using ECDLink.Abstractrions.GraphQL.Enums;
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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.Abstractrions.GraphQL.Attributes;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using HotChocolate.Data;
using ECDLink.Core.Models;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {
        private const string USER = PermissionGroups.USER;
        private static readonly string[] _customFilterTypes = new string[] { nameof(SiteAddress.Province).ToLowerInvariant(), Roles.ADMINISTRATOR.ToLowerInvariant() };
        public UserQueryTypeExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        // TODO: Move paging code into a "Pagination" service
        // TODO: Builder pattern for query?
        [UseSorting]
        public async Task<IQueryable<ApplicationUser>> GetUsersAsync(
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            PagedQueryInput? pagingInput = null,
            string search = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

            var usersQuery = userManager.Users
                .Where(u => u.TenantId == tenantId)
                .AsNoTracking();

            usersQuery = await GetAllAdminUsersForTenantAndExclude(userManager, userIsAdmin, usersQuery);

            usersQuery = AddProvinceFilter(repoFactory, pagingInput, usersQuery);
            usersQuery = await AddAdministratorFilter(userManager, pagingInput, usersQuery);
            usersQuery = PaginationHelper.AddFiltering(pagingInput?.FilterBy, usersQuery);
            usersQuery = AddDefaultUserSearch(search, usersQuery);

            if (pagingInput is not null && pagingInput.PageSize is not null)
                usersQuery = PaginationHelper.AddPaging(pagingInput.RowOffset, pagingInput.PageSize ?? 1, usersQuery);

            return usersQuery;
        }

        private static IQueryable<ApplicationUser> AddDefaultUserSearch(string search, IQueryable<ApplicationUser> usersQuery)
        {
            if (!string.IsNullOrWhiteSpace(search))
                usersQuery = usersQuery
                    .Where(h => EF.Functions.ILike(h.FullName, $"%{search}%")
                    || EF.Functions.ILike(h.IdNumber, $"%{search}%")
                    || EF.Functions.ILike(h.PhoneNumber, $"%{search}%")
                    || EF.Functions.ILike(h.Email, $"%{search}%"));
            return usersQuery;
        }

        private static async Task<IQueryable<ApplicationUser>> GetAllAdminUsersForTenantAndExclude(UserManager<ApplicationUser> userManager, bool userIsAdmin, IQueryable<ApplicationUser> usersQuery)
        {
            if (!userIsAdmin)
            {
                var adminUsers = await userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR);
                var adminUserIds = adminUsers
                    .Where(u => u.TenantId == TenantExecutionContext.Tenant.Id)
                    .Select(r => r.Id)
                    .ToList();

                usersQuery = usersQuery.Where(u => !adminUserIds.Contains(u.Id));
            }

            return usersQuery;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        // TODO: Move paging code into a "Pagination" service
        // TODO: Builder pattern for query?
        public async Task<int> GetCountUsersAsync(
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            PagedQueryInput? pagingInput = null,
            string search = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

            var usersQuery = userManager.Users
                .Where(u => u.TenantId == tenantId)
                .AsNoTracking();

            usersQuery = await GetAllAdminUsersForTenantAndExclude(userManager, userIsAdmin, usersQuery);

            usersQuery = AddProvinceFilter(repoFactory, pagingInput, usersQuery);
            usersQuery = await AddAdministratorFilter(userManager, pagingInput, usersQuery);
            usersQuery = PaginationHelper.AddFiltering(pagingInput?.FilterBy, usersQuery);
            usersQuery = AddDefaultUserSearch(search, usersQuery);

            return usersQuery.Count();
        }

        // Can this become generic?
        private IQueryable<ApplicationUser> AddProvinceFilter(
            IGenericRepositoryFactory repoFactory,
            PagedQueryInput pagingInput,
            IQueryable<ApplicationUser> usersQuery)
        {
            if (pagingInput is null)
                return usersQuery;

            var provinceFilters = pagingInput.FilterBy?
                .Where(f => f.FieldName.ToLowerInvariant() == nameof(SiteAddress.Province).ToLowerInvariant())
                .ToList();

            if (provinceFilters?.Any() ?? false)
            {
                using var provinceRepo = repoFactory.CreateGenericRepository<Province>();
                var provinces = provinceRepo.GetAll()
                    .Where(p =>
                    (p.TenantId == null || p.TenantId == TenantExecutionContext.Tenant.Id)
                    && p.IsActive);

                var provinceIds = new List<Guid>();

                foreach (var provinceFilter in provinceFilters)
                {
                    if (provinceFilter.FilterType == InputFilterComparer.Equals)
                    {
                        var provinceId = provinces.FirstOrDefault(p => p.Description == provinceFilter.Value)?.Id;
                        if (provinceId is not null && provinceId != Guid.Empty)
                            provinceIds.Add(provinceId ?? Guid.Empty);
                    }
                    else if (provinceFilter.FilterType == InputFilterComparer.Contains)
                    {
                        var provinceIdsToAdd = provinces
                            .Where(p => p.Description.Contains(provinceFilter.Value))
                            .Select(p => p.Id)
                            .ToList();
                        provinceIds.AddRange(provinceIdsToAdd);
                    }
                    else if (provinceFilter.FilterType == InputFilterComparer.ILike)
                    {
                        var provinceIdsToAdd = provinces
                            .Where(p => EF.Functions.ILike(p.Description, $"%{provinceFilter.Value}%"))
                            .Select(p => p.Id)
                            .ToList();
                        provinceIds.AddRange(provinceIdsToAdd);
                    }
                }


                return usersQuery
                    .Where(u => provinceIds.Contains(u.practitionerObjectData.SiteAddress.ProvinceId ?? Guid.Empty)
                    || provinceIds.Contains(u.coachObjectData.SiteAddress.ProvinceId ?? Guid.Empty)
                    || provinceIds.Contains(u.franchisorObjectData.SiteAddress.ProvinceId ?? Guid.Empty));
            }

            return usersQuery;
        }

        // TODO: add logic to comply with, Admins can see admins, but other users can't see admins
        private async Task<IQueryable<ApplicationUser>> AddAdministratorFilter(
            UserManager<ApplicationUser> userManager,
            ECDLink.Abstractrions.GraphQL.Attributes.PagedQueryInput pagingInput,
            IQueryable<ApplicationUser> usersQuery)
        {
            // Just get the last "Administrator" filter element, more than one doesn't make sense.
            var adminFilter = pagingInput?.FilterBy?
                .Where(f => f.FieldName.ToLowerInvariant() == Roles.ADMINISTRATOR.ToLowerInvariant())
                .LastOrDefault();
            if (!bool.TryParse(adminFilter?.Value, out bool isAdminFilterValue))
                isAdminFilterValue = false;

            if (adminFilter is not null)
            {
                var adminUsers = await userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR);
                var adminUserIds = adminUsers
                    .Where(u => u.TenantId == TenantExecutionContext.Tenant.Id)
                    .Select(r => r.Id).ToList();

                // Get where user.Id is in admin id list. Or not in adminId list if isAdminFilterValue == false
                return usersQuery.Where(u => isAdminFilterValue ? adminUserIds.Contains(u.Id) : !adminUserIds.Contains(u.Id));
            }

            return usersQuery;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<ApplicationUser> GetUserById(
            [Service] UserManager<ApplicationUser> userManager,
            [Service] RoleManager<ApplicationIdentityRole> roleManager,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return default(ApplicationUser);
            }

            var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);

            //Franchisor
            if (roles.Any(x => x.Name.Contains(Roles.FRANCHISOR)))
            {
                var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: user.Id);
                user.franchisorObjectData = franchisorRepo.GetByUserId(user.Id);
            }
            //Coach
            if (roles.Any(x => x.Name.Contains(Roles.COACH)))
            {
                var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: user.Id);
                user.coachObjectData = coachRepo.GetByUserId(user.Id);
            }
            //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
            if (roles.Any(x => x.Name.Contains(Roles.PRINCIPAL) || x.Name.Contains(Roles.PRACTITIONER)))
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
                    else if (userData.IsTrainee.HasValue && userData.IsTrainee == true)
                    {
                        var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: user.Id);
                        var traineeUserData = traineeRepo.GetByUserId(user.Id);
                        user.practitionerObjectData = null;
                        user.principalObjectData = null;
                        user.traineeObjectData = traineeUserData;
                    }
                    else
                    {
                        user.principalObjectData = null;
                        user.practitionerObjectData = userData;
                    }
                }
            }
            //TODO: ADD CHW object / indicator

            //TODO: Add Teamlead object / indicator

            //Child
            if (roles.Any(x => x.Name.Contains(Roles.CHILD)))
            {
                var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: user.Id);
                user.childObjectData = childRepo.GetByUserId(user.Id);
            }

            return user;
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

                    if (user is null)
                    {
                        throw new Exception("User not found.");
                    }

                    Guid tenantId = TenantExecutionContext.Tenant.Id;

                    if (user.TenantId != tenantId && user.TenantId != null)
                    {
                        throw new Exception("Cross tenant access denied.");
                    }

                    tokenuser.FullName = user.FullName;
                    tokenuser.PhoneNumber = user.PhoneNumber;
                    tokenuser.UserId = user.Id;
                    tokenuser.RoleName = (user.practitionerObjectData != null
                        ? Roles.PRACTITIONER
                        : user.principalObjectData != null
                            ? Roles.PRINCIPAL
                            : user.coachObjectData != null
                                ? Roles.COACH
                                : USER);

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
            string moodleConfigVar = TenantExecutionContext.Tenant.MoodleConfigVar;
            if (string.IsNullOrEmpty(moodleConfigVar))
            {
                return "false";
            }
            var moodleConfig = JsonConvert.DeserializeObject<MoodleConfig>(moodleConfigVar);
            if (moodleConfig == null)
            {
                return "false";
            }

            var user = userManager.FindByIdAsync(userId).Result;

            var moodleUser = new MoodleUser()
            {
                IdNumber = user.IdNumber,
                Firstname = user.FirstName,
                Lastname = user.Surname,
                Phone1 = string.IsNullOrEmpty(user.PhoneNumber) ? "" : user.PhoneNumber
            };
            // create user for moodle
            return moodleManager.CreateUserAsync(moodleConfig, moodleUser).Result.ToString();
            // create session for moodle user
            // return moodleManager.CreateUserSessionAsync(moodleUserName).Result;
        }


        

    }
}
