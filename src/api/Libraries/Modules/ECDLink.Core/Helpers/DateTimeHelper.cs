using ECDLink.Core.Extensions;
using System;

namespace ECDLink.Core.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime GetDateFromEpoch(long unixTimeStamp)
        {
            var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTimeVal = dateTimeVal.AddSeconds(unixTimeStamp).ToUniversalTime();

            return dateTimeVal;
        }


        public static DateTime GetCurrentGrowGreatQuarterStart()
        {
            switch (DateTime.Now.Month)
            {
                case 11:
                case 12:
                    return new DateTime(DateTime.Now.Year, 11, 1);
                case 1:
                    return new DateTime(DateTime.Now.Year - 1, 11, 1);
                case 2:
                case 3:
                case 4:
                    return new DateTime(DateTime.Now.Year, 2, 1);
                case 5:
                case 6:
                case 7:
                    return new DateTime(DateTime.Now.Year, 5, 1);
                case 8:
                case 9:
                case 10:
                    return new DateTime(DateTime.Now.Year, 8, 1);
                default:
                    throw new ArgumentException();
            }
        }

        public static DateTime GetCurrentGrowGreatQuarterEnd()
        {
            switch (DateTime.Now.Month)
            {
                case 11:
                case 12:
                    return new DateTime(DateTime.Now.Year + 1, 2, 1).GetEndOfMonth(); // End of month to handle leap years
                case 1:
                    return new DateTime(DateTime.Now.Year, 2, 1).GetEndOfMonth();
                case 2:
                case 3:
                case 4:
                    return new DateTime(DateTime.Now.Year, 4, 30);
                case 5:
                case 6:
                case 7:
                    return new DateTime(DateTime.Now.Year, 7, 31);
                case 8:
                case 9:
                case 10:
                    return new DateTime(DateTime.Now.Year, 10, 31);
                default:
                    throw new ArgumentException();
            }
        }
    }
}
