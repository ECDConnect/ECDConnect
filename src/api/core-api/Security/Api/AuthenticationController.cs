using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
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
using Microsoft.IdentityModel.Tokens;
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
        private readonly SecurityNotificationManager _notificationManager;
        private readonly IPasswordManager<ApplicationUser> _passwordManager;
        private readonly PersonnelService _personnelService;

        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;
        private IGenericRepository<UserHelp, Guid> _userHelpRepo;

        public AuthenticationController(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            SecurityManager securityManager, 
            ApplicationUserManager userManager,
            IPasswordManager<ApplicationUser> passwordManager,
            SecurityNotificationManager notificationManager,
            PersonnelService personnelService,
            HierarchyEngine hierarchyEngine)
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

            var organisationName = TenantExecutionContext.Tenant.OrganisationName;

            //exclude funny script attempts
            if ((login?.Password?.StartsWith('<') ?? true)
                || (login?.PhoneNumber?.StartsWith('<') ?? false)
                || (login?.Username?.StartsWith('<') ?? true))
            {
                return Unauthorized(new { Error = $"Some of the information you have entered is incorrect. Please contact the {organisationName} call centre to find out more: 0800 014 817" });
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

            if (user == null || (user.LockoutEnabled == true && user.LockoutEnd > DateTime.Now))
            {
                return Unauthorized(new { Error = $"Some of the information you have entered is incorrect. Please contact the {organisationName} call centre to find out more: 0800 014 817" });
            }


            // Check if logging into admin portal and deny non "administrators" or "Coaches" access.
            var isAdminPortal = checkHostUrlForAdminPortal(
                TenantExecutionContext.Tenant.AdminSiteAddress,
                TenantExecutionContext.Tenant.AdminTestSiteAddress,
                _httpContextAccessor.HttpContext?.Request?.GetTypedHeaders()?.Referer?.AbsoluteUri ?? (_httpContextAccessor.HttpContext?.Request.Host.Value ?? String.Empty));

            var userRoles = await _userManager.GetRolesAsync(user);

            if (isAdminPortal)
            {
                var hasAccess = userRoles.Contains(Roles.ADMINISTRATOR) || userRoles.Contains(Roles.SUPER_ADMINISTRATOR) || userRoles.Contains(RolesGG.TEAM_LEAD);
                if (!hasAccess)
                {

                    // TODO: Callcenter number should be in the tenant config?
                    return Unauthorized(new { Error = $"You do not have permission to access this portal. Please contact the {organisationName} call centre to find out more: 0800 014 817" });
                }
            } else
            {
                if (!userRoles.Any())
                {
                    return Unauthorized(new { Error = $"You do not have access. Please contact the {organisationName} call centre to find out more: 0800 014 817" });
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
            return hostAddress.Contains(adminSiteAddress) || hostAddress.Contains(testAdminSiteAddress);
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
        public async Task<IActionResult> CheckUsernamePhoneNumber([FromBody] OAVerifyUsernamePhoneNumberModel verifyModel)
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
                var userByUsername = await _securityManager.GetUserByNameAsync(verifyModel.Username);
                if (userByUsername != null)
                {
                    return BadRequest(new FailedVerificationModel
                    {
                        ErrorCode = 2,
                        Error = "Invalid Username"
                    });
                }
            }

            if (!string.IsNullOrEmpty(verifyModel.PhoneNumber))
            {
                var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(verifyModel.PhoneNumber);
                var userByPhoneNumber = _userManager.Users.FirstOrDefault(user => user.PhoneNumber == normalizePhoneNumber
                                    && (user.TenantId == TenantExecutionContext.Tenant.Id || user.TenantId == null));
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
        public async Task<IActionResult> AddOAPractitioner([FromBody] OAAddPractitionerModel addOAPractitionerModel)
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
                    RegisterType = addOAPractitionerModel.RegisterType
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
                    RegisterType = addOAPractitionerModel.RegisterType
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
            return Ok();
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

        [Route("register-practitioner")]
        [AllowAnonymous]
        [HttpPost]
        public string RegisterPractitioner([FromBody] RegisterPractitionerModel input)
        {
            var practitioner = _personnelService.RegisterPractitioner(input.Username);

            if (practitioner == null)
            {
                return "Register of practitioner failed";
            }

           return practitioner.UserId.ToString();
        }

        [Route("update-username")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult UpdateUsername([FromBody] UpdateUserNameModel input)
        {
            var updatedResult = _personnelService.UpdateUsername(input.UserId, input.Username);

            if (!updatedResult.Succeeded)
            {
                return BadRequest(new FailedVerificationModel
                {
                    ErrorCode = 1,
                    Error = "Could not update user"
                });
            }
            return Ok();
        }

    }
}
