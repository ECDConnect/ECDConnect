using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcdLink.Api.CoreApi.Tenancy.Api
{
    [Route("api/tenancy")]
    [Authorize]
    [ApiController]
    public class TenancyController : ControllerBase
    {
        public TenancyController()
        {
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
            return new OkObjectResult(new TenantModelAPI(tenant));
        }
    }
}
