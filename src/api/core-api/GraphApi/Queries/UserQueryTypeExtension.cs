using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.ObjectTypes.Input;
using ECDLink.EGraphQL.ObjectTypes.Input.Enums;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {
        private const string USER = PermissionGroups.USER;
        private static readonly string[] _customFilterTypes = new string[] { nameof(SiteAddress.Province), Roles.ADMINISTRATOR };
        public UserQueryTypeExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        // TODO: Move paging code into a "Pagination" service
        // TODO: Builder pattern for query?
        public async Task<IQueryable<ApplicationUser>> GetUsersAsync(
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            PagedQueryInput? pagingInput = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var usersQuery = userManager.Users
                .Where(u => u.TenantId == tenantId)
                .AsNoTracking();

            usersQuery = await AddProvinceFilter(repoFactory, pagingInput, usersQuery);
            usersQuery = await AddAdministratorFilter(userManager, pagingInput, usersQuery);

            usersQuery = AddFiltering(pagingInput, usersQuery);
            usersQuery = AddSorting(pagingInput, usersQuery);

            return usersQuery
                .Skip(pagingInput.RowOffset)
                .Take(pagingInput.PageSize);
        }

        private async Task<IQueryable<ApplicationUser>> AddProvinceFilter(IGenericRepositoryFactory repoFactory, PagedQueryInput pagingInput, IQueryable<ApplicationUser> usersQuery)
        {
            var provinceFilters = pagingInput?.FilterBy?
                .Where(f => f.FieldName == nameof(SiteAddress.Province))
                .Select(f => f.Value)
                .ToList();

            if (provinceFilters?.Any() ?? false)
            {
                using var provinceRepo = repoFactory.CreateGenericRepository<Province>();
                var provinceIds = await provinceRepo.GetAll()
                    .Where(p => provinceFilters.Contains(p.Description))
                    .Select(p => p.Id).ToListAsync();

                usersQuery = usersQuery
                    .Where(u => provinceIds.Contains(u.practitionerObjectData.SiteAddress.ProvinceId ?? Guid.Empty)
                    || provinceIds.Contains(u.coachObjectData.SiteAddress.ProvinceId ?? Guid.Empty)
                    || provinceIds.Contains(u.franchisorObjectData.SiteAddress.ProvinceId ?? Guid.Empty));
            }

            return usersQuery;
        }

        private async Task<IQueryable<ApplicationUser>> AddAdministratorFilter(UserManager<ApplicationUser> userManager, PagedQueryInput pagingInput, IQueryable<ApplicationUser> usersQuery)
        {
            // Just get the last "Administrator" filter element, more than one doesn't make sense.
            var adminFilterValue = pagingInput?.FilterBy?
                .Where(f => f.FieldName == Roles.ADMINISTRATOR)
                .LastOrDefault()
                .Value?.ToLowerInvariant();

            var useAdminFilter = adminFilterValue == "true";

            if (useAdminFilter)
            {
                var adminUsers = await userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR);
                var adminUserIds = adminUsers
                    .Where(u => u.TenantId == TenantExecutionContext.Tenant.Id)
                    .Select(r => r.Id).ToList();

                usersQuery = usersQuery.Where(u => adminUserIds.Contains(u.Id));
            }

            return usersQuery;
        }

        private static IQueryable<ApplicationUser> AddFiltering(PagedQueryInput pagingInput, in IQueryable<ApplicationUser> usersQueryIn)
        {
            var usersQuery = usersQueryIn.Where(t => true);

            if (pagingInput?.FilterBy?.Any() ?? false)
            {
                foreach (var filter in pagingInput.FilterBy)
                {
                    // Ignore the filters added by the province and administrator filters
                    // TODO: This should be parameter.
                    if (!_customFilterTypes.Contains(filter.FieldName.ToLower()))
                        switch (filter.FilterType)
                        {
                            case null:
                            case InputFilterComparer.Equals:
                                {
                                    if (filter.Value is null)
                                        usersQuery = usersQuery.Where(u => EF.Property<object>(u, filter.FieldName) == null);
                                    if (DateTime.TryParse(filter.Value, out var date))
                                        usersQuery = usersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) == date);
                                    else if (Guid.TryParse(filter.Value, out var guid))
                                        usersQuery = usersQuery.Where(u => guid == EF.Property<Guid?>(u, filter.FieldName));
                                    else if (int.TryParse(filter.Value, out var @int))
                                        usersQuery = usersQuery.Where(u => @int == EF.Property<int?>(u, filter.FieldName));
                                    else
                                        usersQuery = usersQuery.Where(u => EF.Property<string>(u, filter.FieldName) == filter.Value);
                                }
                                break;
                            case InputFilterComparer.Contains:
                                usersQuery = usersQuery.Where(u => EF.Property<string>(u, filter.FieldName).Contains(filter.Value));
                                break;
                            case InputFilterComparer.GreaterThan:
                                {
                                    if (DateTime.TryParse(filter.Value, out var date))
                                        usersQuery = usersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) > date);
                                    else if (int.TryParse(filter.Value, out int intGt))
                                        usersQuery = usersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) > intGt);
                                }
                                break;
                            case InputFilterComparer.LessThan:
                                {
                                    if (DateTime.TryParse(filter.Value, out var date))
                                        usersQuery = usersQuery.Where(u => EF.Property<DateTime?>(u, filter.FieldName) < date);
                                    else if (int.TryParse(filter.Value, out int intGt))
                                        usersQuery = usersQuery.Where(u => EF.Property<int?>(u, filter.FieldName) < intGt);
                                }
                                break;
                        }
                }
            }

            return usersQuery;
        }

        private static IQueryable<ApplicationUser> AddSorting(PagedQueryInput pagingInput, IQueryable<ApplicationUser> usersQuery)
        {
            if (pagingInput.SortBy?.Any() ?? false)
            {
                foreach (var sort in pagingInput.SortBy)
                {
                    // TODO: Get this working with HotChocolate :(
                    var sortByFieldName = sort?.FieldName ?? nameof(ApplicationUser.FullName);

                    if (sort.Descending)
                        usersQuery = usersQuery.OrderByDescending(u => EF.Property<object>(u, sortByFieldName));
                    else
                        usersQuery = usersQuery.OrderBy(u => EF.Property<object>(u, sortByFieldName));
                }
            }
            else
            {
                usersQuery = usersQuery.OrderBy(u => u.Surname).ThenBy(u => u.FirstName);
            }

            return usersQuery;
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
                        else
                        {
                            user.principalObjectData = null;
                            user.practitionerObjectData = userData;
                        }
                    }
                }
                //Child
                if (roles.Any(x => x.Name.Contains(Roles.CHILD)))
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

            var user = userManager.FindByIdAsync(userId).Result;
            var moodleUserName = user.IdNumber + "@ecdconnect.co.za";
            var moodlePassword = "Test@1234";

            var cohorts = new List<string>();

            string moodleConfigVar = TenantExecutionContext.Tenant.MoodleConfigVar;
            if (!string.IsNullOrEmpty(moodleConfigVar))
            {
                var moodleConfig = JsonConvert.DeserializeObject<MoodleConfig>(moodleConfigVar);
                var allCohorts = moodleConfig.All.Cohorts;
                foreach (var cohort in allCohorts)
                {
                    cohorts.Add(cohort);
                }
            }

            var moodleUser = new MoodleUser()
            {
                UserName = moodleUserName,
                Password = moodlePassword,
                IdNumber = user.IdNumber,
                Firstname = user.FirstName,
                Lastname = user.Surname,
                Email = moodleUserName, // user.Email,
                Phone1 = string.IsNullOrEmpty(user.PhoneNumber) ? "" : user.PhoneNumber
            };
            // create user for moodle
            return moodleManager.CreateUserAsync(moodleUser, cohorts).Result.ToString();
            // create session for moodle user
            // return moodleManager.CreateUserSessionAsync(moodleUserName).Result;
        }

    }
}
