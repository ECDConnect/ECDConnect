using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Abstractrions.Constants;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Api.Constants;
using ECDLink.Security.Extensions;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.Managers;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
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
        private readonly InvitationNotificationManager _invitationNotificationManager;
        private readonly SecurityManager _securityManager;
        private readonly ApplicationUserManager _userManager;
        private readonly PersonnelService _personnelService;

        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;
        private IGenericRepository<MessageLog, Guid> _messageRepo;

        public InvitationController(
          ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          ITokenManager<ApplicationUser, SecurityCodeTokenManager> securityCodeManager,
          ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
          IPasswordManager<ApplicationUser> passwordManager,
          ShortUrlManager shortUrlManager,
          SecurityNotificationManager notificationManager,
          InvitationNotificationManager invitationNotificationManager,
          SecurityManager securityManager,
          ApplicationUserManager userManager,
          PersonnelService personnelService,
          IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory,
          HierarchyEngine hierarchyEngine)
        {
            _invitationManager = invitationManager;
            _securityCodeManager = securityCodeManager;
            _passwordManager = passwordManager;
            _shortUrlManager = shortUrlManager;
            _notificationManager = notificationManager;
            _invitationNotificationManager = invitationNotificationManager;
            _securityManager = securityManager;
            _userManager = userManager;
            _personnelService = personnelService;
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _messageRepo = _repoFactory.CreateGenericRepository<MessageLog>(userContext: _applicationUserId);
        }

        [Route("accept-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AcceptInvitation([FromBody] AcceptInvitationModel invitationModel)
        {
            var decodedToken = TokenHelper.DecodeToken(invitationModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(invitationModel.Username, decodedToken);

            if (user == null)
            {
                return BadRequest();
            }

            if (!await _passwordManager.IsPasswordSecureAsync(user, invitationModel.Password))
            {
                return BadRequest();
            }

            if (string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                await _passwordManager.AddPasswordAsync(user, invitationModel.Password);
            } else
            {
                await _securityManager.ChangePasswordAsync(user, invitationModel.Password);
            }

            await _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.Invitation);

            return Ok();
        }

        [Route("accept-admin-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AcceptAdminInvitation([FromBody] AcceptInvitationModel invitationModel)
        {
            var decodedToken = TokenHelper.DecodeToken(invitationModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(invitationModel.Username, decodedToken);

            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            if (!await _passwordManager.IsPasswordSecureAsync(user, invitationModel.Password))
            {
                return BadRequest();
            }

            await _passwordManager.AddPasswordAsync(user, invitationModel.Password);

            var userIsAdmin = await _userManager.IsInRoleAsync(user, Roles.ADMINISTRATOR);
            if (userIsAdmin)
            {
                await _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.AdminPortalInvitation);
                return Ok(true);
            }

            return Ok(false);
        }

        [Route("verify-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyInvitation([FromBody] VerifyInvitationModel verifyModel)
        {
            if (string.IsNullOrWhiteSpace(verifyModel.Username) || 
                string.IsNullOrWhiteSpace(verifyModel.Token))
            {
                return BadRequest(new FailedVerificationModel 
                { 
                    ErrorCode = 0, 
                    Error = "Invalid request" 
                });
            }

            Guid? inviteUserId = await _shortUrlManager.GetUserIdForInviteToken(verifyModel.Token);
            if (!inviteUserId.HasValue)
            {
                return BadRequest(new FailedVerificationModel 
                { 
                    ErrorCode = 3,   // Token invalid/expired/inactive
                    Error = "Invalid or expired token" 
                });
            }
            var tokenUser = await _userManager.FindByIdAsync(inviteUserId);

            var decodedToken = TokenHelper.DecodeToken(verifyModel.Token);
            var user = await _invitationManager.GetValidUserWithTokenAsync(verifyModel.Username, decodedToken);

            if (user == null && tokenUser != null)
            {
                // Username does not match the token owner
                return BadRequest(new FailedVerificationModel 
                { 
                    ErrorCode = 4, 
                    Error = "Username does not match invitation" 
                });
            }

            // At this point, username is correct and token is valid for this user
            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(verifyModel.PhoneNumber);

            if (!string.Equals(normalizePhoneNumber, user.PhoneNumber, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new FailedVerificationModel 
                { 
                    ErrorCode = 2, 
                    Error = "Invalid Phone Number" 
                });
            }

            if (!string.Equals(verifyModel.Username, user.UserName))
            {
                return BadRequest(new FailedVerificationModel 
                { 
                    ErrorCode = 1, 
                    Error = "Invalid Idnumber"
                });
            }

            return Ok(new { UserId = tokenUser.Id });
        }

        [Route("send-auth-code")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SendAuthenticationCode([FromBody] AuthCodeModel authModel)
        {
            var decodedToken = TokenHelper.DecodeToken(authModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(authModel.Username, decodedToken);

            if (user == null)
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

            return new OkObjectResult(result);
        }

        [Route("send-oa-wl-auth-code")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SendOAWLAuthenticationCode([FromBody] AuthCodeModel authModel)
        {
            if (string.IsNullOrEmpty(authModel.Username))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Username is null or empty"
                });
            }

            var user = await _userManager.FindByNameAsync(authModel.Username);
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "User not found with username"
                });
            }

            if (!await ((SecurityCodeTokenManager)_securityCodeManager).CanSendAuthCodeAsync(user))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Cannot send auth code"
                });
            }

            var token = await _securityCodeManager.GenerateTokenAsync(user);
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 4,
                    Error = "Generation of token failed"
                });
            }

            if (!string.IsNullOrEmpty(authModel.PhoneNumber) && user.PhoneNumber != authModel.PhoneNumber)
            {
                var userPhoneNumberBeforeChange = user.PhoneNumber;
                user.PhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PhoneNumber, authModel.PhoneNumber));
                user.PendingPhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PendingPhoneNumber, authModel.PhoneNumber)); ;
                user.PhoneNumberConfirmed = false;
                var updatedUser = await _userManager.UpdateAsync(user);
                if (updatedUser.Succeeded)
                {
                    await _notificationManager.SendOAWLAuthenticationCodeAsync(user, token);
                }
                // revert phone number to old one
                await Task.Delay(1000);
                user.PhoneNumber = userPhoneNumberBeforeChange;
                await _userManager.UpdateAsync(user);
            } 
            else
            {
                await _notificationManager.SendOAWLAuthenticationCodeAsync(user, token);
            }

            return Ok();
        }

        private static string replaceIfNotNullOrWhiteSpace(string original, string @new)
        {
            return string.IsNullOrWhiteSpace(@new) ? original : @new;
        }

        [Route("verify-oa-wl-auth-code")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyOAWLAuthCode([FromBody] VerifyInvitationModel verifyModel)
        {
            // the token is a 6 digit code
            var user = await _userManager.FindByNameAsync(verifyModel.Username);
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Invalid username"
                });
            }
            if (await _userManager.IsLockedOutAsync(user))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 5,
                    Error = "Account temporarily locked. Please request a new code."
                });
            }
            var tokenVerification = await _securityCodeManager.VerifyTokenAsync(user, verifyModel.Token);
            if (!tokenVerification)
            {
                await _userManager.AccessFailedAsync(user);
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Invalid token"
                });
            }
            await _userManager.ResetAccessFailedCountAsync(user);
            // archive message records linked to user's number
            var messages = _messageRepo.GetAll().Where(x => x.IsActive && (x.To == user.PhoneNumber || x.To == user.PendingPhoneNumber) 
                                                        && x.MessageTemplateType == TemplateTypeConstants.OAWLAuthCode).ToList();
            if (messages.Count != 0)
            {
                foreach (var message in messages)
                {
                    _messageRepo.Delete(message.Id);
                }
            }

            var isPractitionerUpdated = _personnelService.RegisterWLUser(user.Id);
            if (!isPractitionerUpdated)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Register of practitioner failure"
                });
            }

            // Update user, to save last login
            user.LastSeen = DateTime.Now;
            if (user.PendingPhoneNumber != null)
            {
                user.PhoneNumber = user.PendingPhoneNumber;
                user.PhoneNumberConfirmed = true;
                user.PendingPhoneNumber = null;
            }
            await _userManager.UpdateAsync(user);

            var jwt = await _securityManager.GenerateJwtForUserAsync(user, JwtEncoderEnum.Standard);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            var package = new OkObjectResult(jwtObj);
            return package;
        }

        [Route("verify-oa-wl-auth-code-status")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyOAWLAuthCodeStatus([FromBody] VerifyInvitationModel verifyModel)
        {
            var user = await _userManager.FindByNameAsync(verifyModel.Username);
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Invalid username"
                });
            }
            // If the user reaches the confirm auth code screen, but for some reason leaves the flow. And after that, the user tries to log in directly with the username,
            // we should check the auth code status. If it's not confirmed yet, we should redirect the user to the confirm auth code screen again.
            var latestMessage = _messageRepo.GetAll()
                .Where(x => (x.To == user.PendingPhoneNumber || x.To == user.PhoneNumber) && x.MessageTemplateType == TemplateTypeConstants.OAWLAuthCode)
                .OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            if (latestMessage != null)
            {
                return Ok(latestMessage.IsActive);
            }

            return Ok(false);
        }

        [Route("update-username-password")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> UpdateUsernamePassword([FromBody] UpdateUserNameModel input)
        {
            if (string.IsNullOrEmpty(input.UserId.ToString())) {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Missing userId"
                });
            }

            var user = await _userManager.FindByIdAsync(input.UserId);
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Invalid userId"
                });
            }

            // Let's validate the invite token
            var decodedToken = TokenHelper.DecodeToken(input.Token);
            var tokenUser = await _invitationManager.GetValidUserWithTokenAsync(user.UserName, decodedToken);

            if (tokenUser == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Invalid token"
                });
            }
            // Mark invitation as clicked
            await _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.Invitation);
            
            // Update user with new username
            user.UserName = input.UserName;
            user.UpdatedDate = DateTime.Now;
            user.RegisterType = string.IsNullOrEmpty(input.RegisterType) ? RegisterTypeConstants.USERNAME : input.RegisterType;
            var updateResult = _userManager.UpdateAsync(user).Result;
            if (!updateResult.Succeeded)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 4,
                    Error = "Update of username failure"
                });
            }

            // update Practitioner/Coach ShareInfo value
            var isUpdatedUser = _personnelService.UpdateWLUserShareInfo(user.Id, input.ShareInfo);
            if (!isUpdatedUser)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 5,
                    Error = "Update of ShareInfo failure"
                });
            }

            // Validate password for user
            if (!string.IsNullOrEmpty(input.Password))
            {
                var isPasswordSecure = _passwordManager.IsPasswordSecureAsync(user, input.Password).Result;

                if (!isPasswordSecure)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 6,
                        Error = "Validate password failure"
                    });
                }

                if (string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    var addPassword = await _passwordManager.AddPasswordAsync(user, input.Password);
                    if (!addPassword)
                    {
                        return BadRequest(new FailedVerificationModel
                        {
                            ErrorCode = 7,
                            Error = "Add password failure"
                        });
                    }
                }
                else
                {
                    var changedPassword = await _securityManager.ChangePasswordAsync(user, input.Password);
                    if (!changedPassword)
                    {
                        return BadRequest(new FailedVerificationModel
                        {
                            ErrorCode = 8,
                            Error = "Change password failure"
                        });
                    }
                }
            }

            return Ok();
        }

        [Route("verify-principal-token")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult VerifyPrincipalToken([FromBody] VerifyInvitationModel verifyModel)
        {
            var tokenModel = JsonConvert.DeserializeObject<PrincipalPractitionerTokenWrapperModel>(TokenHelper.DecodeToken(verifyModel.Token));

            return Ok(tokenModel);
        }

        [Route("send-new-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SendNewInvitation([FromBody] AuthCodeModel authModel)
        {
            var user = await _userManager.FindByNameAsync(authModel.Username);  

            if (user == null)
            {
                return BadRequest();
            }

            var token = await _invitationManager.GenerateTokenAsync(user);
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest();
            }

            await _invitationNotificationManager.SendInvitationAsync(user, token);

           return Ok();
        }
    }
}
