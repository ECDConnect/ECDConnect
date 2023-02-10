using EcdLink.Api.CoreApi.Security.Models;
using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.Security;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.JwtSecurity.Factories;
using ECDLink.Security.JwtSecurity.Managers;
using ECDLink.Security.Managers;
using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class SecurityManager : IAuthenticationManager<ApplicationUser>
    {
        private readonly IPasswordManager<ApplicationUser> _passwordManager;
        private readonly IClaimsManager _claimsManager;
        private readonly SecurityNotificationManager _notificationManager;
        private readonly ShortUrlManager _shortUrlManager;
        protected AuthenticationDbContext _dbContext;

        public UserManager<ApplicationUser> _userManager { get; set; }

        public IJwtFactory _jwtFactory { get; set; }

        public JwtTokenManager _jwtTokenManager { get; set; }

        public SecurityManager(
          UserManager<ApplicationUser> userManager,
          IPasswordManager<ApplicationUser> passwordManager,
          IClaimsManager claimsManager,
          SecurityNotificationManager notificationManager,
          ShortUrlManager shortUrlManager,
          IJwtFactory factory,
          JwtTokenManager tokenManager)
        {
            _userManager = userManager;
            _passwordManager = passwordManager;
            _claimsManager = claimsManager;
            _notificationManager = notificationManager;
            _shortUrlManager = shortUrlManager;
            _jwtFactory = factory;
            _jwtTokenManager = tokenManager;
        }

        public async Task<ApplicationUser> LogInWithPhoneNumberAsync(string phoneNumber, string password)
        {
            var userToVerify = _userManager.Users.FirstOrDefault(user => string.Equals(user.PhoneNumber, phoneNumber));

            if (!await _passwordManager.IsPasswordValidAsync(userToVerify, password))
            {
                return default(ApplicationUser);
            }

            return userToVerify;
        }

        public async Task<ApplicationUser> LogInWithUsernameAsync(string username, string password)
        {
            // get the user to verifty
            var userToVerify = _userManager.Users.FirstOrDefault(user => string.Equals(user.UserName, username));

            if (!await _passwordManager.IsPasswordValidAsync(userToVerify, password))
            {
                return default(ApplicationUser);
            }

            return userToVerify;
        }

        public async Task<ApplicationUser> GetUserByNameAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return default;
            }

            return await _userManager.FindByNameAsync(username);
        }

        public async Task<bool> ResetPasswordAsync(ApplicationUser user)
        {
            var resetToken = await _passwordManager.RequestPasswordResetTokenAsync(user);

            if (string.IsNullOrEmpty(resetToken))
            {
                return false;
            }

            await _notificationManager.SendForgotPasswordMessageAsync(user, resetToken);

            return true;
        }

        public async Task<string> GenerateJwtForUserAsync(ApplicationUser user, JwtEncoderEnum jwtType)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claimIdentity = _claimsManager.GenerateClaimsIdentity(
                    user.Id,
                    new Claim(SecurityConstants.Strings.JwtClaimIdentifiers.Id, user.Id),
                    new Claim(SecurityConstants.Strings.JwtClaimIdentifiers.Rol, string.Join(',', roles))
                ); //TODO: CB Remove ROL again when portal login errors have been resolved
            //Remove the Rol and tenantId and add to table and obfuscate     
            var jwt = await _jwtTokenManager.GenerateJwt(claimIdentity, user.Id, jwtType);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            await ObfuscateJwtToken(jwtObj.auth_token, jwtObj.expires_in, user.Id, string.Join(',', roles));

            return jwt;
        }

        public async Task<bool> ConfirmPasswordReset(ApplicationUser user, string token, string password)
        {
            var result = await _passwordManager.ConfirmPasswordResetAsync(user, token, password);

            if (string.IsNullOrWhiteSpace(result))
            {
                return false;
            }

            _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.ForgotPassword);

            return true;
        }

        public async Task<string> RefreshJwtToken(string token)
        {
            if (!await _jwtTokenManager.CanRefreshToken(token))
            {
                return string.Empty;
            }

            if (!_jwtTokenManager.GetValidUserWithToken(token, out var user))
            {
                return string.Empty;
            }

            return await GenerateJwtForUserAsync(user as ApplicationUser, JwtEncoderEnum.Standard);
        }

        public async Task<JWTUserTokensEntityReturn> ObfuscateJwtToken(string auth_token, string expiresIn, string contextIdentifier, string role)
        {
            return await _jwtTokenManager.StoreJWTToken(auth_token, expiresIn, contextIdentifier, role);

        }
    }
}
