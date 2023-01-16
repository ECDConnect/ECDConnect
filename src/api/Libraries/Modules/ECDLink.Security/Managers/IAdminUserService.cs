using Microsoft.AspNetCore.Identity;

namespace ECDLink.Security.Managers
{
    public interface IAdminUserService
    {
        public IdentityUser GetValidAdminUser(string username, string password);
    }
}
