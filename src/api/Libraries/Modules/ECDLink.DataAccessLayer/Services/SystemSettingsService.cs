using ECDLink.Core.Models.Settings;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Services
{
    public class SystemSettingsService : ISystemSettingsService
    {
        private readonly AuthenticationDbContext _context;

        public SystemSettingsService(IServiceProvider provider)
        {
            _context = provider.CreateScope().ServiceProvider.GetService<AuthenticationDbContext>();
        }

        public async Task<IEnumerable<ISetting>> GetSystemSettings()
        {
            if (!_context.Database.CanConnect())
            {
                return new List<ISetting>();
            }

            return _context.SystemSettings.ToList();
        }
    }
}
