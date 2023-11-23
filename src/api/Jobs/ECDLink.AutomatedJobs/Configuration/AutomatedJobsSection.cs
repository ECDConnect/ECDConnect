using System.Collections.Generic;

namespace ECDLink.AutomatedJobs.Configuration
{
    public class AutomatedJobsSection
    {
        public static string Name = "AutomatedJobs";
        public static string JobsName = "AutomatedJobs:Jobs";
        public static string JobNamePrefix = "AutomatedJobs:Jobs:";
        public int Enabled { get; set; }
    }
}
