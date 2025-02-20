using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace ECDLink.Core.Extensions
{
    public static class DateTimeExtensions
    {
        public static int GetWeekOfYear(this DateTime date)
        {
            CultureInfo ciCurr = CultureInfo.CurrentCulture;

            return ciCurr.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFullWeek, DayOfWeek.Sunday);
        }

        public static IEnumerable<DateTime> DaysBetween(this DateTime start, DateTime dateTo)
        {
            return Enumerable.Range(0, dateTo.AddDays(1).Subtract(start).Days)
                           .Select(d => start.AddDays(d));
        }

        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }

        public static DateTime GetStartOfMonth(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, 1);
        }
        public static DateTime GetStartOfPreviousMonth(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, 1).AddMonths(-1);
        }
        public static DateTime GetStartOfNextMonth(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, 1).AddMonths(1);
        }

        public static DateTime GetStartOfYear(this DateTime date)
        {
            return new DateTime(date.Year, 1, 1);
        }

        public static DateTime GetEndOfYear(this DateTime date)
        {
            return new DateTime(date.Year, 12, 31);
        }

        public static DateTime GetEndOfMonth(this DateTime date)
        {
            var start = date.GetStartOfMonth();

            return start.AddMonths(1).AddDays(-1);
        }
        public static DateTime GetEndOfDay(this DateTime date)
        {
            var start = date.Date;

            return start.AddDays(1).AddSeconds(-1);
        }


        public static DateTime GetEndOfPreviousMonth(this DateTime date)
        {

            var start = GetStartOfPreviousMonth(date);

            return start.AddMonths(1).AddDays(-1);
        }

        public static bool IsInSameMonth(this DateTime date, DateTime? compareMonth)
        {
            if (!compareMonth.HasValue)
            {
                return false;
            }

            if (date.Year == compareMonth?.Year && date.Month == compareMonth?.Month)
            {
                return true;
            }

            return false;
        }

        public static bool IsTenDaysUntilMonthEnd(this DateTime date)
        {
            var nextMonth = date.AddMonths(1).GetStartOfMonth();

            var dateDiff = nextMonth - date;

            return dateDiff.Days == 10;
        }

        public static bool IsSevenDaysUntilMonthEnd(this DateTime date)
        {
            var nextMonth = date.AddMonths(1).GetStartOfMonth();

            var dateDiff = nextMonth - date;

            return dateDiff.Days == 7;
        }

        public static bool IsLastDayOfMonth(this DateTime date)
        {
            return DateTime.Now.Date == DateTime.Now.GetEndOfMonth().Date;
        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        public static long ToEpochTime(this DateTime date)
        {
            var baseDate = new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero);

            var dateDifferent = date.ToUniversalTime() - baseDate;

            return (long)Math.Round(dateDifferent.TotalSeconds);
        }

        public static bool IsWeekend(this DateTime date)
        {
            return new[] {DayOfWeek.Sunday, DayOfWeek.Saturday}.Contains(date.DayOfWeek);
        }
    }
}
