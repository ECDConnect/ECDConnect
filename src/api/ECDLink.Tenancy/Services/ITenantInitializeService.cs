using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantInitializeService
    {
        public bool CreateTenantInstance(TenantModel tenant);

        public bool MigrateTenantInstance(TenantModel tenant);
        public Task<bool> SeedTenantWithTestData();
    }
}
