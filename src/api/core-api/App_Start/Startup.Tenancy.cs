using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.PostgresTenancy.Caching;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Cache;
using ECDLink.Tenancy.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EcdLink.Api.CoreApi
{
    public partial class Startup
    {
        private void ConfigureTenancy(IServiceCollection services)
        {
            services.AddTransient<ICacheService<ITenantCache>, TenantMemoryCacheWrapper>();
            services.AddScoped<TenantService>();
            services.AddScoped<ITenantService, CachedTenantService>();
        }
    }
}
