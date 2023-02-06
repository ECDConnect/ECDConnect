using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EcdLink.Api.CoreApi.Tenancy.Api
{
    [Route("api/tenancy")]
    //[BasicAuth]
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
    }
}
