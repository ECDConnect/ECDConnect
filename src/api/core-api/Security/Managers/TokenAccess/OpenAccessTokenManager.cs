using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Managers;
using ECDLink.Security.Providers;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class OpenAccessTokenManager : ITokenManager<ApplicationUser, OpenAccessTokenManager>
    {
        private readonly ApplicationUserManager _userManager;

        private string AccessTokenProvider
        {
            get
            {
                return ProviderKeys.Tokens.OPEN_ACCESS;
            }
        }

        private string AccessTokenPurpose
        {
            get
            {
                return "Open Access Authentication";
            }
        }

        public OpenAccessTokenManager(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public async Task<ApplicationUser> GetValidUserWithTokenAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return default(ApplicationUser);
            }

            var result = await _userManager.VerifyUserTokenAsync(user, AccessTokenProvider, AccessTokenPurpose, token);

            if (!result)
            {
                return default(ApplicationUser);
            }

            return user;
        }

        public async Task<string> GenerateTokenAsync(ApplicationUser user)
        {
            if (user == default(ApplicationUser))
            {
                return string.Empty;
            }

            var token = await _userManager.GenerateUserTokenAsync(user, AccessTokenProvider, AccessTokenPurpose);

            return token;
        }

        public async Task<bool> VerifyTokenAsync(ApplicationUser user, string token)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            var isVarified = await _userManager.VerifyUserTokenAsync(user, AccessTokenProvider, AccessTokenPurpose, token);

            return isVarified;
        }

        public async Task<bool> RetractTokensAsync(ApplicationUser user)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            var isRetracted = await _userManager.UpdateSecurityStampAsync(user);
            await _userManager.UpdateAsync(user);

            return isRetracted.Succeeded;
        }

        public async Task<string> RefreshJwtTokenAsync(string userName, string token)
        {
            throw new NotSupportedException("Unable to refresh a temporary open token");
        }
    }
}
