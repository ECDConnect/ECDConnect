using ECDLink.AutomatedJobs.Configuration;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Reflection;

namespace ECDLink.AutomatedJobs
{
    public static class AutomatedJobsStartup
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration config)
        {
            var automatedJobsSection = config.GetSection<AutomatedJobsSection>(AutomatedJobsSection.Name);
            if (automatedJobsSection.Enabled == 0)
            {
                Console.WriteLine("CronJobs: Disabled");
                return;
            }

            var jobNames = config.GetSection(AutomatedJobsSection.JobsName).AsEnumerable()
                .Where(x => x.Key.StartsWith(AutomatedJobsSection.JobNamePrefix) && x.Value == null && !x.Key.Substring((AutomatedJobsSection.JobNamePrefix).Length).Contains(":"))
                .Select(x => x.Key)
                .ToList();

            Console.WriteLine("CronJobs: Enabled [{0}]{1}", jobNames.Count,automatedJobsSection.Enabled == 2 ? " TESTMODE" : "");
            foreach (var jobConfigPath in jobNames)
            {
                var jobName = jobConfigPath.Substring((AutomatedJobsSection.JobNamePrefix).Length);
                var typeName = config.GetValue<string>(jobConfigPath + ":Type");
                Type jobType = Type.GetType(typeName, false);
                if (jobType == null)
                {
                    Console.WriteLine("CronJobs: {0} NOT Registered.  Unknown type {1}", jobName, typeName);
                    continue;
                }

                var optionsTypeName = config.GetValue<string>(jobConfigPath + ":OptionsType");
                MethodInfo getSectionMethod = null;
                Type optionsType = null;
                if (string.IsNullOrWhiteSpace(optionsTypeName))
                {
                    optionsType = typeof(CronJobConfig<>).MakeGenericType(Type.GetType(typeName, false));
                    getSectionMethod = typeof(ECDLink.Core.Extensions.ConfigurationExtensions).GetMethod("GetSection").MakeGenericMethod(optionsType);
                }
                else
                {
                    optionsType = Type.GetType(optionsTypeName, false);
                    getSectionMethod = typeof(ECDLink.Core.Extensions.ConfigurationExtensions).GetMethod("GetSection").MakeGenericMethod(optionsType);
                }
                var jobConfig = (ICronJobConfig)getSectionMethod.Invoke(null, new object[] { config, jobConfigPath });
                jobConfig.Name = jobName;
                if (jobConfig.Enabled == 0)
                {
                    Console.WriteLine("CronJobs: {0} Disabled", jobName);
                    continue;
                }
                jobConfig.Enabled = automatedJobsSection.Enabled == 2 ? 2 : jobConfig.Enabled;

                //var addCronJobMethod = typeof(CronServiceExtensions).GetMethod("AddCronJob").MakeGenericMethod(jobType, optionsType);
                //addCronJobMethod.Invoke(null, new object[] { services, jobConfig });

                var loggerType = typeof(Microsoft.Extensions.Logging.ILogger<>).MakeGenericType(jobType);
                services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService>(sp => {
                    var service = (Microsoft.Extensions.Hosting.IHostedService)Activator.CreateInstance(
                        jobType, 
                        sp.GetService<IServiceScopeFactory>(),
                        jobConfig,
                        sp.GetService(loggerType)
                    );
                    return service;
                });
            }
        }
    }
}
