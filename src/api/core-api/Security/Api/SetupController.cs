using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Services;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace ECDLink.Security.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetupController : ControllerBase
    {
        
        private readonly TenantService _tenantService;
        private readonly ILocaleService<Language> _localeService;
        private readonly SecurityNotificationManager _notificationManager;
        private readonly ContentManagementRepository _contentRepo;

        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;

        private IGenericRepository<TenantSetupInfo, Guid> _tenantSetupInfoRepo;

        public SetupController(
            ITokenManager<ApplicationUser, SecurityCodeTokenManager> securityCodeManager,
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            SecurityNotificationManager notificationManager,
            TenantService tenantService,
            ILocaleService<Language> localeService,
            ContentManagementRepository contentRepo)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();


            _tenantSetupInfoRepo = _repoFactory.CreateGenericRepository<TenantSetupInfo>(userContext: _applicationUserId);

            _notificationManager = notificationManager;
            _tenantService = tenantService;
            _localeService = localeService;
            _contentRepo = contentRepo;
        }


        [Route("validate-new-tenant")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult ValidateNewTenantName([FromBody] string applicationName)
        {
            if (string.IsNullOrEmpty(applicationName))
            {
                return BadRequest(new FailedVerificationModel
                {
                    Error = "Application name is null"
                });
            }

            return Ok(_tenantService.ValidateNewTenantName(applicationName));
        }

        [Route("add-tenant-setup-info")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AddTenantSetupInfo([FromBody] string setupInfo)
        {
            var tenantOrgDetail = JsonConvert.DeserializeObject<TenantOrgDetailModel>(setupInfo);

            var setupRecord = _tenantSetupInfoRepo.Insert(new TenantSetupInfo()
            {
                Id = Guid.NewGuid(),
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                IsActive = true,
                OrganisationName = tenantOrgDetail.OrganisationName,
                SetupJsonData = setupInfo
            });

            // Send email to tenant organisation email to inform of new record.
            await _notificationManager.SendNewTenantSetupToAdministratorAsync((Guid)_applicationUserId, tenantOrgDetail);
            // Send email to new super admin 1
            await _notificationManager.SendWelcomeEmailToNewSuperAdminAsync((Guid)_applicationUserId, tenantOrgDetail.SuperAdmin1FirstName, tenantOrgDetail.SuperAdmin1Email);
            // Send email to new super admin 2
            await _notificationManager.SendWelcomeEmailToNewSuperAdminAsync((Guid)_applicationUserId, tenantOrgDetail.SuperAdmin2FirstName, tenantOrgDetail.SuperAdmin2Email);

            return Ok(setupRecord);
        }

        [Route("fetch-available-languages")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult FetchAllLanguages()
        {
            return Ok(_localeService.GetAvailableLocale());
        }

        [Route("get-consent-for-portal")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult GetConsentForPortal([FromBody] PortalConsentModel input)
        {
            var language = _localeService.GetLocale(input.Locale);
            return Ok(_contentRepo.GetByValueKey("Consent", "name", input.Name, language.Id));
        }


    }
}
