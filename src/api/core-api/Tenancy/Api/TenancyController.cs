using ECDLink.DataAccessLayer.Managers;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

            return new OkObjectResult(new TenantModelAPI(tenant));
        }
    }
}
