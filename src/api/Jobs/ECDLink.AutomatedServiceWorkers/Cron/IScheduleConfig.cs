using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.AutomatedJobs.Cron
{
    public interface IScheduleConfig<T>
    {
        string CronExpression { get; set; }
        TimeZoneInfo TimeZoneInfo { get; set; }
    }
}
