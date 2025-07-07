using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Managers;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class PasswordManager : IPasswordManager<ApplicationUser>
    {
        private readonly ApplicationUserManager _userManager;

        public PasswordManager(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> RequestPasswordResetTokenAsync(ApplicationUser user)
        {
            if (user == default(ApplicationUser))
            {
                return string.Empty;
            }

            var confirmationToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            return confirmationToken;
        }

        public async Task<bool> AddPasswordAsync(ApplicationUser user, string password)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            var result = await _userManager.AddPasswordAsync(user, password);

            return result.Succeeded;
        }

        public async Task<string> ConfirmPasswordResetAsync(ApplicationUser user, string token, string password)
        {
            if (user == default(ApplicationUser))
            {
                return string.Empty;
            }

            if (!await IsPasswordSecureAsync(user, password))
            {
                return string.Empty;
            }

            var result = await _userManager.ResetPasswordAsync(user, token, password);

            if (!result.Succeeded)
            {
                return string.Empty;
            }

            return user.PhoneNumber ?? user.Email;
        }

        public async Task<bool> IsPasswordSecureAsync(ApplicationUser user, string password)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            // check the credentials
            var passwordValidator = new PasswordValidator<ApplicationUser>();

            var result = await passwordValidator.ValidateAsync(_userManager, user, password);

            return result.Succeeded;
        }

        public async Task<bool> IsPasswordValidAsync(ApplicationUser user, string password)
        {
            if (user == default(ApplicationUser))
            {
                return false;
            }

            // check the credentials
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task<bool> IsResetTokenValidAsync(ApplicationUser user, string token)
        {
            return await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "PasswordReset", token);
        }
    }
}
