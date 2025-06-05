using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Abstractrions.Constants;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security.Api.Constants;
using ECDLink.Security.Extensions;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly ITokenManager<ApplicationUser, SecurityCodeTokenManager> _securityCodeManager;

        private readonly SecurityManager _securityManager;
        private readonly ApplicationUserManager _userManager;
        private readonly SecurityNotificationManager _notificationManager;
        private readonly IPasswordManager<ApplicationUser> _passwordManager;
        private readonly PersonnelService _personnelService;
        private readonly AuthenticationDbContext _dbContext;
        private readonly INotificationService _notificationService;
        private readonly TenantService _tenantService;

        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;
        private IGenericRepository<UserHelp, Guid> _userHelpRepo;

        public AuthenticationController(
            ITokenManager<ApplicationUser, SecurityCodeTokenManager> securityCodeManager,
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            SecurityManager securityManager,
            ApplicationUserManager userManager,
            IPasswordManager<ApplicationUser> passwordManager,
            SecurityNotificationManager notificationManager,
            PersonnelService personnelService,
            TenantService tenantService,
            HierarchyEngine hierarchyEngine,
            AuthenticationDbContext dbContext,
            [Service] INotificationService notificationService)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _userHelpRepo = _repoFactory.CreateGenericRepository<UserHelp>(userContext: _applicationUserId);

            _securityManager = securityManager;
            _userManager = userManager;
            _passwordManager = passwordManager;
            _personnelService = personnelService;
            _notificationManager = notificationManager;
            _securityCodeManager = securityCodeManager;
            _dbContext = dbContext;
            _notificationService = notificationService;
            _tenantService = tenantService;
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
            var organisationName = tenantData.OrganisationName;
            var callCenterNumber = "0800 014 817"; // TODO: Callcenter number should be in the tenant config?

            //exclude funny script attempts
            if ((login?.Password?.StartsWith('<') ?? true)
                || (login?.PhoneNumber?.StartsWith('<') ?? false)
                || (login?.Username?.StartsWith('<') ?? true))
            {
                return Unauthorized(new { Error = $"Some of the information you have entered is incorrect. Please contact the {organisationName} call centre to find out more: {callCenterNumber}" });
            }

            ApplicationUser user;
            if (!string.IsNullOrWhiteSpace(login.Username))
            {
                // find the user and set the tenant they belong to
                user = await _securityManager.GetUsernameAsync(login.Username, login.Password);
                if (user != null)
                {
                    if (validateTenantForUser(user.TenantId, tenantData.Id))
                    {
                        var tenantId = user.TenantId;
                        var tenants = _tenantService.GetTenantById((Guid)tenantId);
                        TenantExecutionContext.SetTenant(null, true);
                        TenantExecutionContext.SetTenant((Tenancy.Model.TenantInternalModel)tenants.First());
                        await _userManager.SetObjectDataAsync(user, tenantId);
                    }
                }
            }
            else
            {
                var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(login.PhoneNumber);
                user = await _securityManager.LogInWithPhoneNumberAsync(normalizePhoneNumber, login.Password);
            }

            if (user == null || (user.LockoutEnabled == true && user.LockoutEnd > DateTime.Now))
            {
                return Unauthorized(new { Error = $"Some of the information you have entered is incorrect. Please contact the {organisationName} call centre to find out more: {callCenterNumber}" });
            }

            if (!validateTenantForUser(user.TenantId, tenantData.Id))
            {
                return Unauthorized(new { Error = $"You do not have access. Please contact the {organisationName} call centre to find out more: {callCenterNumber}" });
            }

            // Check if logging into admin portal and deny non "administrators" or "Coaches" access.
            var isAdminPortal = checkHostUrlForAdminPortal(
                TenantExecutionContext.Tenant.AdminSiteAddress,
                TenantExecutionContext.Tenant.AdminTestSiteAddress,
                _httpContextAccessor.HttpContext?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri ?? (_httpContextAccessor.HttpContext?.Request.Host.Value ?? String.Empty));

            var userRoles = await _userManager.GetRolesAsync(user);
            var isAdministrator = userRoles.Contains(Roles.ADMINISTRATOR) || userRoles.Contains(Roles.SUPER_ADMINISTRATOR);

            if (isAdminPortal)
            {
                // You need to be an administrator to login into portal
                if (!isAdministrator)
                {
                    return Unauthorized(new { Error = $"You do not have permission to access this portal. Please contact the {organisationName} call centre to find out more: {callCenterNumber}" });
                }
            }
            else
            {
                // Can't login without a role or if you are an administrator
                if (!userRoles.Any() || isAdministrator)
                {
                    return Unauthorized(new { Error = $"You do not have access. Please contact the {organisationName} call centre to find out more: {callCenterNumber}" });
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

        private bool validateTenantForUser(Guid? userTenantId, Guid? tenantId) 
        {
            return userTenantId == null || tenantId == null ? false : userTenantId == tenantId;
        }

        private bool checkHostUrlForAdminPortal(string adminSiteAddress, string testAdminSiteAddress, string hostAddress)
        {
            return hostAddress.Contains(adminSiteAddress) || hostAddress.Contains(testAdminSiteAddress);
        }

        // This API should always return an OK result as to not give away emails
        [AllowAnonymous]
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] SimpleUserModel model)
        {
            var userIdentifier = model?.Username ?? model?.Email ?? model.PhoneNumber;
            if (string.IsNullOrWhiteSpace(userIdentifier))
            {
                return BadRequest("No username specified for Password Reset");
            }

            // normalize the phone number
            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(model.PhoneNumber);

            // Use username first, if provided, otherwise use email, otherwise use phone number
            var user = !string.IsNullOrEmpty(model.Username)
                ? await _securityManager.GetUserByNameAsync(model.Username)
                : !string.IsNullOrEmpty(model.Email) ? await _securityManager.GetUserByEmailAsync(model.Email)
                : await _securityManager.GetUserByPhoneNumberAsync(normalizePhoneNumber);


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

            if (user == null)
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

        [Route("check-username-phone-number")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult CheckUsernamePhoneNumber([FromBody] OAVerifyUsernamePhoneNumberModel verifyModel)
        {
            // if both are empty, return error
            if (!string.IsNullOrEmpty(verifyModel.Username) && !string.IsNullOrEmpty(verifyModel.PhoneNumber))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Username and phone number is empty"
                });
            }

            if (!string.IsNullOrEmpty(verifyModel.Username))
            {
                // we use _dbContext to exclude tenantId validation
                var userByUsername = _dbContext.Users.Where(user => user.UserName == verifyModel.Username).FirstOrDefault();

                if (userByUsername != null)
                {
                    if (TenantExecutionContext.Tenant.TenantType == Tenancy.Enums.TenantType.WhiteLabel)
                    {
                        if (!string.IsNullOrEmpty(verifyModel.UserId))
                        {
                            var user = _dbContext.Users.Where(user => user.Id.ToString() == verifyModel.UserId).FirstOrDefault();
                            if (user.IdNumber != verifyModel.Username)
                            {
                                return BadRequest(new FailedVerificationModel
                                {
                                    ErrorCode = 2,
                                    Error = "Invalid Username"
                                });
                            }
                        }
                        else
                        {
                            return BadRequest(new FailedVerificationModel
                            {
                                ErrorCode = 2,
                                Error = "Invalid Username"
                            });
                        }
                    }
                    else
                    {
                        return BadRequest(new FailedVerificationModel
                        {
                            ErrorCode = 2,
                            Error = "Invalid Username"
                        });
                    }
                }
            }

            if (!string.IsNullOrEmpty(verifyModel.PhoneNumber))
            {
                // we use _dbContext to exclude tenantId validation
                var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(verifyModel.PhoneNumber);
                var userByPhoneNumber = _dbContext.Users.Where(user => user.UserName == normalizePhoneNumber).FirstOrDefault();
                if (userByPhoneNumber != null)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 3,
                        Error = "Invalid Phone Number"
                    });
                }
            }

            return Ok();
        }

        [Route("add-oa-practitioner")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AddOAPractitioner([FromBody] OAPractitionerModel addOAPractitionerModel)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var userId = Guid.NewGuid();
            var newUser = new ApplicationUser();

            // Step 1 - create User
            if (RegisterTypeConstants.USERNAME == addOAPractitionerModel.RegisterType)
            {
                newUser = new ApplicationUser()
                {
                    Id = userId,
                    UserName = addOAPractitionerModel.Username,
                    PhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    PendingPhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.PhoneNumber),
                    PhoneNumberConfirmed = false,
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
            else if (RegisterTypeConstants.FACEBOOK == addOAPractitionerModel.RegisterType)
            {  // faceBook signs up with phone number

                newUser = new ApplicationUser()
                {
                    Id = userId,
                    UserName = addOAPractitionerModel.Username,
                    PhoneNumber = UserHelper.NormalizePhoneNumber(addOAPractitionerModel.Username),
                    ContactPreference = MessageTypeConstants.SMS,
                    TenantId = tenantId,
                    InsertedDate = DateTime.Now,
                    IsActive = true,
                    RegisterType = addOAPractitionerModel.RegisterType,
                    ShareInfoPartners = addOAPractitionerModel.ShareInfoPartners,
                };
            }

            var created = await _userManager.CreateAsync(newUser);
            if (!created.Succeeded)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Add new user failure"
                });
            }

            // Get newly created user
            var user = await _securityManager.GetUserByNameAsync(addOAPractitionerModel.Username);

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
            var newPractitioner = _personnelService.AddOAPractitioner(user.Id, user.UserName);
            if (newPractitioner == null)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 4,
                    Error = "Add practitioner failure"
                });
            }

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

            return new OkObjectResult(token);
        }

        [Route("update-oa-practitioner")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> UpdateOAPractitioner([FromBody] OAPractitionerModel input)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            if (string.IsNullOrEmpty(input.Username))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Username unavailable"
                });
            }
            if (string.IsNullOrEmpty(input.Password))
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 2,
                    Error = "Password unavailable"
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

            return new OkObjectResult(token);
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

            if (newRecord != null)
            {
                await _notificationManager.SendHelpFormSubmissionToAdministratorAsync((Guid)_applicationUserId, newRecord);
                await _notificationService.ExpireNotificationsTypesForUser(_applicationUserId.ToString(), TemplateTypeConstants.FeedbackNotification);

                var affectedUserFullName = "anonymous";
                if (newRecord.UserId != null)
                {
                    var user = _userManager.FindByIdAsync(newRecord.UserId).Result;
                    affectedUserFullName = user.FullName;
                }

                List<TagsReplacements> replacements = new List<TagsReplacements>
                {
                    new TagsReplacements()
                    {
                        FindValue = "AffectedUserFullName",
                        ReplacementValue = affectedUserFullName
                    },
                    new TagsReplacements()
                    {
                        FindValue = "ApplicationName",
                        ReplacementValue = TenantExecutionContext.Tenant.ApplicationName
                    },
                    new TagsReplacements()
                    {
                        FindValue = "HelpContactDetail",
                        ReplacementValue =  newRecord.ContactPreference == "email" ? newRecord.Email : newRecord.CellNumber
                    },
                    new TagsReplacements()
                    {
                        FindValue = "HelpCategory",
                        ReplacementValue = newRecord.Subject
                    },
                    new TagsReplacements()
                    {
                        FindValue = "HelpDescription",
                        ReplacementValue = newRecord.Description
                    },
                    new TagsReplacements()
                    {
                        FindValue = "HelpLoginStatus",
                        ReplacementValue = newRecord.IsLoggedIn  ? "Yes" : "No"
                    },
                    new TagsReplacements()
                    {
                        FindValue = "OrganisationName",
                        ReplacementValue = TenantExecutionContext.Tenant.OrganisationName
                    },
                };

                var userToSend = await _userManager.FindByIdAsync(_applicationUserId);
                await _notificationService.SendNotificationAsync(null, 
                                                                 TemplateTypeConstants.AdminUserHelpForm, 
                                                                 DateTime.Now, 
                                                                 userToSend, 
                                                                 "",
                                                                 MessageStatusConstants.Blue,
                                                                 replacements,
                                                                 null,
                                                                 false,
                                                                 true,
                                                                 null,
                                                                 null,
                                                                 null,
                                                                 "portal");

            }
            else
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Submit of help form failure"
                });
            }

            return Ok();
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



    }
}
