namespace ECDLink.Abstractrions.Services
{
    public interface ICacheService<Provider>
    {
        void SetCacheItem<T>(string key, T collection);

        T GetCacheItem<T>(string key);

        void FlushCache(string key);

        bool Exists(string key);
    }
}
