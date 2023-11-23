using ECDLink.AutomatedJobs.Cron;

namespace ECDLink.AutomatedJobs.Jobs.Integration
{
    public class IntegrationJobServiceConfig : CronJobConfig<IntegrationJobService>
    {
        public class OptionsConfig
        {
            public string[] Methods { get; set; }
        }

        public OptionsConfig Options { get; set; }
    }
}
