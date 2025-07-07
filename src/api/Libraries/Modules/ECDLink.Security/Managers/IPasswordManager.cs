using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace ECDLink.Security.Managers
{
    public interface IPasswordManager<T>
        where T : IdentityUser<Guid>
    {
        Task<string> RequestPasswordResetTokenAsync(T user);

        Task<bool> AddPasswordAsync(T user, string password);

        Task<string> ConfirmPasswordResetAsync(T user, string token, string password);

        Task<bool> IsPasswordSecureAsync(T user, string password);

        Task<bool> IsPasswordValidAsync(T user, string password);

        Task<bool> IsResetTokenValidAsync(T user, string token);
    }
}
