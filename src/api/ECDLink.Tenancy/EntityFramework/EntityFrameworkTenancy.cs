using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Tenancy.EntityFramework
{
    public class EntityFrameworkTenancy
    {
        private readonly ITenantService _tenantService;
        private readonly ITenantInitializeService _tenantInitializeService;

        public EntityFrameworkTenancy(
            ITenantService tenantService,
            ITenantInitializeService tenantInitializeService)
        {
            _tenantService = tenantService;
            _tenantInitializeService = tenantInitializeService;
        }

        public void MigrateTenants()
        {
            var tenants = _tenantService.GetAllTenants();

            foreach (var tenant in tenants)
            {
                _tenantInitializeService.CreateTenantInstance(tenant);
            }
        }
    }
}
