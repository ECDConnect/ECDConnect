using ECDLink.Tenancy.Model;
using System.Collections.Generic;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantService
    {
        public TenantInternalModel GetTenantById(string Id);

        public TenantInternalModel GetTenantByUrl(string url);

        public TenantInternalModel AddTenant(TenantInternalModel model);

        public IEnumerable<TenantInternalModel> GetAllTenants();
    }
}
