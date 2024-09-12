using ECDLink.Core.Caching.Configuration;
using ECDLink.Core.Extensions;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace ECDLink.PostgresTenancy.Caching
{
    public class CachedTenantService : ITenantService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly TenantService _tenantService;
        private static readonly object addCacheLock = new object();
        private readonly CachingSection.CachingItem _cachingConfig;
        private readonly ILogger<CachedTenantService> _logger;

        public CachedTenantService(TenantService tenantService, IMemoryCache memoryCache, IConfiguration configuration, ILogger<CachedTenantService> logger)
        {
            _memoryCache = memoryCache;
            _tenantService = tenantService;
            var cachingConfig = configuration.GetSection<CachingSection>(CachingSection.Name);
            _cachingConfig = new CachingSection.CachingItem();
            if (cachingConfig != null && cachingConfig.Tenant != null)
            {
                _cachingConfig.SlidingExpiration = cachingConfig.Tenant.SlidingExpiration;
                _cachingConfig.AbsoluteExpiration = cachingConfig.Tenant.AbsoluteExpiration;
            }
            _logger = logger;
            //_logger.LogInformation("SlidingExpiration={0} AbsoluteExpiration={1}", _cachingConfig.SlidingExpiration, _cachingConfig.AbsoluteExpiration);
        }

        private string CacheKeyWithKey(string key)
        {
            return "Tenant|" + key;
        }

        private string CacheKeyWithSiteAddress(string siteAddress)
        {
            return "Tenant|" + siteAddress;
        }

        private string CacheKey(Guid tenantId, string siteAddress)
        {
            return string.Format("Tenant|{0}|{1}", tenantId.ToString(), siteAddress);
        }

        private void AddToCache(TenantInternalModel tenant)
        {
            var options = new MemoryCacheEntryOptions()
                .SetSize(1);
            if (_cachingConfig.SlidingExpiration > 0) options.SetSlidingExpiration(TimeSpan.FromSeconds(_cachingConfig.SlidingExpiration));
            if (_cachingConfig.AbsoluteExpiration > 0) options.SetAbsoluteExpiration(TimeSpan.FromSeconds(_cachingConfig.AbsoluteExpiration));

            _memoryCache.Set(CacheKey(tenant.Id, tenant.SiteAddress), tenant, options);
            _memoryCache.Set(CacheKeyWithSiteAddress(tenant.SiteAddress), tenant, options);
            if (!string.IsNullOrEmpty(tenant.SiteAddress2) && tenant.SiteAddress2 != "none") _memoryCache.Set(CacheKeyWithSiteAddress(tenant.SiteAddress2), tenant, options);
            if (!string.IsNullOrEmpty(tenant.AdminSiteAddress) && tenant.AdminSiteAddress != "none") _memoryCache.Set(CacheKeyWithSiteAddress(tenant.AdminSiteAddress), tenant, options);
            if (!string.IsNullOrEmpty(tenant.TestSiteAddress) && tenant.TestSiteAddress != "none") _memoryCache.Set(CacheKeyWithSiteAddress(tenant.TestSiteAddress), tenant, options);
            if (!string.IsNullOrEmpty(tenant.AdminTestSiteAddress) && tenant.AdminTestSiteAddress != "none") _memoryCache.Set(CacheKeyWithSiteAddress(tenant.AdminTestSiteAddress), tenant, options);
        }

        public TenantInternalModel GetTenantByKey(string key) // key=TenantId|SiteAddress
        {
            _logger.LogDebug("GetTenantByClaim: {0}", key);
            var tenant = _memoryCache.Get<TenantInternalModel>(CacheKeyWithKey(key));
            if (tenant == null)
            {
                lock (addCacheLock)
                {
                    tenant = _memoryCache.Get<TenantInternalModel>(CacheKeyWithKey(key));
                    if (tenant == null)
                    {
                        var parts = key.Split('|');
                        if (parts.Length > 0)
                        {
                            _logger.LogDebug("GetTenantByClaim: {0} - query", key);
                            tenant = _tenantService.GetTenantById(Guid.Parse(parts[0]), parts[1]).FirstOrDefault();
                            if (tenant != null) AddToCache(tenant);
                        }
                    }
                }
            }
            return tenant;
        }

        public TenantInternalModel GetTenantByUrl(string url)
        {
            var uri = new Uri((url.StartsWith("http:") || url.StartsWith("https:")) ? url : "http://" + url);
            var siteAddress = uri.IsDefaultPort ? uri.Host : string.Format("{0}:{1}", uri.Host, uri.Port);
            _logger.LogDebug("GetTenantByUrl: {0}", siteAddress);
            var tenant = _memoryCache.Get<TenantInternalModel>(CacheKeyWithSiteAddress(siteAddress));
            if (tenant == null)
            {
                lock (addCacheLock)
                {
                    tenant = _memoryCache.Get<TenantInternalModel>(CacheKeyWithSiteAddress(siteAddress));
                    if (tenant == null)
                    {
                        _logger.LogDebug("GetTenantByUrl: {0} - query", siteAddress);
                        tenant = _tenantService.GetTenantBySiteAddress(siteAddress).FirstOrDefault();
                        if (tenant != null) AddToCache(tenant);
                    }
                }
            }
            return tenant;
        }

        public TenantInternalModel UpdateTenantInfo(Guid? tenantId, TenantInfoInputModel input)
        {
            var result = _tenantService.UpdateTenantInfo(tenantId, input);
            if (result == null) return null;
            AddToCache(result);
            return result;
        }

        public TenantInternalModel UpdateTenantThemePath(Guid? tenantId, string themePath)
        {
            var result = _tenantService.UpdateTenantThemePath(tenantId, themePath);
            if (result == null) return null;
            //AddToCache(result);
            return result;
        }

        public bool ValidateNewTenantName(string applicationName)
        {
            return _tenantService.ValidateNewTenantName(applicationName);
        }
    }
}
