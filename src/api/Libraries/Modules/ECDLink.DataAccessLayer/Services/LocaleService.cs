using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.DataAccessLayer.Services
{
    public class LocaleService : ILocaleService<Language>
    {
        private readonly ICacheService<ITenantCache> _cacheService;
        private IDbContextFactory<AuthenticationDbContext> _dbFactory;

        public LocaleService(ICacheService<ITenantCache> cacheService, IDbContextFactory<AuthenticationDbContext> dbFactory)
        {
            _cacheService = cacheService;
            _dbFactory = dbFactory;
        }

        public Language GetLocale(string locale)
        {
            if (!_cacheService.Exists(CacheKeyConstants.LocaleCache))
            {
                CacheLanguages();
            }

            var cache = _cacheService.GetCacheItem<IEnumerable<Language>>(CacheKeyConstants.LocaleCache);

            var language = cache.Where(x => string.Equals(x.Locale, locale, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();

            return language;
        }

        public Language GetLocaleById(Guid localeId)
        {
            if (!_cacheService.Exists(CacheKeyConstants.LocaleCache))
            {
                CacheLanguages();
            }

            var cache = _cacheService.GetCacheItem<IEnumerable<Language>>(CacheKeyConstants.LocaleCache);

            var language = cache.Where(x => x.Id == localeId).FirstOrDefault();

            return language;
        }

        public IEnumerable<Language> GetAvailableLocale()
        {
            if (!_cacheService.Exists(CacheKeyConstants.LocaleCache))
            {
                CacheLanguages();
            }

            var cache = _cacheService.GetCacheItem<IEnumerable<Language>>(CacheKeyConstants.LocaleCache);

            return cache;
        }

        private void CacheLanguages()
        {
            using var context = _dbFactory.CreateDbContext();

            var languages = context.Languages.ToList();

            if (languages.Any())
            {
                _cacheService.SetCacheItem<IEnumerable<Language>>(CacheKeyConstants.LocaleCache, languages);
            }
        }
    }
}
