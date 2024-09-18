using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Development.Holidays
{
    public class HolidayServiceOverride : IHolidayService<Holiday>
    {
        public IEnumerable<Holiday> GetHolidays(int year, string locale = "ZA")
        {
            var dateStrings = new[]
            {
                $"January 01, {DateTime.Now.Year}",
                $"January 02, {DateTime.Now.Year}",
                $"March 21, {DateTime.Now.Year}",                
                $"April 07, {DateTime.Now.Year}",
                $"April 10, {DateTime.Now.Year}",
                $"April 27, {DateTime.Now.Year}",
              //  $"May 01, {DateTime.Now.Year}",
                $"June 16, {DateTime.Now.Year}",
                $"August 09, {DateTime.Now.Year}",
                $"September 24, {DateTime.Now.Year}",
                //$"September 25, {DateTime.Now.Year}",
                $"December 16, {DateTime.Now.Year}",
                $"December 25, {DateTime.Now.Year}",
                $"December 26, {DateTime.Now.Year}",
            };

            var holidayList = new List<Holiday>();

            foreach (var holiday in dateStrings)
            {
                var holidayDateTime = DateTime.Parse(holiday);

                holidayList.Add(new Holiday
                {
                    Day = holidayDateTime
                });
            }

            return holidayList;
        }

        public IEnumerable<Holiday> GetHolidays(DateTime startMonth, DateTime endMonth, string locale = "ZA")
        {
            return GetHolidays(DateTime.Now.Year).Where(x => x.Day >= startMonth && x.Day <= endMonth);
        }
    }
}
