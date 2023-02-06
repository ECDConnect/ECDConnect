using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace ECDLink.Security.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly SecurityManager _securityManager;

        public AuthenticationController(SecurityManager securityManager)
        {
            _securityManager = securityManager;
        }

        // POST api/auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Post([FromBody] LoginRequestModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (login.Password.StartsWith('<') || (login.PhoneNumber != null ? login.PhoneNumber.StartsWith('<') : login.Username.StartsWith('<'))) //exclude funny script attempts
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

            var jwt = await _securityManager.GenerateJwtForUserAsync(user, JwtEncoderEnum.Standard);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            var package = new OkObjectResult(jwtObj);
            return package;
        }

        // This API should always return an OK result as to not give away emails
        [AllowAnonymous]
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] SimpleUserModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Username))
            {
                return BadRequest("No username specified for Password Reset");
            }

            var user = await _securityManager.GetUserByNameAsync(model.Username);

            var result = await _securityManager.ResetPasswordAsync(user);

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
    }
}
