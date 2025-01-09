using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
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

        public HolidayServiceOverride(AuthenticationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Holiday> GetHolidays(int year, string locale = "ZA")
        {
            return GetHolidaysAsync(year, locale).Result;
        }

        public IEnumerable<Holiday> GetHolidays(DateTime startMonth, DateTime endMonth, string locale = "ZA")
        {
            return GetHolidaysAsync(DateTime.Now.Year).Result.Where(x => x.Day >= startMonth && x.Day <= endMonth);
        }

        public async Task<IEnumerable<Holiday>> GetHolidaysAsync(int year, string locale = "ZA")
        {
            var currentMonth = DateTime.Now.Month;
            var holidaysToUpdate = await _context.Holidays
                .Where(x => x.CheckedDate.Month != currentMonth)
                .ToListAsync();

            if (!await _context.Holidays.AnyAsync() || holidaysToUpdate.Any())
            {
                await FetchAndUpdateHolidaysAsync();
            }

            return await _context.Holidays
                .Where(x => x.Day.Year == year && x.Locale == locale)
                .ToListAsync();
        }

        public async Task FetchAndUpdateHolidaysAsync()
        {
            var currentYear = DateTime.UtcNow.Year;

            // Remove holidays from previous years
            await _context.Holidays
                .Where(h => h.Day.Year < currentYear)
                .ExecuteDeleteAsync();

            var endpoint = $"https://date.nager.at/api/v3/PublicHolidays/{currentYear}/ZA";

            var client = new RestClient(endpoint);
            var request = new RestRequest();
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Accept", "application/json");
            var response = await client.ExecuteAsync(request);

            if (response.ResponseStatus == ResponseStatus.Completed)
            {
                var holidays = JsonSerializer.Deserialize<IEnumerable<DaysOff>>(response.Content);

                var newHolidays = holidays
                    .Select(h => new Holiday
                    {
                        Day = DateTime.Parse(h.date),
                        CheckedDate = DateTime.Now,
                        Locale = "ZA"
                    });

                await _context.Holidays.AddRangeAsync(newHolidays);
                await _context.SaveChangesAsync();
            }
        }
    }
}
