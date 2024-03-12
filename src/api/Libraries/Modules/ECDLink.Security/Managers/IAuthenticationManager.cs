using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace ECDLink.Security.Managers
{
    public interface IAuthenticationManager<T>
        where T : IdentityUser<Guid>
    {
        Task<T> LogInWithPhoneNumberAsync(string phoneNumber, string password);

        Task<T> LogInWithUsernameAsync(string username, string password);
    }
}
