using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using GreenDonut;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.DataLoaders
{
    public class UserRolesGroupedDataLoader : GroupedDataLoader<Guid, ApplicationIdentityRole>
    {
        private readonly IDbContextFactory<AuthenticationDbContext> _dbContextFactory;

        public UserRolesGroupedDataLoader(
            IBatchScheduler batchScheduler,
            DataLoaderOptions options,
            IDbContextFactory<AuthenticationDbContext> dbContextFactory)
            : base(batchScheduler, options)
        {
            _dbContextFactory = dbContextFactory;
        }

        protected override async Task<ILookup<Guid, ApplicationIdentityRole>> LoadGroupedBatchAsync(
            IReadOnlyList<Guid> keys,
            CancellationToken cancellationToken)
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var userRoles = await (
                from userRole in dbContext.UserRoles
                where keys.Contains(userRole.UserId)
                join role in dbContext.Roles on userRole.RoleId equals role.Id
                select new { userRole.UserId, Role = role }
            ).AsNoTracking().ToListAsync(cancellationToken);

            return userRoles.ToLookup(x => x.UserId, x => x.Role);
        }
    }
}