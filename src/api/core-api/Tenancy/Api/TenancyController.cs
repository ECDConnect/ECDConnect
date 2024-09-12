using ECDLink.DataAccessLayer.Managers;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Tenancy.Api
{
    [Route("api/tenancy")]
    [Authorize]
    [ApiController]
    public class TenancyController : ControllerBase
    {

        private readonly ApplicationRoleManager _roleManager;

        public TenancyController([Service] ApplicationRoleManager roleManager)
        {
            _roleManager = roleManager;
        }

        [AllowAnonymous]
        [HttpGet("current")]
        public IActionResult GetCurrent()
        {
            var internalModel = TenantExecutionContext.Tenant;
            TenantModel tenant = null;
            if (internalModel == null)
            {
                tenant = new TenantModel();
            }
            else
            {
                tenant = new TenantModel(internalModel);
            }

            // Add tenant role name for coach if module for coach is enabled
            if (tenant.Modules != null && tenant.Modules.CoachRoleEnabled)
            {
                var coachRole = _roleManager.Roles.Where(x => x.SystemName == "Coach").FirstOrDefault();
                tenant.Modules.CoachRoleName = coachRole.TenantName;
            }

            var model = new TenantModelAPI(tenant);
            if (!string.IsNullOrEmpty(tenant.SiteAddress2))
            {
                string url = this.HttpContext.Request.Headers.Referer;
                if (!string.IsNullOrEmpty(url)) url = this.HttpContext.Request.Headers.Origin;
                var uri = new Uri((url.StartsWith("http:") || url.StartsWith("https:")) ? url : "http://" + url);
                var siteAddress = uri.IsDefaultPort ? uri.Host : string.Format("{0}:{1}", uri.Host, uri.Port);
                if (siteAddress == tenant.SiteAddress2) model.SiteAddress = tenant.SiteAddress2;
            }

            return new OkObjectResult(model);
        }
    }
}
