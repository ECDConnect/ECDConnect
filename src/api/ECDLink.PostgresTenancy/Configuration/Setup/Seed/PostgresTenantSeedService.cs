using ECDLink.Core.Extensions;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.Tenancy;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace ECDLink.PostgresTenancy.Configuration.Setup.Seed
{
    public class PostgresTenantSeedService
    {
        private readonly ITenantService _tenantCache;
        private readonly UserManager<TenancyIdentityUser> _userManager;
        private readonly IConfiguration _config;

        public PostgresTenantSeedService(ITenantService tenantCache, UserManager<TenancyIdentityUser> userManager, IConfiguration config)
        {
            _tenantCache = tenantCache;
            _userManager = userManager;
            _config = config;
        }

        public void Seed()
        {
            /*
            if (_userManager.Users.Count() > 0)
            {
                return;
            }

            var franchisor = _config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);

            _tenantCache.AddTenant(new TenantModel
            {
                Id = Guid.NewGuid(),
                ApplicationName = franchisor.Application,
                OrganisationName = franchisor.Organisation,
                SiteAddress = franchisor.SiteAddress,
                AdminSiteAddress = franchisor.SiteAddress,
                TenantType = Tenancy.Enums.TenantType.Host
            });

            var user = new TenancyIdentityUser
            {
                Name = "GlobalAdmin",
                UserName = "GlobalAdmin"
            };

            _userManager.CreateAsync(user);
            _userManager.AddPasswordAsync(user, "2NeYDWfdQ9@8");
            */
        }
    }
}
