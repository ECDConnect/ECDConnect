using ECDLink.Abstractrions.Services;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace ECDLink.Core.Caching
{
    public class MemoryCacheWrapper : IGlobalCache, ICacheService<IGlobalCache>
    {
        private readonly IMemoryCache _memoryCache;
        private readonly MemoryCacheEntryOptions _cacheEntryOptions;

        public MemoryCacheWrapper(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;

            _cacheEntryOptions = new MemoryCacheEntryOptions()
              .SetSize(1)                                   // Set size of current item
              .SetAbsoluteExpiration(TimeSpan.FromDays(30));
        }

        public void SetCacheItem<T>(string key, T collection, MemoryCacheEntryOptions options = null)
        {
            _memoryCache.Set(key, collection, options != null ? options : _cacheEntryOptions);
        }

        public T GetCacheItem<T>(string key)
        {
            if (_memoryCache.TryGetValue(key, out T collection))
            {
                return collection;
            }

            return default(T);
        }

        public bool Exists(string key)
        {
            return _memoryCache.TryGetValue(key, out var cache);
        }

        public void FlushCache(string key)
        {
            _memoryCache.Remove(key);
        }
    }
}
