using System;
using System.Collections.Generic;

namespace ECDLink.Abstractrions.Services
{
    public interface IHolidayService<T>
    {
        IEnumerable<T> GetHolidays(int year, string locale = "ZA");

        IEnumerable<T> GetHolidays(DateTime startMonth, DateTime endMonth, string locale = "ZA");
    }
}
