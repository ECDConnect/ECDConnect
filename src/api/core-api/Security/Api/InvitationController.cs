using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Security.Helpers;
using ECDLink.Security.Managers;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
          IPasswordManager<ApplicationUser> passwordManager,
          ShortUrlManager shortUrlManager,
          SecurityNotificationManager notificationManager,
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
                _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.AdminPortalInvitation);
                return Ok(true);
            }

            return Ok(false);
        }

        [Route("accept-team-lead-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AcceptTeamLeadInvitation([FromBody] AcceptInvitationModel invitationModel)
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

            var userIsTL = await _userManager.IsInRoleAsync(user, RolesGG.TEAM_LEAD);
            if (userIsTL)
            {
                _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.TeamLeadInvitation);
                _personnelService.RegisterTeamLead(user.Id);
                return Ok(true);
            }

            return Ok(false);
        }

        [Route("verify-invitation")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyInvitation([FromBody] VerifyInvitationModel verifyModel)
        {
            var decodedToken = TokenHelper.DecodeToken(verifyModel.Token);

            var user = await _invitationManager.GetValidUserWithTokenAsync(verifyModel.Username, decodedToken);

            if (user == null)
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

            return new OkObjectResult(ApplicationUserHelper.GetObscureMessagePrefenceValue(user));
        }

        [Route("send-oa-auth-code")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SendOAAuthenticationCode([FromBody] AuthCodeModel authModel)
        {
            var user = await _userManager.FindByNameAsync(authModel.Username);
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "User not found with username"
                });
            }

            if (!await ((SecurityCodeTokenManager)_securityCodeManager).CanSendAuthCodeAsync(user))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Cannot send auth code"
                });
            }

            var result = await _securityCodeManager.GenerateTokenAsync(user);
            if (string.IsNullOrWhiteSpace(result))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Generation of token failed"
                });
            }

            await _notificationManager.SendOpenAccessAuthenticationCodeAsync(user, result);

            return new OkObjectResult(result);
        }

        [Route("verify-oa-auth-code")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyOAAuthCode([FromBody] VerifyInvitationModel verifyModel)
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
            var tokenVerification = await _securityCodeManager.VerifyTokenAsync(user, verifyModel.Token);
            if (!tokenVerification)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Invalid token"
                });
            }
            // archive message records linked to user's number
            var messages = _messageRepo.GetAll().Where(x => x.IsActive && x.To == user.PhoneNumber).ToList();
            if (messages.Count != 0)
            {
                foreach (var message in messages)
                {
                    message.IsActive = false;
                    message.UpdatedDate = DateTime.Now;
                    message.UpdatedBy = _applicationUserId.ToString();
                    _messageRepo.Update(message);
                }
            }

            var updatedPractitioner = _personnelService.RegisterPractitioner(user.UserName);
            if (updatedPractitioner == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Register of practitioner failure"
                });
            }
            return Ok(true);
        }

        [Route("verify-oa-auth-code-status")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyOAAuthCodeStatus([FromBody] VerifyInvitationModel verifyModel)
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

            var messages = _messageRepo.GetAll().Where(x => x.IsActive && x.To == user.PhoneNumber).ToList();
            if (messages.Count == 0)
            {
                return Ok(true);
            } else
            {
                return Ok(false);
            }
        }

        [Route("update-username-password")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> UpdateUsernamePassword([FromBody] UpdateUserNameModel input)
        {

            // Validate to see if user exists
            var user = _userManager.FindByIdAsync(input.UserId).Result;
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "No user with for userId"
                });
            }

            // Let's validate the invite token
            var decodedToken = TokenHelper.DecodeToken(input.Token);
            var tokenUser = await _invitationManager.GetValidUserWithTokenAsync(user.UserName, decodedToken);

            if (tokenUser == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Invalid token"
                });
            }
            // Mark invitation as clicked
            _shortUrlManager.RemoveShortUrl(user.Id, TemplateTypeConstants.Invitation);
            
            // Update user with new username
            user.UserName = input.UserName;
            user.UpdatedDate = DateTime.Now;
            var updateResult = _userManager.UpdateAsync(user).Result;
            if (!updateResult.Succeeded)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Update of username failure"
                });
            }

            // update Practitioner ShareInfo value
            var updatePractitioner = _personnelService.UpdatePractitionerShareInfo(user.Id, input.ShareInfo);
            if (updatePractitioner == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 4,
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
                        ErrorCode = 5,
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
                            ErrorCode = 6,
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
                            ErrorCode = 7,
                            Error = "Change password failure"
                        });
                    }
                }
            }

            return Ok();
        }

    }
}
