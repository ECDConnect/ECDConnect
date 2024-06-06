using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace ECDLink.Tenancy.Cache
{
    public class TenantMemoryCacheWrapper : ITenantCache, ICacheService<ITenantCache>
    {
        private readonly IMemoryCache _memoryCache;
        private readonly MemoryCacheEntryOptions _cacheEntryOptions;

        private object GetCacheKey(string key)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;

            return new
            {
                Key = key,
                TenantId = tenantId
            };
        }

        public TenantMemoryCacheWrapper(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;

            _cacheEntryOptions = new MemoryCacheEntryOptions()
              .SetSize(1)                                   // Set size of current item
              .SetAbsoluteExpiration(TimeSpan.FromDays(30));
        }

        public void SetCacheItem<T>(string key, T collection, MemoryCacheEntryOptions options = null)
        {
            _memoryCache.Set(GetCacheKey(key), collection, options != null ? options : _cacheEntryOptions);
        }

        public T GetCacheItem<T>(string key)
        {
            if (_memoryCache.TryGetValue(GetCacheKey(key), out T collection))
            {
                return collection;
            }

            return default(T);
        }

        public bool Exists(string key)
        {
            return _memoryCache.TryGetValue(GetCacheKey(key), out var cache);
        }

        public void FlushCache(string key)
        {
            _memoryCache.Remove(GetCacheKey(key));
        }
    }
}
