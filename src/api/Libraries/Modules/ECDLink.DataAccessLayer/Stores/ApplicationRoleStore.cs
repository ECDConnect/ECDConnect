using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace ECDLink.DataAccessLayer.Stores
{
    public class ApplicationRoleStore : IQueryableRoleStore<ApplicationIdentityRole>
    {
        private readonly AuthenticationDbContext _context;
        private readonly Guid _tenantId;

        public ApplicationRoleStore(AuthenticationDbContext context)
        {
            _context = context;
            _tenantId = TenantExecutionContext.Tenant.Id;
        }

        public IQueryable<ApplicationIdentityRole> Roles
        {
            get
            {
                return _context.Roles.Where(x => x.TenantId == _tenantId);
            }
        }

        public Task<IdentityResult> CreateAsync(ApplicationIdentityRole role, CancellationToken cancellationToken)
        {
            role.TenantId = _tenantId;
            _context.Roles.Add(role);
            _context.SaveChanges();
            return Task.FromResult(IdentityResult.Success);
        }

        public Task<IdentityResult> DeleteAsync(ApplicationIdentityRole role, CancellationToken cancellationToken)
        {
            role.TenantId = _tenantId;
            _context.Roles.Remove(role);
            _context.SaveChanges();
            return Task.FromResult(IdentityResult.Success);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public Task<ApplicationIdentityRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
        {
            var role = _context.Roles.Where(x => x.TenantId == _tenantId && x.Id == Guid.Parse(roleId)).SingleOrDefault();
            return Task.FromResult(role);
        }

        public Task<ApplicationIdentityRole> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
        {
            var role = _context.Roles.Where(x => x.TenantId == _tenantId && (x.NormalizedName == normalizedRoleName || x.Name == normalizedRoleName)).SingleOrDefault();
            return Task.FromResult(role);
        }

        public Task<string> GetNormalizedRoleNameAsync(ApplicationIdentityRole role, CancellationToken cancellationToken)
        {
            return Task.FromResult(role.NormalizedName);
        }

        public Task<string> GetRoleIdAsync(ApplicationIdentityRole role, CancellationToken cancellationToken)
        {
            return Task.FromResult(role.Id.ToString());
        }

        public Task<string> GetRoleNameAsync(ApplicationIdentityRole role, CancellationToken cancellationToken)
        {
            return Task.FromResult(role.Name);
        }

        public Task SetNormalizedRoleNameAsync(ApplicationIdentityRole role, string normalizedName, CancellationToken cancellationToken)
        {
            role.NormalizedName = normalizedName;
            //_context.Roles.Update(role);
            //_context.SaveChanges();
            return Task.CompletedTask;
        }

        public Task SetRoleNameAsync(ApplicationIdentityRole role, string roleName, CancellationToken cancellationToken)
        {
            role.Name = roleName;
            //_context.Roles.Update(role);
            //_context.SaveChanges();
            return Task.CompletedTask;
        }

        public Task<IdentityResult> UpdateAsync(ApplicationIdentityRole role, CancellationToken cancellationToken)
        {
            _context.Roles.Update(role);
            _context.SaveChanges();
            return Task.FromResult(IdentityResult.Success);
        }
    }
}

