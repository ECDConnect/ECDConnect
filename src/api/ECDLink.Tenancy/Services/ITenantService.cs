using ECDLink.Tenancy.Model;
using System;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantService
    {
        public TenantInternalModel GetTenantByUrl(string url);
        public TenantInternalModel GetTenantByKey(string key);
        public TenantInternalModel UpdateTenantInfo(Guid? tenantId, TenantInfoInputModel input);
        public TenantInternalModel UpdateTenantThemePath(Guid? tenantId, string themePath);
        public bool ValidateNewTenantName(string applicationName);

    }
}
