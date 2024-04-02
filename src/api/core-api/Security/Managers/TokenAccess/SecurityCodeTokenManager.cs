using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Managers;
using ECDLink.Security.Providers;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers.TokenAccess
{
    public class SecurityCodeTokenManager : ITokenManager<ApplicationUser, SecurityCodeTokenManager>
    {
        private readonly ApplicationUserManager _userManager;

        private string AuthTokenProvider
        {
            get
            {
                return _userManager.Options.Tokens.ChangePhoneNumberTokenProvider;
            }
        }

        public SecurityCodeTokenManager(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> GenerateTokenAsync(ApplicationUser user)
        {
            if (user == default(ApplicationUser))
            {
                return string.Empty;
            }

            // Generate the token and send it
            var code = await _userManager.GenerateTwoFactorTokenAsync(user, AuthTokenProvider);

            return code;
        }

        public async Task<ApplicationUser> GetValidUserWithTokenAsync(string userId, string token)
        {
            var user = await _userManager.FindByNameAsync(userId);

            if (user == null)
            {
                return default(ApplicationUser);
            }

            var result = await _userManager.VerifyTwoFactorTokenAsync(user, AuthTokenProvider, token);

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

            var result = await _userManager.RemoveAuthenticationTokenAsync(user, AuthTokenProvider, ProviderKeys.Tokens.PHONE_NUMBER);

            if (!result.Succeeded)
            {
                return string.Empty;
            }

            return await GenerateTokenAsync(user);
        }

        public async Task<bool> CanSendAuthCodeAsync(ApplicationUser user)
        {
            // TODO: Add counter on user to track number of codes sent

            // Add new field to indicate user is onboarded successfully and accepted invitation
            if (await _userManager.IsEmailConfirmedAsync(user))
            {
                return false;
            }

            return true;
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

            var isVarified = await _userManager.VerifyTwoFactorTokenAsync(user, AuthTokenProvider, token);

            return isVarified;
        }
    }
}
