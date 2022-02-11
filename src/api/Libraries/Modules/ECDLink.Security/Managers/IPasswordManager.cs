using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.Security.Managers
{
    public interface IPasswordManager<T>
        where T: IdentityUser
    {
        Task<string> RequestPasswordResetTokenAsync(T user);

        Task<bool> AddPasswordAsync(T user, string password);

        Task<string> ConfirmPasswordResetAsync(T user, string token, string password);

        Task<bool> IsPasswordSecureAsync(T user, string password);

        Task<bool> IsPasswordValidAsync(T user, string password);

        Task<bool> IsResetTokenValidAsync(T user, string token);
    }
}
