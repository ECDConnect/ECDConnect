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
       
    }
}
