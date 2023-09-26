using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.PostgresTenancy.Caching
{
    public class TenantCache : ITenantService
    {
        private readonly ICacheService<IGlobalCache> _cacheService;
        private readonly TenantService _tenantService;
        private static readonly object assignCacheLock = new object();

        private List<TenantModel> Tenants
        {
            get
            {
                if (!_cacheService.Exists(CacheKeyConstants.TenantCache))
                {
                    _cacheService.SetCacheItem(CacheKeyConstants.TenantCache, new List<TenantModel>());
                }

                return _cacheService.GetCacheItem<List<TenantModel>>(CacheKeyConstants.TenantCache);
            }
        }

        public TenantCache(ICacheService<IGlobalCache> cacheService, TenantService tenantService)
        {
            _cacheService = cacheService;
            _tenantService = tenantService;
            AssignCache();
        }

        private void AssignCache()
        {
            lock (assignCacheLock)
            {
                if (_cacheService.Exists(CacheKeyConstants.TenantCache))
                {
                    return;
                }

            var tenants = _tenantService.GetAllTenants().ToList();
            _cacheService.SetCacheItem(CacheKeyConstants.TenantCache, tenants);

            }
        }

        public TenantModel AddTenant(TenantModel model)
        {
            var tenant = _tenantService.AddTenant(model);

            Tenants.Add(tenant);

            _cacheService.SetCacheItem(CacheKeyConstants.TenantCache, Tenants);

            return tenant;
        }

        public TenantModel GetTenantById(string id)
        {
            var tenant = Tenants.Where(x => x.Id == Guid.Parse(id));
            return tenant.FirstOrDefault();
        }

        public TenantModel GetTenantByUrl(string url)
        {
            var tenants = Tenants.AsQueryable();
            var uri = new Uri((url.StartsWith("http:") || url.StartsWith("https:")) ? url : "http://" + url);
            if (!uri.IsDefaultPort)
            {
                var check = uri.Host + ":" + uri.Port.ToString();
                var portTenant = tenants
                        .Where(x => x.SiteAddress.Contains(check) || x.AdminSiteAddress.Contains(check) || x.TestSiteAddress.Contains(check) || x.AdminTestSiteAddress.Contains(check))
                        .OrderBy(x => x.Id)
                        .FirstOrDefault();
                if (portTenant != null)
                {
                    return portTenant;
                }

            }
            var tenant = tenants
                    .Where(x => url.Contains(x.SiteAddress) || url.Contains(x.AdminSiteAddress) || url.Contains(x.TestSiteAddress) || url.Contains(x.AdminTestSiteAddress))
                    .OrderBy(x => x.Id)
                    .FirstOrDefault();
            return tenant;
        }

        public IEnumerable<TenantModel> GetAllTenants()
        {
            return Tenants;
        }
    }
}
