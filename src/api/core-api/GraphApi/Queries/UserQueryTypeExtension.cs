using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
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
            [Service] ApplicationUserManager userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            PagedQueryInput pagingInput = null,
            string search = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR) || await userManager.IsInRoleAsync(currentUser, Roles.SUPER_ADMINISTRATOR);

            var usersQuery = userManager.Users
                .Where(u => u.TenantId == tenantId && !u.UserName.StartsWith("External_Edit"))
                .AsNoTracking();


            usersQuery = await ExcludeChildren(userManager, usersQuery);
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

        private static async Task<IQueryable<ApplicationUser>> ExcludeChildren(ApplicationUserManager userManager, IQueryable<ApplicationUser> usersQuery)
        {
            var children = await userManager.GetUsersInRoleAsync(Roles.CHILD);
            var userIds = children
                .Where(u => u.TenantId == TenantExecutionContext.Tenant.Id)
                .Select(r => r.Id)
                .ToList();
            return usersQuery.Where(u => !userIds.Contains(u.Id));
        }

        private static async Task<IQueryable<ApplicationUser>> GetAllAdminUsersForTenantAndExclude(ApplicationUserManager userManager, bool userIsAdmin, IQueryable<ApplicationUser> usersQuery)
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
            [Service] ApplicationUserManager userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            PagedQueryInput pagingInput = null,
            string search = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
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
                    || provinceIds.Contains(u.coachObjectData.SiteAddress.ProvinceId ?? Guid.Empty));
            }

            return usersQuery;
        }

        // TODO: add logic to comply with, Admins can see admins, but other users can't see admins
        private async Task<IQueryable<ApplicationUser>> AddAdministratorFilter(
            ApplicationUserManager userManager,
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
            [Service] ApplicationUserManager userManager,
            [Service] ApplicationRoleManager roleManager,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return default(ApplicationUser);
            }

            var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);
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
            if (roles.Any(x => x.Name.Contains(Roles.ADMINISTRATOR)))
            {
                user.isAdminRegistered = user.PasswordHash != null;
            }
            return user;
        }

        public UserByToken GetUserByToken(
            [Service] ApplicationUserManager userManager,
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
                    var user = userManager.FindByIdAsync(tokenusr.UserId.ToString()).Result;

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
                    tokenuser.UserId = user.Id.ToString();
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
        public string getMoodleSessionForCurrentUser(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ITrainingService moodleService)
        {
            var currentUser = httpContextAccessor.HttpContext.GetUser();
            if (currentUser == null) return null;
            return moodleService.CreateUserAsync(currentUser).Result.ToString();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public string GetLatestUrlInviteForUser(
            [Service] ShortUrlManager shortUrlManager,
            Guid userId)
        {
            return shortUrlManager.GetLatestUrlInviteForUser(userId, TemplateTypeConstants.Invitation);
        }

        public UserSyncStatus GetUserSyncStatus(
           AuthenticationDbContext dbContext,
           Guid userId, DateTime lastSync, Guid classroomId)
        {
            var childrenCount = dbContext.Children.FromSql($@"
            SELECT c.""Id""
            FROM ""Child"" c 
            JOIN ""Practitioner"" p ON c.""Hierarchy"" LIKE p.""Hierarchy"" || '%'
            WHERE (p.""UserId"" = {userId}::uuid OR p.""PrincipalHierarchy"" = {userId}::uuid)
            AND c.""IsActive"" IS TRUE 
            AND c.""UpdatedDate"" > {lastSync}
            ").Count();

            var classroomCount = dbContext.ClassroomGroups.FromSql($@"
            SELECT cg.""Id""
            FROM ""ClassroomGroup"" cg 
            WHERE cg.""UserId"" = {userId}::uuid 
            AND cg.""InsertedDate"" > {lastSync}
            ").Count();

            var pointsCount = dbContext.PointsUserSummary.FromSql($@"
            SELECT pus.""Id""
            FROM ""PointsUserSummary"" pus 
            WHERE pus.""UserId"" = {userId}::uuid 
            AND pus.""UpdatedDate"" > {lastSync}
            ").Count();

            var periodCount = dbContext.ChildProgressReportPeriod.FromSql($@"
            SELECT cprp.""Id""
            FROM ""ChildProgressReportPeriod"" cprp 
            WHERE cprp.""ClassroomId"" = {classroomId}::uuid 
            AND cprp.""InsertedDate"" > {lastSync}
            ").Count();

            var permissionsCount = dbContext.PointsUserSummary.FromSql($@"
            SELECT up.""Id""
            FROM ""UserPermission"" up 
            WHERE up.""UserId"" = {userId}::uuid 
            AND up.""UpdatedDate"" > {lastSync}
            ").Count();

            return new UserSyncStatus
            {
                SyncChildren = childrenCount >= 1,
                SyncClassroom = classroomCount >= 1,
                SyncReportingPeriods = periodCount >= 1,
                SyncPoints = pointsCount >= 1,
                SyncPermissions = permissionsCount >= 1
            };
        }
    }
}
