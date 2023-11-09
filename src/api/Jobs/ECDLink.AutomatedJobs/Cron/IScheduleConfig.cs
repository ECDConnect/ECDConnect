using System;

namespace ECDLink.AutomatedJobs.Cron
{
    public interface IScheduleConfigBase
    {
        string Name { get; set; }
        string CronExpression { get; set; }
        TimeZoneInfo TimeZoneInfo { get; set; }
        public bool TestMode { get; set; }
    }

    public interface IScheduleConfig<T> : IScheduleConfigBase
    {
    }
}
