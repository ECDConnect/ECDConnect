using System.Collections.Generic;

namespace ECDLink.AutomatedJobs.Configuration
{
    public class AutomatedJobsSection
    {
        public class Job
        {
            public string Name { get; set; }
            public string Type { get; set; }
            public string Cron { get; set; }
            public string TimeZone { get; set; }
            public int Enabled { get; set; }
        }

        public static string Name = "AutomatedJobs";
        public int Enabled { get; set; }
        public List<Job> Jobs { get; set; }
    }
}
