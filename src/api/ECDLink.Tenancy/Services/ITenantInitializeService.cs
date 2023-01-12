using ECDLink.Tenancy.Model;
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
