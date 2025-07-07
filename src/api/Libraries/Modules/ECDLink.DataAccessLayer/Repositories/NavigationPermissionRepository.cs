using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Navigation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories
{
    public class NavigationPermissionRepository
    {
        protected IDbContextFactory<AuthenticationDbContext> _dbFactory;

        public NavigationPermissionRepository(IDbContextFactory<AuthenticationDbContext> dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public async Task AddPermissionsToNavigation(Guid navigationId, IEnumerable<Guid> permissions)
        {
            var navigationPermissionList = new List<NavigationPermission>();

            foreach (var item in permissions)
            {
                navigationPermissionList.Add(new NavigationPermission
                {
                    PermissionId = item,
                    NavigationId = navigationId
                });
            }

            using var context = _dbFactory.CreateDbContext();

            context.NavigationPermissions.AddRange(navigationPermissionList);

            try
            {
                await context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        public async Task RemovePemissionsFromNavigation(Guid navigationId, List<Guid> permissions)
        {
            using var context = _dbFactory.CreateDbContext();

            var navigationPermissionList = context.NavigationPermissions.Where(entity => entity.NavigationId == navigationId && permissions.Contains(entity.PermissionId));

            context.NavigationPermissions.RemoveRange(navigationPermissionList);

            await context.SaveChangesAsync();
        }

        public List<Permission> GetPermissionsForNavigation(Guid[] navigationIds)
        {
            using var context = _dbFactory.CreateDbContext();

            return context.NavigationPermissions
              .Where(entity => navigationIds.Contains(entity.NavigationId))
              .Include(x => x.Permission)
              .Select(role => role.Permission)
              .ToList();
        }
    }
}
