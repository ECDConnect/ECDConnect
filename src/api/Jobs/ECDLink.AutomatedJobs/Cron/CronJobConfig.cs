using System;

namespace ECDLink.AutomatedJobs.Cron
{
    public class CronJobConfig<T> : ICronJobConfig
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Cron { get; set; }
        public string TimeZone { get; set; }
        public string Tenants { get; set; }
        public TimeZoneInfo TimeZoneInfo
        {
            get
            {
                return this.TimeZone.ToLower() == "utc" ? TimeZoneInfo.Utc : TimeZoneInfo.Local;
            }
        }
        public bool TestMode
        {
            get
            {
                return this.Enabled == 2;
            }
        }
        public int Enabled { get; set; }
        public string OptionsType { get; set; }
    }
}
