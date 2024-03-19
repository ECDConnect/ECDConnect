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
                case 10:
                case 11:
                case 12:
                    return new DateTime(DateTime.Now.Year - 1, 10, 1);
                case 1:
                case 2:
                case 3:
                    return new DateTime(DateTime.Now.Year, 1, 1);
                case 4:
                case 5:
                case 6:
                    return new DateTime(DateTime.Now.Year, 4, 1);
                case 7:
                case 8:
                case 9:
                    return new DateTime(DateTime.Now.Year, 7, 1);
                default:
                    throw new ArgumentException();
            }
        }

        public static DateTime GetCurrentGrowGreatQuarterEnd()
        {
            switch (DateTime.Now.Month)
            {
                case 10:
                case 11:
                case 12:
                    return new DateTime(DateTime.Now.Year - 1, 12, 31, 11, 59, 59);
                case 1:
                case 2:
                case 3:
                    return new DateTime(DateTime.Now.Year, 3, 31, 11, 59, 59);
                case 4:
                case 5:
                case 6:
                    return new DateTime(DateTime.Now.Year, 6, 30, 11, 59, 59);
                case 7:
                case 8:
                case 9:
                    return new DateTime(DateTime.Now.Year, 9, 30, 11, 59, 59);
                default:
                    throw new ArgumentException();
            }
        }
    }
}
