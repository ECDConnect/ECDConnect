using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.Development.Holidays
{
    class DaysOff
    {
        public string date { get; set; }
    }

    public class HolidayServiceOverride : IHolidayService<Holiday>
    {
        private readonly AuthenticationDbContext _context;
        private readonly Dictionary<(DateTime startMonth, DateTime endMonth, string locale), IEnumerable<Holiday>> _holidayMonthCache = new Dictionary<(DateTime, DateTime, string), IEnumerable<Holiday>>();
        private readonly Dictionary<(int year, string locale), IEnumerable<Holiday>> _holidayYearCache = new Dictionary<(int, string), IEnumerable<Holiday>>();

        public HolidayServiceOverride(AuthenticationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Holiday> GetHolidays(int year, string locale = "ZA")
        {
            var cacheKey = (year, locale);
            if (_holidayYearCache.TryGetValue(cacheKey, out var cachedHolidays))
            {
                return cachedHolidays;
            }
            
            var holidays = GetHolidaysAsync(year, locale).Result;
            _holidayYearCache[cacheKey] = holidays;
            return holidays;
        }

        public IEnumerable<Holiday> GetHolidays(DateTime startMonth, DateTime endMonth, string locale = "ZA")
        {
            var cacheKey = (startMonth, endMonth, locale);
            if (_holidayMonthCache.TryGetValue(cacheKey, out var cachedHolidays))
            {
                return cachedHolidays;
            }
            
            var holidays = GetHolidaysAsync(DateTime.Now.Year).Result.Where(x => x.Day >= startMonth && x.Day <= endMonth);
            _holidayMonthCache[cacheKey] = holidays;
            return holidays;
        }

        public async Task<IEnumerable<Holiday>> GetHolidaysAsync(int year, string locale = "ZA")
        {
            return await _context.Holidays
                .Where(x => x.Day.Year == year && x.Locale == locale)
                .Distinct()
                .ToListAsync();
        }

    }
}
