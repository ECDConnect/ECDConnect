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
            Console.WriteLine("TenantCache:GetTenantByUrl: url={0}", url);
            foreach (var t in Tenants)
            {
                Console.WriteLine("TenantCache:GetTenantByUrl:AvailableTenant {0} {1}", t.Id, t.SiteAddress);
            }
            var tenants = Tenants.AsQueryable();
            var uri = new Uri((url.StartsWith("http:") || url.StartsWith("https:")) ? url : "http://" + url);
            if (!uri.IsDefaultPort)
            {
                var check = uri.Host + ":" + uri.Port.ToString();
                Console.WriteLine("TenantCache:GetTenantByUrl: url={0} check={1}", url, check);
                var portTenant = tenants
                        .Where(x => x.SiteAddress.Contains(check) || x.AdminSiteAddress.Contains(check) || x.TestSiteAddress.Contains(check) || x.AdminTestSiteAddress.Contains(check))
                        .OrderBy(x => x.Id)
                        .FirstOrDefault();
                if (portTenant != null)
                {
                    Console.WriteLine("TenantCache:GetTenantByUrl: url={0} check={1} found {2}", url, check, portTenant.Id);
                    return portTenant;
                }

            }
            var tenant = tenants
                    .Where(x => url.Contains(x.SiteAddress) || url.Contains(x.AdminSiteAddress) || url.Contains(x.TestSiteAddress) || url.Contains(x.AdminTestSiteAddress))
                    .OrderBy(x => x.Id)
                    .FirstOrDefault();
            if (tenant != null)
            {
                Console.WriteLine("TenantCache:GetTenantByUrl: url={0} found {1}", url, tenant.Id);
                return tenant;
            }
            Console.WriteLine("TenantCache:GetTenantByUrl: url={0} not found", url);
            return tenant;
        }

        public IEnumerable<TenantModel> GetAllTenants()
        {
            return Tenants;
        }
    }
}
