using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ECDLink.Core.Services
{
    public class HolidayService : IHolidayService<Holiday>
    {
        private readonly ISystemSetting<RapidApiOptions> _options;
        private readonly ICacheService<ITenantCache> _cacheService;
        private HttpClient _holidayClient;

        private Dictionary<int, IEnumerable<Holiday>> HolidayCache
        {
            get
            {
                if (!_cacheService.Exists(CacheKeyConstants.HolidayCache))
                {
                    _cacheService.SetCacheItem(CacheKeyConstants.HolidayCache, new Dictionary<int, IEnumerable<Holiday>>());
                }

                return _cacheService.GetCacheItem<Dictionary<int, IEnumerable<Holiday>>>(CacheKeyConstants.HolidayCache);
            }
        }

        private HttpClient HolidayClient
        {
            get
            {
                if (_holidayClient == null)
                {
                    _holidayClient = new HttpClient();

                    _holidayClient.BaseAddress = new Uri(_options.Value.BaseUrl);
                    _holidayClient.DefaultRequestHeaders.Add("x-rapidapi-host", _options.Value.Host);
                    _holidayClient.DefaultRequestHeaders.Add("x-rapidapi-key", _options.Value.Key);
                }

                return _holidayClient;
            }
        }

        public HolidayService(ISystemSetting<RapidApiOptions> options, ICacheService<ITenantCache> cacheService)
        {
            _options = options;
            _cacheService = cacheService;
        }

        public IEnumerable<Holiday> GetHolidays(int year, string locale = "ZA")
        {
            if (HolidayCache.TryGetValue(year, out var existingHolidays))
            {
                return existingHolidays;
            }

            var param = $"{year}/{locale}";

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Get, param);

            var response = HolidayClient.SendAsync(request).Result;

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException();
            }

            var holidays = GetHolidaysFromResponseAsync(response).Result;

            CacheHoliday(year, holidays);

            return holidays;
        }

        private void CacheHoliday(int year, IEnumerable<Holiday> holidays)
        {
            HolidayCache.Add(year, holidays);

            _cacheService.SetCacheItem(CacheKeyConstants.HolidayCache, HolidayCache);
        }

        public IEnumerable<Holiday> GetHolidays(DateTime startDate, DateTime endDate, string locale = "ZA")
        {
            var startYear = startDate.Year;
            var endYear = endDate.Year;

            var yearsHolidays = new List<Holiday>();

            for (int i = startYear; i <= endYear; i++)
            {
                yearsHolidays.AddRange(GetHolidays(i));
            }

            var holidays = yearsHolidays.Where(x => x.Day >= startDate && x.Day <= endDate).ToList();

            return holidays;
        }

        private async Task<IEnumerable<Holiday>> GetHolidaysFromResponseAsync(HttpResponseMessage response)
        {
            try
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();

                var responseString = await response.Content.ReadAsStringAsync();

                var holidays = JsonConvert.DeserializeObject<IEnumerable<Holiday>>(responseString);

                return holidays;
            }
            catch (Exception e)
            {
                // TODO: Log error
                Console.WriteLine(e);

                return new List<Holiday>();
            }
        }
    }
}
