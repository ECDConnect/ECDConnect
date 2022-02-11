using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Security.Managers
{
    public interface IAdminUserService
    {
        public IdentityUser GetValidAdminUser(string username, string password);
    }
}
