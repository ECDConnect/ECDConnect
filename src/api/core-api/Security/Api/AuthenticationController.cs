using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.Security.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly SecurityManager _securityManager;
        private readonly ApplicationUserManager _userManager;

        public AuthenticationController(SecurityManager securityManager, ApplicationUserManager userManager)
        {
            _securityManager = securityManager;
            _userManager = userManager; 
        }

        // POST api/auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Post(
            [FromServices] IHttpContextAccessor _httpContextAccessor,
            [FromServices] ApplicationUserManager _userManager,
            [FromBody] LoginRequestModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Console.WriteLine("Login: Username={0}, Referrer={1}, Origin={2}, TenantId={3}", login.Username, HttpContext.Request.Headers.Referer, HttpContext.Request.Headers.Origin, TenantExecutionContext.Tenant.Id);

            //exclude funny script attempts
            if ((login?.Password?.StartsWith('<') ?? true)
                || (login?.PhoneNumber?.StartsWith('<') ?? false)
                || (login?.Username?.StartsWith('<') ?? true))
            {
                return Unauthorized(new { Error = "Some of the information you have entered is incorrect. Please contact the SmartStart call centre to find out more: 0800 014 817" });
            }

            ApplicationUser user;
            if (!string.IsNullOrWhiteSpace(login.Username))
            {
                user = await _securityManager.LogInWithUsernameAsync(login.Username, login.Password);
            }
            else
            {
                var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(login.PhoneNumber);
                user = await _securityManager.LogInWithPhoneNumberAsync(normalizePhoneNumber, login.Password);
            }

            if (user == null)
            {
                return Unauthorized(new { Error = "Some of the information you have entered is incorrect. Please contact the SmartStart call centre to find out more: 0800 014 817" });
            }


            // Check if logging into admin portal and deny non "administrators" or "Coaches" access.
            var isAdminPortal = checkHostUrlForAdminPortal(
                TenantExecutionContext.Tenant.AdminSiteAddress,
                TenantExecutionContext.Tenant.AdminTestSiteAddress,
                _httpContextAccessor.HttpContext?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri ?? (_httpContextAccessor.HttpContext?.Request.Host.Value ?? String.Empty));

            var userRoles = await _userManager.GetRolesAsync(user);

            if (isAdminPortal)
            {   
                var hasAccess = userRoles.Contains(Roles.ADMINISTRATOR) || userRoles.Contains(Roles.COACH);
                if (!hasAccess)
                {
                    var organisationName = TenantExecutionContext.Tenant.OrganisationName;
                    // TODO: Callcenter number should be in the tenant config?
                    return Unauthorized(new { Error = $"You do not have permission to access this portal. Please contact the {organisationName} call centre to find out more: 0800 014 817" });
                }
            } else
            {
                if (!userRoles.Any())
                {
                    return Unauthorized(new { Error = "You do not have access. Please contact the SmartStart call centre to find out more: 0800 014 817" });
                }
            }

            // Update user, to save last login
            user.LastSeen = DateTime.Now;
            await _userManager.UpdateAsync(user);

            var jwt = await _securityManager.GenerateJwtForUserAsync(user, JwtEncoderEnum.Standard);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            var package = new OkObjectResult(jwtObj);
            return package;
        }

        private bool checkHostUrlForAdminPortal(string adminSiteAddress, string testAdminSiteAddress, string hostAddress)
        {
#if DEBUG
            return hostAddress.StartsWith(adminSiteAddress) || hostAddress.StartsWith(testAdminSiteAddress);
#endif
            return hostAddress.StartsWith(adminSiteAddress) || hostAddress.StartsWith(testAdminSiteAddress);
        }

        // This API should always return an OK result as to not give away emails
        [AllowAnonymous]
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] SimpleUserModel model)
        {
            var userIdentifier = model?.Username ?? model?.Email;
            if (string.IsNullOrWhiteSpace(userIdentifier))
            {
                return BadRequest("No username specified for Password Reset");
            }

            // Use username first, if provided, otherwise use email
            var user = string.IsNullOrEmpty(model.Username)
                ? await _securityManager.GetUserByEmailAsync(model.Email)
                : await _securityManager.GetUserByNameAsync(model.Username);

            var tenant = TenantExecutionContext.Tenant;
            var tenantId = tenant.Id;

            if (user is null || user?.TenantId.Value != tenantId)
            {
                return BadRequest("Could not reset password");
            }

            var sites = new List<string> { tenant.AdminSiteAddress, tenant.AdminTestSiteAddress };
            var originHost = new Uri(Request.Headers.Origin);
            var isPortal = sites.Contains($"{originHost.Host}:{originHost.Port}") || sites.Contains(originHost.Host);

            var result = await _securityManager.ForgotPasswordAsync(user, isPortal);

            if (!result)
            {
                return BadRequest("Could not reset password");
            }

            var returnValue = ApplicationUserHelper.GetObscureMessagePrefenceValue(user);

            return Ok(new { phoneNumber = returnValue });
        }

        [Route("confirm-forgot-password")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordConfirmation([FromBody] PasswordResetModel resetModel)
        {
            var user = await _securityManager.GetUserByNameAsync(resetModel.Username);

            if (user == default(ApplicationUser))
            {
                return BadRequest();
            }

            var result = await _securityManager.ConfirmPasswordReset(user, TokenHelper.DecodeToken(resetModel.ResetToken), resetModel.Password);

            if (!result)
            {
                return BadRequest();
            }

            return new OkObjectResult(user.PhoneNumber);
        }

        [Route("refresh-token/{authorization}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> RefreshJwtToken([FromRoute] string authorization)
        {

            if (string.IsNullOrWhiteSpace(authorization))
            {
                return BadRequest();
            }

            // scheme will be "Bearer"
            // parmameter will be the token itself.

            var result = await _securityManager.RefreshJwtToken(authorization);

            return new OkObjectResult(result);
        }

        //[Route("online-check")]
        //[AllowAnonymous]
        //[HttpGet]
        //public async ValueTask<IActionResult> OnlineCheckAsync()
        //{
        //    return Ok();
        //}

        [Route("verify-email-address")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> VerifyEmailAddress([FromQuery] VerifyEmailAddressModel verifyEmailModel)
        {
            var user = await _securityManager.GetUserByNameAsync(verifyEmailModel.Username);
            var token = TokenHelper.DecodeToken(verifyEmailModel.Token);

            if (user == default(ApplicationUser))
            {
                return BadRequest();
            }

            //RequestVerifyEmailAsync
            var changeResult = await _securityManager.ChangeEmailAddressAsync(user, token);
            if (changeResult == true)
                return new OkObjectResult(user.PendingEmail);

            return Ok(changeResult);
        }

        [Route("verify-cellphone-number")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyCellphoneNumber([FromBody] VerifyCellphoneNumberModel verifyCellphoneNumberModel)
        {
            var user = await _securityManager.GetUserByNameAsync(verifyCellphoneNumberModel.Username);
            var token = TokenHelper.DecodeToken(verifyCellphoneNumberModel.Token);
            var currentPhoneNumber = user.PhoneNumber;

            if (user == default(ApplicationUser))
            {
                return BadRequest();
            } 
            
            user.PhoneNumber = user.PendingPhoneNumber;
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                var changeResult = await _securityManager.ChangeCellphoneNumberAsync(user, token);
                if (changeResult)
                {
                    return new OkObjectResult(user.PendingPhoneNumber);
                }
                else
                {
                    // change number back to previous one if the token fails
                    user.PhoneNumber = currentPhoneNumber;
                    await _userManager.UpdateAsync(user);
                }
                return Ok(result);
            }

            return Ok(result);
        }

    }
}
