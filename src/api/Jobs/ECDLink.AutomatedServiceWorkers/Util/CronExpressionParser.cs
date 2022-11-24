using Cronos;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.AutomatedJobs.Util
{
    public static class CronExpressionParser
    {
        public static DateTimeOffset? NextOccurance(string cronTag)
        {
            var expression = CronExpression.Parse(cronTag);

            return expression.GetNextOccurrence(DateTimeOffset.Now, TimeZoneInfo.Local);
        }
    }
}
