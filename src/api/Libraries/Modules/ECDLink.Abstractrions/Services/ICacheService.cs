using Microsoft.Extensions.Caching.Memory;

namespace ECDLink.Abstractrions.Services
{
    public interface ICacheService<Provider>
    {
        void SetCacheItem<T>(string key, T collection, MemoryCacheEntryOptions options = null);

        T GetCacheItem<T>(string key);

        void FlushCache(string key);

        bool Exists(string key);
    }
}
