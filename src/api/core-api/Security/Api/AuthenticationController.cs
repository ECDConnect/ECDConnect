using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Abstractrions.Constants;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
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
using ECDLink.Security.SSO.Google.Configuration;
using ECDLink.Tenancy.Context;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Flows;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static EcdLink.Api.CoreApi.Constants;

namespace ECDLink.Security.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ITokenManager<ApplicationUser, SecurityCodeTokenManager> _securityCodeManager;

        private readonly SecurityManager _securityManager;
        private readonly ApplicationUserManager _userManager;
        private readonly SecurityNotificationManager _notificationManager;
        private readonly IPasswordManager<ApplicationUser> _passwordManager;
        private readonly PersonnelService _personnelService;
        private readonly AuthenticationDbContext _dbContext;
        private readonly Guid _applicationUserId;
        private readonly IGenericRepository<UserHelp, Guid> _userHelpRepo;

        private readonly IGenericRepository<Invite, Guid> _inviteRepo;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly AuthenticationGoogleConfig _googleConfig;
        private readonly AuthenticationFacebookConfig _facebookConfig;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(
            SignInManager<ApplicationUser> signInManager,
            ITokenManager<ApplicationUser, SecurityCodeTokenManager> securityCodeManager,
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            SecurityManager securityManager,
            ApplicationUserManager userManager,
            IPasswordManager<ApplicationUser> passwordManager,
            SecurityNotificationManager notificationManager,
            PersonnelService personnelService,
            HierarchyEngine hierarchyEngine,
            AuthenticationDbContext dbContext,
            IServiceScopeFactory serviceScopeFactory,
            IOptions<AuthenticationGoogleConfig> googleConfig,
            IOptions<AuthenticationFacebookConfig> facebookConfig,
            ILogger<AuthenticationController> logger)
        {
            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _userHelpRepo = repoFactory.CreateGenericRepository<UserHelp>(userContext: _applicationUserId);
            _inviteRepo = repoFactory.CreateGenericRepository<Invite>(userContext: _applicationUserId);

            _securityManager = securityManager;
            _userManager = userManager;
            _passwordManager = passwordManager;
            _personnelService = personnelService;
            _notificationManager = notificationManager;
            _securityCodeManager = securityCodeManager;
            _dbContext = dbContext;
            _serviceScopeFactory = serviceScopeFactory;
            _googleConfig = googleConfig.Value;
            _facebookConfig = facebookConfig.Value;
            _logger = logger;
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

            var tenantData = TenantExecutionContext.Tenant;
            if (tenantData.IsHost)
            {
                return LoginUnauthorizedResult();
            }

            //exclude funny script attempts
            if ((login?.Password?.StartsWith('<') ?? true)
                || (login?.PhoneNumber?.StartsWith('<') ?? false)
                || (login?.Username?.StartsWith('<') ?? true))
            {
                return LoginUnauthorizedResult();
            }

            bool isFacebookAccount = !string.IsNullOrEmpty(login.FacebookToken);

            if (isFacebookAccount)
            {
                var result = await ValidateFacebookLogin(login.Username, login.FacebookToken);
                if (result.Unauthorized != null) return result.Unauthorized;
                login.Username = result.UserId;
            }

            bool isGoogleAccount = !string.IsNullOrEmpty(login.GoogleToken) || !string.IsNullOrEmpty(login.GoogleCode);
            if (isGoogleAccount)
            {
                var result = await ValidateGoogleLogin(login.Username, login.GoogleToken, login.GoogleCode);
                if (result.Unauthorized != null) return result.Unauthorized;
                login.Username = result.Email;
            }

            ApplicationUser user;
            if (!string.IsNullOrWhiteSpace(login.Username))
            {
                // find the user and set the tenant they belong to
                user = await _securityManager.GetUserByNameAsync(login.Username);
            }
            else
            {
                var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(login.PhoneNumber);
                user = await _securityManager.GetUserByPhoneNumberAsync(normalizePhoneNumber);
            }

            if (user == null || !user.IsActive)
            {
                return LoginUnauthorizedResult();
            }

            if (!ValidateTenantForUser(user.TenantId, tenantData.Id))
            {
                return LoginUnauthorizedResult();
            }

            if ((await _userManager.IsLockedOutAsync(user)) || (user.LockoutEnabled && user.LockoutEnd > DateTime.Now))
            {
                return LoginUnauthorizedResult(lockedOut: true);
            }

            if (!isFacebookAccount && !isGoogleAccount && !await _securityManager.IsPasswordValidAsync(user, login.Password))
            {
                return LoginUnauthorizedResult(lockedOut: await _userManager.IsLockedOutAsync(user));
            }

            await _userManager.SetObjectDataAsync(user, tenantData.Id);

            // Check if logging into admin portal and deny non "administrators" or "Coaches" access.
            var isAdminPortal = _httpContextAccessor.HttpContext.IsTenantAdminPortal();

            var userRoles = await _userManager.GetRolesAsync(user);
            var isAdministrator = userRoles.Contains(Roles.ADMINISTRATOR) || userRoles.Contains(Roles.SUPER_ADMINISTRATOR);

            if (isAdminPortal)
            {
                // You need to be an administrator to login into portal
                if (!isAdministrator)
                {
                    return LoginUnauthorizedResult(message: "You do not have permission to access this portal.");
                }
            }
            else
            {
                // Can't login without a role or if you are an administrator
                if (!userRoles.Any() || isAdministrator)
                {
                    return LoginUnauthorizedResult(message: "You do not have access.");
                }
            }

            // Update user, to save last login
            user.LastSeen = DateTime.Now;
            await _userManager.UpdateAsync(user);

            var jwt = await _securityManager.GenerateJwtForUserAsync(user, JwtEncoderEnum.Standard);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            jwtObj.userMustConfirmAuthCode = false;     // phone number code is confirmed before username is created now (changes because of SSO)
            jwtObj.loginType = isGoogleAccount ? "google" : isFacebookAccount ? "facebook" : "";
            jwtObj.userName = user.UserName;

            var package = new OkObjectResult(jwtObj);
            return package;
        }



        private static bool ValidateTenantForUser(Guid? userTenantId, Guid? tenantId)
        {
            return userTenantId != null && tenantId != null && userTenantId == tenantId;
        }

        private UnauthorizedObjectResult LoginUnauthorizedResult(string message = null, bool? lockedOut = null)
        {
            var tenantData = TenantExecutionContext.Tenant;

            message ??= $"Some of the information you have entered is incorrect.";
            message += $" Please contact the {tenantData.OrganisationName} call centre to find out more: {tenantData.OrganisationHelpPhoneNumber}";

            return Unauthorized(new
            {
                Error = message,
                Message = message,
                StatusCode = HttpStatusCode.Unauthorized,
                LockedOut = lockedOut.GetValueOrDefault(false)
            });
        }

        // This API should always return an OK result as to not give away emails
        [AllowAnonymous]
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            [FromServices] IHttpContextAccessor _httpContextAccessor, 
            [FromBody] SimpleUserModel model
        )
        {
            var userIdentifier = model?.Username ?? model?.Email ?? model.PhoneNumber;
            if (string.IsNullOrWhiteSpace(userIdentifier))
            {
                return Ok();// BadRequest("No username specified for Password Reset");
            }

            // normalize the phone number
            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(model.PhoneNumber);

            // Use username first, if provided, otherwise use email, otherwise use phone number
            var user = !string.IsNullOrEmpty(model.Username)
                ? await _securityManager.GetUserByNameAsync(model.Username)
                : !string.IsNullOrEmpty(model.Email) ? await _securityManager.GetUserByEmailAsync(model.Email)
                : await _securityManager.GetUserByPhoneNumberAsync(normalizePhoneNumber);

            var tenant = _httpContextAccessor.HttpContext.GetTenant();
            if (tenant == null)
            {
                return Ok(); // BadRequest("Could not reset password");
            }

            var isAdminPortal = _httpContextAccessor.HttpContext.IsTenantAdminPortal();
            var result = await _securityManager.ForgotPasswordAsync(user, isAdminPortal);

            if (!result)
            {
                return Ok(); // BadRequest("Could not reset password");
            }

            //var returnValue = ApplicationUserHelper.GetObscureMessagePrefenceValue(user);

            return Ok();
        }

        [Route("confirm-forgot-password")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordConfirmation([FromBody] PasswordResetModel resetModel)
        {
            var user = await _securityManager.GetUserByNameAsync(resetModel.Username);

            if (user == null)
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

            var jwt = await _securityManager.RefreshJwtToken(authorization);
            var jwtObj = JsonConvert.DeserializeObject<JwtObject>(jwt);
            var package = new OkObjectResult(jwtObj);
            return package;
        }

        [Route("verify-email-address")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> VerifyEmailAddress([FromQuery] VerifyEmailAddressModel verifyEmailModel)
        {
            var user = await _securityManager.GetUserByNameAsync(verifyEmailModel.Username);
            var token = TokenHelper.DecodeToken(verifyEmailModel.Token);

            if (user == null)
            {
                return BadRequest();
            }

            //RequestVerifyEmailAsync
            var changeResult = await _securityManager.ChangeEmailAddressAsync(user, token);
            if (changeResult)
                return new OkObjectResult(user.PendingEmail);

            return Ok(changeResult);
        }

        [Route("verify-password-token")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyPasswordToken([FromBody] VerifyPasswordTokenModel verifyPasswordTokenModel)
        {
            if (verifyPasswordTokenModel.Username == "" || verifyPasswordTokenModel.Token == "")
            {
                return BadRequest();
            }
            
            var user = await _securityManager.GetUserByNameAsync(verifyPasswordTokenModel.Username);
            var token = TokenHelper.DecodeToken(verifyPasswordTokenModel.Token);

            if (user == null)
            {
                return BadRequest();
            }

            //RequestVerifyEmailAsync
            var tokenResult = await _passwordManager.IsResetTokenValidAsync(user, token);
            if (tokenResult)
                return new OkObjectResult(tokenResult);

            return Ok(false);
        }

        [Route("verify-cellphone-number")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifyCellphoneNumber([FromBody] VerifyCellphoneNumberModel verifyCellphoneNumberModel)
        {
            var user = await _securityManager.GetUserByNameAsync(verifyCellphoneNumberModel.Username);
            var token = TokenHelper.DecodeToken(verifyCellphoneNumberModel.Token);
            var currentPhoneNumber = user.PhoneNumber;

            if (user == null)
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

        // Open-access
        #region OpenAccess

        [Route("verify-signup-cellphone-number")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> VerifySignupCellphoneNumber([FromBody] VerifySignupCellphoneNumberModel model)
        {
            if (string.IsNullOrEmpty(model.Cellphone))
            {
                return BadRequest();
            }

            var user = new ApplicationUser()
            {
                Id = Guid.NewGuid(),
                UserName = "",
                FirstName = "",
                PhoneNumber = UserHelper.NormalizePhoneNumber(model.Cellphone),
                PhoneNumberConfirmed = true,
                ContactPreference = MessageTypeConstants.SMS
            };
            
            if (!string.IsNullOrEmpty(model.AuthCode) && !string.IsNullOrEmpty(model.Token))
            {
                user.SecurityStamp = model.Token;
                var tokenVerification = await _securityCodeManager.VerifyTokenAsync(user, model.AuthCode);
                return tokenVerification ? Ok("") : Unauthorized();
            }
            else
            {
                var token = await _securityCodeManager.GenerateTokenAsync(user);
                await _notificationManager.SendOAWLAuthenticationCodeAsync(user, token);
                return Ok(user.SecurityStamp);
            }
        }

        [Route("check-username-phone-number")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CheckUsernamePhoneNumber([FromBody] OAVerifyUsernamePhoneNumberModel verifyModel)
        {
            bool isGoogleAccount = !string.IsNullOrEmpty(verifyModel.GoogleToken);
            bool isFacebookAccount = !string.IsNullOrEmpty(verifyModel.FacebookToken);

            // if both are empty, return error
            if (!string.IsNullOrEmpty(verifyModel.Username) && !string.IsNullOrEmpty(verifyModel.PhoneNumber))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Username and phone number is empty"
                });
            }

            if (isGoogleAccount)
            {
                var result = await ValidateGoogleLogin(verifyModel.Username, verifyModel.GoogleToken, null);
                if (result.Unauthorized != null)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 1,
                        Error = "Invalid Google token."
                    });
                }
            }
            if (isFacebookAccount)
            {
                var result = await ValidateFacebookLogin(verifyModel.Username, verifyModel.FacebookToken);
                if (result.Unauthorized != null)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 1,
                        Error = "Invalid Facebook token."
                    });
                }
            }

            if (!string.IsNullOrEmpty(verifyModel.Username))
            {
                // we use _dbContext to exclude tenantId validation
                var userByUsername = await _dbContext.Users
                    .Where(user => user.UserName == verifyModel.Username)
                    .Select(x => new
                    {
                        x.Id,
                        x.RegisterType
                    })
                    .FirstOrDefaultAsync();

                if (userByUsername != null)
                {
                    if (TenantExecutionContext.Tenant.TenantType == Tenancy.Enums.TenantType.WhiteLabel)
                    {
                        if (!string.IsNullOrEmpty(verifyModel.UserId))
                        {
                            var user = await _dbContext.Users
                                .Where(user => user.Id.ToString() == verifyModel.UserId)
                                .Select(x => new
                                {
                                    x.Id,
                                    x.IdNumber
                                })
                                .FirstOrDefaultAsync();
                            if (user.IdNumber != verifyModel.Username)
                            {
                                return Ok(new FailedVerificationModel
                                {
                                    ErrorCode = 2,
                                    Error = "Invalid Username"
                                });
                            }
                            return Ok(new
                            {
                                StatusCode = 1,
                                Message = "Ok"
                            });
                        }
                    }
                    if (isGoogleAccount && userByUsername.RegisterType == RegisterTypeConstants.GOOGLE)
                    {
                        return Ok(new
                        {
                            StatusCode = 3,
                            Message = "Username exists already, login"
                        });
                    }
                    if (isFacebookAccount && userByUsername.RegisterType == RegisterTypeConstants.FACEBOOK)
                    {
                        return Ok(new
                        {
                            StatusCode = 3,
                            Message = "Username exists already, login"
                        });
                    }
                    return Ok(new 
                    {
                        StatusCode = 4,
                        Error = "Username exists already."
                    });
                }
            }

            if (!string.IsNullOrEmpty(verifyModel.PhoneNumber))
            {
                // we use _dbContext to exclude tenantId validation
                var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(verifyModel.PhoneNumber);
                var userByPhoneNumber = await _dbContext.Users
                    .Where(user => user.UserName == normalizePhoneNumber)
                    .Select(x => new
                    {
                        x.Id
                    })
                    .FirstOrDefaultAsync();
                if (userByPhoneNumber != null)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 3,
                        Error = "Invalid Phone Number"
                    });
                }
            }

            return Ok(new
            {
                StatusCode = 1,
                Message = "Ok"
            });
        }

        [Route("add-oa-practitioner")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AddOAPractitioner([FromBody] OAPractitionerModel addOAPractitionerModel)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            Guid userId = Guid.NewGuid();
            ApplicationUser newUser = null;
            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber);

            //First see if there was an invite created for this user
            var invite = await _inviteRepo.GetAll().Include(x => x.User)
                .FirstOrDefaultAsync(x => x.IsActive && !x.IsAccepted.HasValue && x.User.PhoneNumber.Equals(normalizePhoneNumber) && x.Status == InviteStatus.Pending);

            if (invite != null)
            {
                invite.Status = InviteStatus.Accepted;
                invite.AcceptedDate = DateTime.UtcNow;
                invite.IsAccepted = true;
                invite.IsActive = false;
                _inviteRepo.Update(invite);

                var existingUser = await _userManager.FindByIdAsync(invite.UserId);
                userId = existingUser.Id;
                existingUser.UserName = addOAPractitionerModel.Username;
                existingUser.PendingPhoneNumber = normalizePhoneNumber;
                existingUser.PhoneNumberConfirmed = false;
                existingUser.TenantId = tenantId;
                existingUser.IsActive = true;
                existingUser.RegisterType = addOAPractitionerModel.RegisterType;
                existingUser.ShareInfoPartners = addOAPractitionerModel.ShareInfoPartners;

                // Validate password for user
                if (!await _passwordManager.IsPasswordSecureAsync(existingUser, addOAPractitionerModel.Password))
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 1,
                        Error = "Add password failure"
                    });
                }
                var updated = await _userManager.UpdateAsync(existingUser);
                if (!updated.Succeeded)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 2,
                        Error = "Update user failure"
                    });
                }
            }    
            else if (RegisterTypeConstants.USERNAME == addOAPractitionerModel.RegisterType)
            {
                newUser = new ApplicationUser()
                {
                    Id = userId,
                    UserName = addOAPractitionerModel.Username,
                    PhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    //PendingPhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    PhoneNumberConfirmed = true,
                    ContactPreference = MessageTypeConstants.SMS,
                    TenantId = tenantId,
                    InsertedDate = DateTime.Now,
                    IsActive = true,
                    RegisterType = addOAPractitionerModel.RegisterType,
                    ShareInfoPartners = addOAPractitionerModel.ShareInfoPartners,
                };

                // Validate password for user
                if (!await _passwordManager.IsPasswordSecureAsync(newUser, addOAPractitionerModel.Password))
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 1,
                        Error = "Add password failure"
                    });
                }
            }
            else if (RegisterTypeConstants.GOOGLE ==  addOAPractitionerModel.RegisterType)
            {
                newUser = new ApplicationUser()
                {
                    Id = userId,
                    UserName = addOAPractitionerModel.Username,
                    PhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    //PendingPhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    PhoneNumberConfirmed = true,
                    ContactPreference = MessageTypeConstants.SMS,
                    TenantId = tenantId,
                    InsertedDate = DateTime.Now,
                    IsActive = true,
                    RegisterType = addOAPractitionerModel.RegisterType,
                    ShareInfoPartners = addOAPractitionerModel.ShareInfoPartners,
                };
            }
            else if (RegisterTypeConstants.FACEBOOK == addOAPractitionerModel.RegisterType)
            {  // faceBook signs up with phone number

                newUser = new ApplicationUser()
                {
                    Id = userId,
                    UserName = addOAPractitionerModel.Username,
                    PhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    PhoneNumberConfirmed = true,
                    ContactPreference = MessageTypeConstants.SMS,
                    TenantId = tenantId,
                    InsertedDate = DateTime.Now,
                    IsActive = true,
                    RegisterType = addOAPractitionerModel.RegisterType,
                    ShareInfoPartners = addOAPractitionerModel.ShareInfoPartners,
                };
            }
            if (newUser != null)
            {
                var created = await _userManager.CreateAsync(newUser);
                if (!created.Succeeded)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 2,
                        Error = "Add new user failure"
                    });
                }
            }

            // Get newly created user
            var user = await _securityManager.GetUserByIdAsync(userId);

            // Step 2 - create password
            if (RegisterTypeConstants.USERNAME == addOAPractitionerModel.RegisterType)
            {
                await _passwordManager.AddPasswordAsync(user, addOAPractitionerModel.Password);
            }

            // Step 3: add user to practitioner role
            var addToRoleResult = await _userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
            if (!addToRoleResult.Succeeded)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Add role failure"
                });
            }

            // Step4: add user to practitioner table
            var newPractitioner = _personnelService.AddOAPractitioner(user.Id, user.UserName, invite?.PrincipalId);
            if (newPractitioner == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 4,
                    Error = "Add practitioner failure"
                });
            }

            //var token = await _securityCodeManager.GenerateTokenAsync(user);
            //if (string.IsNullOrWhiteSpace(token))
            //{
            //    return BadRequest(new FailedVerificationModel
            //    {
            //        ErrorCode = 5,
            //        Error = "Generate of token failure"
            //    });
            //}
            //flow changed - cellphone number obtained earlied and verified before trying to create user.
            //await _notificationManager.SendOAWLAuthenticationCodeAsync(user, token);
            //return new OkObjectResult(token);

            await _dbContext.MessageLogs
                    .Where(m => m.TenantId == tenantId
                            && (m.To == user.PendingPhoneNumber || m.To == user.PhoneNumber)
                            && m.MessageTemplateType == TemplateTypeConstants.OAWLAuthCode
                            && m.IsActive)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(m => m.IsActive, false));

            return Ok();
        }

        [Route("update-oa-practitioner")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> UpdateOAPractitioner([FromBody] OAPractitionerModel input)
        {
            if (string.IsNullOrEmpty(input.Username))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Username unavailable"
                });
            }

            var user = await _securityManager.GetUserByNameAsync(input.Username);

            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "User not found with username"
                });
            }

            bool isSSOAccount = user.RegisterType != RegisterTypeConstants.USERNAME;
            if (!isSSOAccount)
            {
                if (string.IsNullOrEmpty(input.Password))
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 2,
                        Error = "Password unavailable"
                    });
                }

                // Validate password for user
                if (!await _passwordManager.IsPasswordSecureAsync(user, input.Password))
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 4,
                        Error = "Password insecure"
                    });
                }

                // Change password
                if (string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    await _passwordManager.AddPasswordAsync(user, input.Password);
                }
                else
                {
                    await _securityManager.ChangePasswordAsync(user, input.Password);
                }
            }

            // Change phone number
            user.PhoneNumber = UserHelper.NormalizePhoneNumber(input.PhoneNumber);
            user.UpdatedDate = DateTime.Now;
            await _userManager.UpdateAsync(user);

            // Generate token
            var token = await _securityCodeManager.GenerateTokenAsync(user);
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 5,
                    Error = "Generate of token failure"
                });
            }

            await _notificationManager.SendOAWLAuthenticationCodeAsync(user, token);

            // The auth code is delivered via SMS only; it must never be returned in the
            // response body (flagged during penetration testing). Return a success flag.
            return Ok(true);
        }

        #endregion

        [Route("submit-user-help-form")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SubmitUserHelpForm([FromBody] AddUserHelpInputModel input)
        {
            var newRecord = _userHelpRepo.Insert(new UserHelp()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                Subject = input.Subject,
                Description = input.Description,
                UserId = input.UserId,
                ContactPreference = input.ContactPreference,
                CellNumber = input.CellNumber,
                Email = input.Email,
                IsLoggedIn = input.IsLoggedIn,
            });

            if (newRecord == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Submit of help form failure"
                });
            }

            _ = Task.Run(async () => {
                await SubmitUserHelpFormBackground(
                   _serviceScopeFactory, _applicationUserId, newRecord
                );
            });

            return Ok();
        }

        private async static Task SubmitUserHelpFormBackground(IServiceScopeFactory serviceScopeFactory,
                Guid applicationUserId,
                UserHelp userHelp)
        {
            using var scope = serviceScopeFactory.CreateScope();
            ILogger<AuthenticationController> logger = null;

            try
            {
                logger = scope.ServiceProvider.GetRequiredService<ILogger<AuthenticationController>>();
                var notificationManager = scope.ServiceProvider.GetRequiredService<SecurityNotificationManager>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                var userManager = scope.ServiceProvider.GetRequiredService<ApplicationUserManager>();

                await notificationManager.SendHelpFormSubmissionToAdministratorAsync(userHelp);
                await notificationService.ExpireNotificationsTypesForUser(applicationUserId.ToString(), TemplateTypeConstants.FeedbackNotification);

                var adminUsers = userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;

                var affectedUserFullName = "anonymous";
                if (userHelp.UserId != null)
                {
                    var user = await userManager.FindByIdAsync(userHelp.UserId);
                    affectedUserFullName = user?.FullName ?? "anonymous";
                }

                var replacements = new List<TagsReplacements>
                    {
                        new TagsReplacements() { FindValue = "AffectedUserFullName", ReplacementValue = affectedUserFullName },
                        new TagsReplacements() { FindValue = "ApplicationName", ReplacementValue = TenantExecutionContext.Tenant.ApplicationName },
                        new TagsReplacements() { FindValue = "HelpContactDetail", ReplacementValue = userHelp.ContactPreference == "email" ? userHelp.Email : userHelp.CellNumber },
                        new TagsReplacements() { FindValue = "HelpSubject", ReplacementValue = userHelp.Subject },
                        new TagsReplacements() { FindValue = "HelpDescription", ReplacementValue = userHelp.Description },
                        new TagsReplacements() { FindValue = "HelpLoginStatus", ReplacementValue = userHelp.IsLoggedIn ? "Yes" : "No" },
                        new TagsReplacements() { FindValue = "OrganisationName", ReplacementValue = TenantExecutionContext.Tenant.OrganisationName },
                    };

                foreach (var adminUser in adminUsers)
                {
                    await notificationService.SendNotificationAsync(
                        null,
                        TemplateTypeConstants.AdminUserHelpForm,
                        DateTime.Now,
                        adminUser,
                        "",
                        MessageStatusConstants.Red,
                        replacements,
                        null,
                        false,
                        false,
                        string.Join(',', replacements),
                        null,
                        null,
                        "portal"
                    );
                }
                logger.LogInformation("Help request logged {UserHelpId}", userHelp.Id); 
            }
            catch (Exception ex)
            {
              logger?.LogInformation(ex, ex.Message);
            }
        }

        [Route("register-wl-user")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> RegisterWLUser([FromBody] RegisterModel input)
        {

            if (string.IsNullOrEmpty(input.Username))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Username is empty"
                });
            }

            var user = await _securityManager.GetUserByNameAsync(input.Username);
            if (user == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "User not available on system"
                });
            }

            var practitionerOrCoachRegistered = _personnelService.RegisterWLUser(user.Id);

            if (!practitionerOrCoachRegistered)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 3,
                    Error = "Register of user failed"
                });
            }

            return Ok(user.Id);
        }

        private sealed class ValidateGoogleLoginResult
        {
            public UnauthorizedObjectResult Unauthorized { get; set; }
            public string Email { get; set; }

        }
        private async Task<ValidateGoogleLoginResult> ValidateGoogleLogin(string username, string token, string code)
        {
            if (_googleConfig == null || string.IsNullOrEmpty(_googleConfig.ClientId) || string.IsNullOrEmpty(_googleConfig.ClientSecret))
            {
                return new ValidateGoogleLoginResult { Unauthorized = LoginUnauthorizedResult(message: "Google Client secrets configuration is missing.") };
            }

            if (!string.IsNullOrEmpty(token))
            {
                var googlePayload = await GoogleJsonWebSignature.ValidateAsync(token);
                if (googlePayload == null)
                {
                    return new ValidateGoogleLoginResult { Unauthorized = LoginUnauthorizedResult(message: "Invalid Google token.") };
                }
                return new ValidateGoogleLoginResult { Email = username };
            }
            
            if (!string.IsNullOrEmpty(code))
            {
                var initializer = new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new Google.Apis.Auth.OAuth2.ClientSecrets
                    {
                        ClientId = _googleConfig.ClientId,
                        ClientSecret = _googleConfig.ClientSecret
                    }
                };
                var flow = new GoogleAuthorizationCodeFlow(initializer);

                var tokenResponse = await flow.ExchangeCodeForTokenAsync(
                    userId: "me",
                    code: code,
                    redirectUri: "postmessage",
                    taskCancellationToken: CancellationToken.None);

                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadJwtToken(tokenResponse.IdToken);

                var emailClaim = jsonToken.Claims.FirstOrDefault(x => x.Type == "email");
                if (emailClaim != null)
                {
                    return new ValidateGoogleLoginResult { Email = emailClaim.Value };
                }

                return new ValidateGoogleLoginResult { Unauthorized = LoginUnauthorizedResult(message: "No email address for Google code.") };
            }

            return new ValidateGoogleLoginResult { Unauthorized = LoginUnauthorizedResult(message: "Invalid Google token or code.") };
        }

        private sealed class ValidateFacebookLoginResult
        {
            public UnauthorizedObjectResult Unauthorized { get; set; }
            public string UserId { get; set; }
        }

        private async Task<ValidateFacebookLoginResult> ValidateFacebookLogin(string username, string token)
        {
            try
            {
                using var client = new HttpClient();
                var debugTokenUrl = $"https://graph.facebook.com/debug_token?input_token={token}&access_token={_facebookConfig.AppId}|{_facebookConfig.AppSecret}"; // Use app secret
                var debugResponse = await client.GetAsync(debugTokenUrl);
                if (!debugResponse.IsSuccessStatusCode)
                {
                    return new ValidateFacebookLoginResult() { Unauthorized = LoginUnauthorizedResult(message: "Facebook token validation failed.") };
                }
                var responseData = await debugResponse.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<SSO.Facebook.FacebookTokenDebugResponse>(responseData);
                if (result?.Data?.UserId != username)
                {
                    return new ValidateFacebookLoginResult() { Unauthorized = LoginUnauthorizedResult(message: "Facebook token validation failed.") };
                }
                return new ValidateFacebookLoginResult() { UserId = result.Data.UserId };
                }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ValidateFacebookLogin failed");
                return new ValidateFacebookLoginResult() { Unauthorized = LoginUnauthorizedResult(message: "Exception occurred." ) }; 
            }
        }

        [Route("facebook/deauthorize")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> DeauthorizeFacebook()
        {
            try
            {
                // Read the signed_request from form
                string? signedRequest = Request.Form["signed_request"];

                if (string.IsNullOrWhiteSpace(signedRequest))
                {
                    _logger.LogWarning("Deauthorize request missing signed_request");
                    return Ok(); // Still return 200
                }

                var data = ParseAndValidateSignedRequest(signedRequest, _facebookConfig.AppSecret);

                if (data == null || !data.TryGetValue("user_id", out var userIdObj) || userIdObj is not string userId)
                {
                    _logger.LogWarning("Invalid or missing user_id in deauthorize signed request");
                    return Ok();
                }

                // Your cleanup logic here
                _logger.LogInformation("User deauthorized app: {UserId}", userId);

                var user = await _userManager.FindByNameAsync(userId);
                if (user != null)
                {
                    user.IsActive = false;
                    user.UserName = $"{user.UserName}-deactivated-{DateTime.Now.ToString("yyyyMMddHHmmss")}";
                    user.NormalizedUserName = user.UserName.ToUpper();
                    await _userManager.UpdateAsync(user);
                }

                // Example:
                // await _userService.DeleteUserDataAsync(userId);
                // await _dbContext.FacebookTokens.Where(t => t.FbUserId == userId).ExecuteDeleteAsync();

                return Ok(); // or return Ok("{\"status\":\"ok\"}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Facebook deauthorize callback");
                return Ok(); // MUST return 200 anyway
            }
        }

        private static Dictionary<string, object>? ParseAndValidateSignedRequest(string signedRequest, string appSecret)
        {
            try
            {
                var parts = signedRequest.Split('.');
                if (parts.Length != 2)
                    return null;

                string encodedSig = parts[0];
                string encodedPayload = parts[1];

                // Facebook uses base64url (replace -_ ? +/, pad with =)
                string base64Sig = encodedSig.Replace('-', '+').Replace('_', '/').PadRight(encodedSig.Length + (4 - encodedSig.Length % 4) % 4, '=');
                string base64Payload = encodedPayload.Replace('-', '+').Replace('_', '/').PadRight(encodedPayload.Length + (4 - encodedPayload.Length % 4) % 4, '=');

                byte[] sigBytes = Convert.FromBase64String(base64Sig);
                string payloadJson = Encoding.UTF8.GetString(Convert.FromBase64String(base64Payload));

                // Validate signature: HMAC-SHA256 of payload using app secret
                using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(appSecret));
                byte[] expectedSig = hmac.ComputeHash(Encoding.UTF8.GetBytes(encodedPayload)); // Note: use original encodedPayload (before decoding)

                if (!sigBytes.ConstantTimeEquals(expectedSig)) // Timing-safe comparison
                    return null;

                // Parse JSON payload
                var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(payloadJson);
                return data;
            }
            catch
            {
                return null;
            }
        }
    }
}
