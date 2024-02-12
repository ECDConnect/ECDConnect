using ECDLink.Core.Models.Settings;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.DataAccessLayer.Services
{
    public class SystemSettingsService : ISystemSettingsService
    {
        private readonly AuthenticationDbContext _context;

        public SystemSettingsService(IServiceProvider provider)
        {
            _context = provider.CreateScope().ServiceProvider.GetService<AuthenticationDbContext>();
        }

        public IEnumerable<ISetting> GetSystemSettings()
        {
            if (!_context.Database.CanConnect())
            {
                return new List<ISetting>();
            }

            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _context.SystemSettings.Where(e => e.TenantId == null || e.TenantId == tenantId).ToList();
        }
    }
}
