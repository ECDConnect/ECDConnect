using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    internal static class UserQueryRoleFilters
    {
        internal static async Task<IReadOnlyList<Guid>> GetRoleIdsAsync(
            AuthenticationDbContext dbContext,
            Guid tenantId,
            string roleName,
            CancellationToken cancellationToken = default)
        {
            var normalizedRoleName = roleName.ToUpperInvariant();
            return await dbContext.Roles
                .AsNoTracking()
                .Where(role =>
                    (role.TenantId == tenantId || role.TenantId == null) &&
                    (role.Name == roleName || role.NormalizedName == normalizedRoleName))
                .Select(role => role.Id)
                .ToListAsync(cancellationToken);
        }

        /// <summary>
        /// Matches the production pattern: resolve role member IDs in one query, then
        /// filter with NOT IN using a materialized Guid list (not a nested UNION/EXCEPT).
        /// </summary>
        internal static async Task<IQueryable<ApplicationUser>> ExcludeUsersWithRoleAsync(
            IQueryable<ApplicationUser> usersQuery,
            AuthenticationDbContext dbContext,
            Guid tenantId,
            string roleName,
            CancellationToken cancellationToken = default)
        {
            var roleIds = await GetRoleIdsAsync(dbContext, tenantId, roleName, cancellationToken);
            if (roleIds.Count == 0)
            {
                return usersQuery;
            }

            var userIdsWithRole = await (
                from userRole in dbContext.UserRoles.AsNoTracking()
                where roleIds.Contains(userRole.RoleId)
                join user in dbContext.Users.AsNoTracking() on userRole.UserId equals user.Id
                where user.TenantId == tenantId
                select userRole.UserId
            ).Distinct().ToListAsync(cancellationToken);

            if (userIdsWithRole.Count == 0)
            {
                return usersQuery;
            }

            return usersQuery.Where(user => !userIdsWithRole.Contains(user.Id));
        }

        internal static IQueryable<ApplicationUser> FilterUsersWithRole(
            IQueryable<ApplicationUser> usersQuery,
            AuthenticationDbContext dbContext,
            Guid tenantId,
            string roleName,
            bool includeUsersInRole,
            bool? isActive = null)
        {
            var normalizedRoleName = roleName.ToUpperInvariant();
            var roleIds = dbContext.Roles
                .AsNoTracking()
                .Where(role =>
                    (role.TenantId == tenantId || role.TenantId == null) &&
                    (role.Name == roleName || role.NormalizedName == normalizedRoleName))
                .Select(role => role.Id);

            var roleUserIds = dbContext.UserRoles
                .AsNoTracking()
                .Where(userRole => roleIds.Contains(userRole.RoleId))
                .Select(userRole => userRole.UserId)
                .Distinct();

            usersQuery = includeUsersInRole
                ? usersQuery.Where(user => roleUserIds.Contains(user.Id))
                : usersQuery.Where(user => !roleUserIds.Contains(user.Id));

            if (isActive.HasValue)
            {
                usersQuery = usersQuery.Where(user => user.IsActive == isActive.Value);
            }

            return usersQuery;
        }
    }
}