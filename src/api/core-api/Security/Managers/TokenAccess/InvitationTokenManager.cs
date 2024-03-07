using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Managers;
using ECDLink.Security.Providers;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers.TokenAccess
{
    public class InvitationTokenManager : ITokenManager<ApplicationUser, InvitationTokenManager>
    {
        private readonly ApplicationUserManager _userManager;

        private string EmailTokenProvider
        {
            get
            {
                return _userManager.Options.Tokens.EmailConfirmationTokenProvider;
            }
        }

        private string AccessTokenPurpose
        {
            get
            {
                return "Invitation Email Confirmation Authentication";
            }
        }

        public InvitationTokenManager(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> GenerateTokenAsync(ApplicationUser user)
        {
            if (user == default(ApplicationUser))
            {
                return string.Empty;
            }

            var token = await _userManager.GenerateUserTokenAsync(user, EmailTokenProvider, AccessTokenPurpose);

            return token;
        }

        public async Task<ApplicationUser> GetValidUserWithTokenAsync(string userName, string token)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return default(ApplicationUser);
            }

            var result = await _userManager.VerifyUserTokenAsync(user, EmailTokenProvider, AccessTokenPurpose, token);

            if (!result)
            {
                return default(ApplicationUser);
            }

            return user;
        }

        public async Task<string> RefreshJwtTokenAsync(string userName, string token)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return string.Empty;
            }

            var result = await _userManager.RemoveAuthenticationTokenAsync(user, EmailTokenProvider, ProviderKeys.Tokens.EMAIL);

            if (!result.Succeeded)
            {
                return string.Empty;
            }

            return await GenerateTokenAsync(user);
        }

        public async Task<bool> RetractTokensAsync(ApplicationUser user)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            var isRetracted = await _userManager.UpdateSecurityStampAsync(user);

            return isRetracted.Succeeded;
        }

        public async Task<bool> VerifyTokenAsync(ApplicationUser user, string token)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            var isVarified = await _userManager.VerifyUserTokenAsync(user, EmailTokenProvider, AccessTokenPurpose, token);

            return isVarified;
        }
    }
}
