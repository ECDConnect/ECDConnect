using EcdLink.Api.CoreApi.Security.Models;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices.Marshalling;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EcdLink.Api.CoreApi.Tenancy.Api
{
    [Route("api/tenancy")]
    [Authorize]
    [ApiController]
    public class TenancyController : ControllerBase
    {
        private readonly ITenantService _tenantService;
        private readonly ITenantInitializeService _initializationService;

        public TenancyController(
            ITenantService tenantService,
            ITenantInitializeService initializationService)
        {
            _tenantService = tenantService;
            _initializationService = initializationService;
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

/*
#if DEBUG
        [AllowAnonymous]
        [HttpGet("seedTenant")]
        public IActionResult SeedTenant()
        {
            var result = _initializationService.SeedTenantWithTestData().Result;
            return Ok();
        }
#endif

        // POST api/<TenancyApi>
        [HttpPost]
        public IActionResult Post([FromBody] TenantModel model)
        {
            var addedTenant = _tenantService.AddTenant(model);

            TenantExecutionContext.SetTenant(addedTenant);

            if (!_initializationService.CreateTenantInstance(addedTenant))
            {
                return BadRequest();
            }

            return Ok();
        }

        // PUT api/<TenancyApi>/5
        // Migrates a tenant for now
        [HttpPut("{id}")]
        public IActionResult Put(string id)
        {
            var tenant = _tenantService.GetTenantById(id);

            if (tenant == null)
            {
                return BadRequest();
            }

            TenantExecutionContext.SetTenant(tenant);

            if (!_initializationService.MigrateTenantInstance(tenant))
            {
                return BadRequest();
            }

            return Ok();
        }
*/
    }
}
