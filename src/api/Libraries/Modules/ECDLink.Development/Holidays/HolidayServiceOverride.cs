using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace ECDLink.Development.Holidays
{
    class DaysOff
    {
        public string date { get; set; }
    }

    public class HolidayServiceOverride : IHolidayService<Holiday>
    {
        public IEnumerable<Holiday> GetHolidays(int year, string locale = "ZA")
        {
            var holidayList = new List<Holiday>();

            var endpoint = "https://date.nager.at/api/v3/PublicHolidays";
            endpoint = $"{endpoint}/{year}/{locale}";

            var client = new RestClient(endpoint);
            var request = new RestRequest();
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Accept", "application/json");
            var response = client.Execute(request);
            if (response.ResponseStatus == ResponseStatus.Completed)
            {
                var holidayDays =  JsonSerializer.Deserialize<IEnumerable<DaysOff>>(response.Content).ToList();
                
                foreach (var holiday in holidayDays)
                {
                    var holidayDateTime = DateTime.Parse(holiday.date);
                    holidayList.Add(new Holiday
                    {
                        Day = holidayDateTime
                    });
                }

             } 
            else
            {
                var dateStrings = new[]
                {
                    $"January 01, {DateTime.Now.Year}",
                    $"March 21, {DateTime.Now.Year}",                
                   // $"April 07, {DateTime.Now.Year}", Good Friday -  determined according to the ecclesiastical moon
                   // $"April 10, {DateTime.Now.Year}", Family Day -  determined according to the ecclesiastical moon
                    $"April 27, {DateTime.Now.Year}",
                    $"May 01, {DateTime.Now.Year}",
                    $"June 16, {DateTime.Now.Year}",
                    $"August 09, {DateTime.Now.Year}",
                    $"September 24, {DateTime.Now.Year}",
                    $"December 16, {DateTime.Now.Year}",
                    $"December 25, {DateTime.Now.Year}",
                    $"December 26, {DateTime.Now.Year}",
                };

                foreach (var holiday in dateStrings)
                {
                    var holidayDateTime = DateTime.Parse(holiday);

                    holidayList.Add(new Holiday
                    {
                        Day = holidayDateTime
                    });

                    // If holiday falls on a Sunday, we add the monday as well.
                    if (holidayDateTime.DayOfWeek == DayOfWeek.Sunday)
                    {
                        var mondayHoliday = new DateTime(holidayDateTime.Year, holidayDateTime.Month, holidayDateTime.Day + 1);
                        holidayList.Add(new Holiday
                        {
                            Day = mondayHoliday
                        });
                    }
                }
            }
            return holidayList;
        }
        

        public IEnumerable<Holiday> GetHolidays(DateTime startMonth, DateTime endMonth, string locale = "ZA")
        {
            return GetHolidays(DateTime.Now.Year).Where(x => x.Day >= startMonth && x.Day <= endMonth);
        }
    }
}
