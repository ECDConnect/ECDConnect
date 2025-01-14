using EcdLink.Api.CoreApi.Security.Models;
using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.Security;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.JwtSecurity.Factories;
using ECDLink.Security.JwtSecurity.Managers;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
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

        private AuthenticationDbContext _dbContext;
        public ApplicationUserManager _userManager { get; set; }

        public IJwtFactory _jwtFactory { get; set; }

        public JwtTokenManager _jwtTokenManager { get; set; }

        public SecurityManager(
          ApplicationUserManager userManager,
          IPasswordManager<ApplicationUser> passwordManager,
          IClaimsManager claimsManager,
          SecurityNotificationManager notificationManager,
          ShortUrlManager shortUrlManager,
          IJwtFactory factory,
          JwtTokenManager tokenManager,
          AuthenticationDbContext dbContext)
        {
            _userManager = userManager;
            _passwordManager = passwordManager;
            _claimsManager = claimsManager;
            _notificationManager = notificationManager;
            _shortUrlManager = shortUrlManager;
            _jwtFactory = factory;
            _jwtTokenManager = tokenManager;
            _dbContext = dbContext;
        }

        public async Task<ApplicationUser> LogInWithPhoneNumberAsync(string phoneNumber, string password)
        {
            var userToVerify = _userManager.Users.FirstOrDefault(user => user.PhoneNumber == phoneNumber
                                && (user.TenantId == TenantExecutionContext.Tenant.Id || user.TenantId == null));

            if (!await _passwordManager.IsPasswordValidAsync(userToVerify, password))
            {
                return default(ApplicationUser);
            }

            if (userToVerify.TenantId != TenantExecutionContext.Tenant.Id && userToVerify.TenantId != null)
            {
                return default(ApplicationUser);
            }

            return userToVerify;
        }

        public async Task<ApplicationUser> GetUsernameAsync(string username, string password)
        {
            // get the user to verifty
            var userToVerify = _dbContext.Users.FirstOrDefault(user => string.Equals(user.UserName, username));

            userToVerify ??= _userManager.Users.FirstOrDefault(user => user.Email == username);

            if (!await _passwordManager.IsPasswordValidAsync(userToVerify, password))
            {
                return default(ApplicationUser);
            }
            
            return userToVerify;
        }


        public async Task<ApplicationUser> LogInWithUsernameAsync(string username, string password)
        {
            // get the user to verify
            var userToVerify = _userManager.Users.FirstOrDefault(user => string.Equals(user.UserName, username)
                    && (user.TenantId == TenantExecutionContext.Tenant.Id || user.TenantId == null));

            if (userToVerify == null)
            {
                userToVerify = _userManager.Users.FirstOrDefault(user => user.Email == username
                    && (user.TenantId == TenantExecutionContext.Tenant.Id || user.TenantId == null));
            }

            if (userToVerify == null)
            {
                return null;
            }

            if (!await _passwordManager.IsPasswordValidAsync(userToVerify, password))
            {
                return default(ApplicationUser);
            }

            if (userToVerify.TenantId != TenantExecutionContext.Tenant.Id && userToVerify.TenantId != null)
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

        public async Task<ApplicationUser> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return default;
            }
            var tenantId = TenantExecutionContext.Tenant.Id;
            // TODO: Make the user email and tenantId unique
            var firstUserWithThatEmail = await _userManager.Users.FirstOrDefaultAsync(
                user => user.IsActive == true
                    && user.Email == email
                    && user.TenantId == tenantId);
            return firstUserWithThatEmail;
        }

        public async Task<ApplicationUser> GetUserByPhoneNumberAsync(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return default;
            }
            var tenantId = TenantExecutionContext.Tenant.Id;
            var user = await _userManager.Users.FirstOrDefaultAsync(
                user => user.IsActive == true
                    && user.PhoneNumber == phoneNumber
                    && user.TenantId == tenantId);
            return user;
        }

        public async Task<bool> ForgotPasswordAsync(ApplicationUser user, bool isPortal = false)
        {
            var resetToken = await _passwordManager.RequestPasswordResetTokenAsync(user);

            if (string.IsNullOrEmpty(resetToken))
            {
                return false;
            }

            if (isPortal)
            {
                await _notificationManager.SendPortalForgotPasswordMessageAsync(user, resetToken);
            }
            else
            {
                await _notificationManager.SendForgotPasswordMessageAsync(user, resetToken);
            }
            return true;
        }

        public async Task<bool> ChangePasswordAsync(ApplicationUser user, string newPassword)
        {
            var passwordToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var updatedPassword = await _userManager.ResetPasswordAsync(user, passwordToken, newPassword);

            if (!updatedPassword.Succeeded)
            {
                throw new Exception("Unable to update password");
            }

            return updatedPassword.Succeeded;
        }

        public async Task<string> GenerateJwtForUserAsync(ApplicationUser user, JwtEncoderEnum jwtType)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claimIdentity = _claimsManager.GenerateClaimsIdentity(
                    user.Id.ToString(),
                    new Claim(SecurityConstants.Strings.JwtClaimIdentifiers.Id, user.Id.ToString()),
                    new Claim(SecurityConstants.Strings.JwtClaimIdentifiers.Rol, string.Join(',', roles))
                );
            var jwt = await _jwtTokenManager.GenerateJwt(claimIdentity, user.Id.ToString(), jwtType, user.ResetData);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            await ObfuscateJwtToken(jwtObj.auth_token, jwtObj.expires_in, user.Id.ToString(), string.Join(',', roles));

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

            if (!_jwtTokenManager.GetValidUserWithToken(token, false, out var user))
            {
                return string.Empty;
            }

            return await GenerateJwtForUserAsync(user as ApplicationUser, JwtEncoderEnum.Standard);
        }

        public async Task<JWTUserTokensEntityReturn> ObfuscateJwtToken(string auth_token, string expiresIn, string contextIdentifier, string role)
        {
            return await _jwtTokenManager.StoreJWTToken(auth_token, expiresIn, contextIdentifier, role);

        }

        public async Task<bool> ChangeEmailAddressAsync(ApplicationUser user, string token)
        {
            // no user, no email or email is same
            if (user is null || string.IsNullOrWhiteSpace(user.PendingEmail) || user.Email == user.PendingEmail)
                return false;

            // email address in already in use and confirmed (else emails could be denied by registering and abandoning)
            var emailAlreadyInUse = await _userManager.FindByEmailAsync(user.PendingEmail) is not null;
            if (emailAlreadyInUse)
                return false;

            var emailChangeRequest = await _userManager.ChangeEmailAsync(user, user.PendingEmail, token);

            if (emailChangeRequest.Succeeded)
            {
                user.PendingEmail = "";
                await _userManager.UpdateAsync(user);
            }

            return emailChangeRequest.Succeeded;
        }

        public async Task<bool> ConfirmEmailAsync(ApplicationUser user, string token)
        {
            var verified = await _userManager.ConfirmEmailAsync(user, token) == IdentityResult.Success;

            return verified;
        }

        public async Task<bool> ChangeCellphoneNumberAsync(ApplicationUser user, string token)
        {
            // Ensure we have a user and pending phone number
            if (user is null || string.IsNullOrWhiteSpace(user.PendingPhoneNumber))
                return false;

            var cellphoneNumberChangeRequest = await _userManager.ChangePhoneNumberAsync(user, user.PendingPhoneNumber, token);

            if (cellphoneNumberChangeRequest.Succeeded)
            {
                user.PendingPhoneNumber = "";
                user.PhoneNumberConfirmed = true;
                await _userManager.UpdateAsync(user);
                _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.VerifyCellphoneNumber);
            }

            return cellphoneNumberChangeRequest.Succeeded;
        }

    }
}
