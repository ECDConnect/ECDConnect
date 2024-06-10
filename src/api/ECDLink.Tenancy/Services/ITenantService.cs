using ECDLink.Tenancy.Model;
using System.Collections.Generic;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantService
    {
        public TenantInternalModel GetTenantByUrl(string url);
        public TenantInternalModel GetTenantByKey(string key);
    }
}
