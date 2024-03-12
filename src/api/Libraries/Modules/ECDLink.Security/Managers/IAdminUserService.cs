using Microsoft.AspNetCore.Identity;
using System;

namespace ECDLink.Security.Managers
{
    public interface IAdminUserService
    {
        public IdentityUser<Guid> GetValidAdminUser(string username, string password);
    }
}
