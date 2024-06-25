using ECDLink.Abstractrions.Services;
using ECDLink.Core.Attributes;
using ECDLink.Core.Caching;
using ECDLink.Core.Caching.Configuration;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Core.Services
{
    public class SystemSetting<T> : ISystemSetting<T>
    {
        private readonly ICacheService<ITenantCache> _cacheService;
        private readonly ISystemSettingsService _settingsService;
        private readonly CachingSection.CachingItem _cachingConfig;

        private T _value;

        public T Value
        {
            get
            {
                if (_value == null)
                {
                    _value = GetSettings();
                }

                return _value;
            }
        }

        private Dictionary<string, string> SettingsCache
        {
            get
            {
                if (!_cacheService.Exists(CacheKeyConstants.SystemSettingCache))
                {
                    AssignSettingsCache();
                }

                return _cacheService.GetCacheItem<Dictionary<string, string>>(CacheKeyConstants.SystemSettingCache);
            }
        }

        public SystemSetting(ICacheService<ITenantCache> cacheService, ISystemSettingsService settingsService, IConfiguration configuration)
        {
            _cacheService = cacheService;
            _settingsService = settingsService;
            var cachingConfig = configuration.GetSection<CachingSection>(CachingSection.Name);
            _cachingConfig = new CachingSection.CachingItem();
            if (cachingConfig != null && cachingConfig.SystemSetting != null)
            {
                _cachingConfig.SlidingExpiration = cachingConfig.SystemSetting.SlidingExpiration;
                _cachingConfig.AbsoluteExpiration = cachingConfig.SystemSetting.AbsoluteExpiration;
            }
        }

        public T GetSettings(string settingsGroup)
        {
            if (!SettingsCache.TryGetValue(settingsGroup, out var cachedSettings))
            {
                return default;
            }

            return JsonConvert.DeserializeObject<T>(cachedSettings);
        }

        public T GetSettings()
        {
            var settingsGroup = typeof(T).GetCustomAttributes(typeof(SettingGroupAttribute), true).FirstOrDefault() as SettingGroupAttribute;

            if (string.IsNullOrWhiteSpace(settingsGroup?.SettingGroup))
            {
                return default;
            }

            if (!SettingsCache.TryGetValue(settingsGroup.SettingGroup, out var cachedSettings))
            {
                return default;
            }

            return JsonConvert.DeserializeObject<T>(cachedSettings);
        }

        private void AssignSettingsCache()
        {
            if (_cacheService.Exists(CacheKeyConstants.SystemSettingCache))
            {
                return;
            }

            var settings = _settingsService.GetSystemSettings();

            var cacheToAdd = new Dictionary<string, string>();

            foreach (var group in settings.GroupBy(x => x.Grouping))
            {

                var groupedSettings = group.ToDictionary(k => k.Name, v => v.Value);
                if (!cacheToAdd.Keys.Contains(group.Key))
                {
                    cacheToAdd.Add(group.Key, JsonConvert.SerializeObject(groupedSettings));
                }
            }

            var options = new MemoryCacheEntryOptions()
                .SetSize(1);
            if (_cachingConfig.SlidingExpiration > 0) options.SetSlidingExpiration(TimeSpan.FromSeconds(_cachingConfig.SlidingExpiration));
            if (_cachingConfig.AbsoluteExpiration > 0) options.SetAbsoluteExpiration(TimeSpan.FromSeconds(_cachingConfig.AbsoluteExpiration));
            _cacheService.SetCacheItem(CacheKeyConstants.SystemSettingCache, cacheToAdd, options);
        }

    }
}
