using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;
using ECDLink.Security.Managers;
using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ECDLink.Security.Api
{
    [Route("api/invitation")]
    [ApiController]
    public class InvitationController : ControllerBase
    {
        private readonly ITokenManager<ApplicationUser, InvitationTokenManager> _invitationManager;
        private readonly ITokenManager<ApplicationUser, SecurityCodeTokenManager> _securityCodeManager;
        private readonly IPasswordManager<ApplicationUser> _passwordManager;
        private readonly ShortUrlManager _shortUrlManager;
        private readonly SecurityNotificationManager _notificationManager;

        public InvitationController(
          ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          ITokenManager<ApplicationUser, SecurityCodeTokenManager> securityCodeManager,
          IPasswordManager<ApplicationUser> passwordManager,
          ShortUrlManager shortUrlManager,
          SecurityNotificationManager notificationManager)
        {
            _invitationManager = invitationManager;
            _securityCodeManager = securityCodeManager;
            _passwordManager = passwordManager;
            _shortUrlManager = shortUrlManager;
            _notificationManager = notificationManager;
        }

        [Route("accept-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AcceptInvitation([FromBody] AcceptInvitationModel invitationModel)
        {
            var decodedToken = TokenHelper.DecodeToken(invitationModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(invitationModel.Username, decodedToken);

            if (user == default(ApplicationUser))
            {
                return BadRequest();
            }

            if (!await _passwordManager.IsPasswordSecureAsync(user, invitationModel.Password))
            {
                return BadRequest();
            }

            await _passwordManager.AddPasswordAsync(user, invitationModel.Password);

            _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.Invitation);

            return Ok();
        }

        [Route("accept-admin-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AcceptAdminInvitation([FromBody] AcceptInvitationModel invitationModel)
        {
            var decodedToken = TokenHelper.DecodeToken(invitationModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(invitationModel.Username, decodedToken);

            if (user == default(ApplicationUser))
            {
                return BadRequest("Invalid token");
            }

            if (!await _passwordManager.IsPasswordSecureAsync(user, invitationModel.Password))
            {
                return BadRequest();
            }

            await _passwordManager.AddPasswordAsync(user, invitationModel.Password);

            _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.Invitation);

            return Ok(true);
        }

        [Route("verify-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyInvitation([FromBody] VerifyInvitationModel verifyModel)
        {
            var decodedToken = TokenHelper.DecodeToken(verifyModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(verifyModel.Username, decodedToken);

            if (user == default(ApplicationUser))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Invalid Id Number"
                });
            }

            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(verifyModel.PhoneNumber);

            if (!string.Equals(normalizePhoneNumber, user.PhoneNumber))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Invalid Phone Number"
                });
            }

            return Ok();
        }

        [Route("send-auth-code")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SendAuthenticationCode([FromBody] AuthCodeModel authModel)
        {
            var decodedToken = TokenHelper.DecodeToken(authModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(authModel.Username, decodedToken);

            if (user == default(ApplicationUser))
            {
                return BadRequest();
            }

            if (!await ((SecurityCodeTokenManager)_securityCodeManager).CanSendAuthCodeAsync(user))
            {
                return BadRequest();
            }

            var result = await _securityCodeManager.GenerateTokenAsync(user);

            if (string.IsNullOrWhiteSpace(result))
            {
                return BadRequest();
            }

            await _notificationManager.SendAuthenticationCodeAsync(user, result);

            return new OkObjectResult(ApplicationUserHelper.GetObscureMessagePrefenceValue(user));
        }
    }
}
