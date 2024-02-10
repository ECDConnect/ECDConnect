using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories
{
    public class RolePermissionRepository
    {
        protected IDbContextFactory<AuthenticationDbContext> _dbFactory;

        public RolePermissionRepository(IDbContextFactory<AuthenticationDbContext> dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public async Task AddPermissionsToRole(Guid roleId, IEnumerable<Guid> permissions)
        {
            var rolePermissionList = new List<RolePermission>();

            foreach (var item in permissions)
            {
                rolePermissionList.Add(new RolePermission
                {
                    PermissionId = item,
                    RoleId = roleId
                });
            }

            using var context = _dbFactory.CreateDbContext();

            context.RolePermissions.AddRange(rolePermissionList);

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

        public async Task RemovePemissionsFromRole(Guid roleId, List<Guid> permissions)
        {
            using var context = _dbFactory.CreateDbContext();

            var rolePermissionList = context.RolePermissions.Where(entity => entity.RoleId == roleId && permissions.Contains(entity.PermissionId));

            context.RolePermissions.RemoveRange(rolePermissionList);

            await context.SaveChangesAsync();
        }

        public List<Permission> GetPermissionsForRole(Guid[] roleIds)
        {
            using var context = _dbFactory.CreateDbContext();

            return context.RolePermissions
              .Where(entity => roleIds.Contains(entity.RoleId))
              .Include(x => x.Permission)
              .Select(role => role.Permission)
              .ToList();
        }

        public bool IsPermissionInRoles(string[] roles, string permission)
        {
            using var context = _dbFactory.CreateDbContext();

            return context.RolePermissions
              .Include(x => x.Role)
              .Where(entity => roles.Contains(entity.Role.Name))
              .Include(x => x.Permission)
              .Select(role => role.Permission)
              .Any(p => string.Equals(permission, p.Name));
        }
    }
}
