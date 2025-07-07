using ECDLink.Core.Models;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore;
using ECDLink.Core.Services.Interfaces;

namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{

    class DaysOff
    {
        public string date { get; set; }
    }

    public class HolidayApiServiceTask : INotificationTask
    {
        private readonly AuthenticationDbContext _context;

        public HolidayApiServiceTask(
            AuthenticationDbContext context)
        {
            _context = context;
        }

        public bool ShouldRunToday()
        {
            return true;
        }

        public async Task SendNotifications()
        {
            var currentYear = DateTime.UtcNow.Year;
            var endpoint = $"https://date.nager.at/api/v3/PublicHolidays/{currentYear}/ZA";

            var client = new RestClient(endpoint);
            var request = new RestRequest();
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Accept", "application/json");
            var response = await client.ExecuteAsync(request);

            if (response.ResponseStatus == ResponseStatus.Completed)
            {
                var holidays = JsonSerializer.Deserialize<IEnumerable<DaysOff>>(response.Content);

                if (holidays.Count() > 0) {
                    await _context.Holidays.ExecuteDeleteAsync();
                    await _context.SaveChangesAsync();
                }

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
