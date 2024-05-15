using ECDLink.Tenancy.Model;
using System.Threading.Tasks;

namespace ECDLink.Tenancy.Services
{
    public interface ITenantInitializeService
    {
        public bool CreateTenantInstance(TenantInternalModel tenant);

        public bool MigrateTenantInstance(TenantInternalModel tenant);
        public Task<bool> SeedTenantWithTestData();
    }
}
