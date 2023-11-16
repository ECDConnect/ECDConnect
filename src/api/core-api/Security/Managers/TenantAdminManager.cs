using ECDLink.PostgresTenancy.Entities;
using ECDLink.Security.Managers;
using Microsoft.AspNetCore.Identity;
using System;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class TenantAdminManager : IAdminUserService
    {
        private readonly UserManager<TenancyIdentityUser> _userManager;

        public TenantAdminManager(UserManager<TenancyIdentityUser> userManager)
        {
            _userManager = userManager;
        }

        public IdentityUser<Guid> GetValidAdminUser(string username, string password)
        {
            var admin = _userManager.FindByNameAsync(username).Result;

            if (admin == default(IdentityUser<Guid>))
            {
                return null;
            }

            var passwordResult = _userManager.CheckPasswordAsync(admin, password).Result;

            if (!passwordResult)
            {
                return null;
            }

            return admin;
        }
    }
}
