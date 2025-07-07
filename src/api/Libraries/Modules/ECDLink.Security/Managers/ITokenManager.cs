using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace ECDLink.Security.Managers
{
    public interface ITokenManager<T, U>
        where T : IdentityUser<Guid>
        where U : class, ITokenManager<T, U>
    {
        Task<T> GetValidUserWithTokenAsync(string userName, string token);

        Task<string> GenerateTokenAsync(T user);

        Task<bool> VerifyTokenAsync(T user, string token);

        Task<bool> RetractTokensAsync(T user);

        Task<string> RefreshJwtTokenAsync(string userName, string token);
    }
}
