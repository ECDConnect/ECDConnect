using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantService
    {
        public TenantModel GetTenantById(string Id);

        public TenantModel GetTenantByUrl(string url);

        public TenantModel AddTenant(TenantModel model);

        public IEnumerable<TenantModel> GetAllTenants();
    }
}
