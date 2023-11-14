using System;

namespace ECDLink.AutomatedJobs.Cron
{
    public class ScheduleConfig<T> : IScheduleConfig<T>
    {
        public string Name { get; set; }
        public string CronExpression { get; set; }
        public TimeZoneInfo TimeZoneInfo { get; set; }
        public bool TestMode {  get; set; }
    }
}
