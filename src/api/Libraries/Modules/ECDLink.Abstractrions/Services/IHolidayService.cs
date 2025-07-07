using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Abstractrions.Services
{
    public interface IHolidayService<T>
    {
        IEnumerable<T> GetHolidays(int year, string locale = "ZA");

        /// <summary>
        /// Return public holidays between the given dates
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <param name="locale">Region to fetch holidays for</param>
        /// <returns></returns>
        IEnumerable<T> GetHolidays(DateTime startDate, DateTime endDate, string locale = "ZA");
    }
}
