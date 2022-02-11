using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantInitializeService
    {
        public bool CreateTenantInstance(TenantModel tenant);

        public bool MigrateTenantInstance(TenantModel tenant);
    }
}
