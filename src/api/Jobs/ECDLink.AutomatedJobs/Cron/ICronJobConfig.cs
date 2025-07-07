using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Cron
{
    public interface ICronJobConfig
    {
        public string Name { get; set; }
        public string Cron { get; set; }
        public TimeZoneInfo TimeZoneInfo { get; }
        public bool TestMode { get; }
        public int Enabled { get; set; }
        public string Tenants { get; set; }
    }
}
