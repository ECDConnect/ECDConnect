using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class DailyNotificationRunner : CronJobService
{
    public DailyNotificationRunner(IServiceScopeFactory scopeFactory, CronJobConfig<DailyNotificationRunner> config, ILogger<DailyNotificationRunner> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var notificationTasks = GetServices<INotificationTask>();

        var runningTasks = new List<Task>();
        foreach (var notificationTask in notificationTasks)
        {
            _logger.Log(LogLevel.Information, $"Running notification task: {notificationTask.GetType().Name}");

            if (notificationTask.ShouldRunToday())
            {
                var task = notificationTask.SendNotifications();
                runningTasks.Add(task);
            }
        }        
        await Task.WhenAll(runningTasks);
    }
}
