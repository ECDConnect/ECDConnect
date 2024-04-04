using System;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Jobs.Integration
{
    public class IntegrationJobService : CronJobService
    {
        private readonly List<MethodInfo> _integrationMethods;

        public IntegrationJobService(IServiceScopeFactory scopeFactory, IntegrationJobServiceConfig config, ILogger<IntegrationJobService> logger)
                : base(scopeFactory, config, logger)
        {
            _integrationMethods = new List<MethodInfo>();
            var serviceType = typeof(IIntegrationService);
            foreach (var method in config.Options.Methods) 
            {
                var mi = serviceType.GetMethod(method);
                if (mi == null)
                {
                    logger.LogError("CronJobs: {0} Unknown Method {1}", _name, method);
                }
                else
                {
                    this._integrationMethods.Add(mi);
                    logger.LogInformation("CronJobs: {0} Task {1}: {2}", _name, this._integrationMethods.Count, method);
                }
            }
            
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var service = Scope.ServiceProvider.GetRequiredService<IIntegrationService>();
            if (service != null && service.Enabled)
            {
                foreach (var mi in this._integrationMethods)
                {
                    try
                    {
                        _logger.LogInformation("CronJobs: {0} Work {1} Start", _name, mi.Name);
                        var task = (Task)mi.Invoke(service, null);
                        await task;
                        _logger.LogInformation("CronJobs: {0} Work {1} End", _name, mi.Name);
                    }
                    catch (Exception ex)
                    {
                        try
                        {
                            _logger.LogInformation("CronJobs: {0} Work {1} Start", _name, mi.Name);
                            var task = (Task)mi.Invoke(service, null);
                            await task;
                            _logger.LogInformation("CronJobs: {0} Work {1} End", _name, mi.Name);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "CronJobs: {0} Work {1} Failed: {2}", _name, mi.Name, ex.Message);
                        }
                    }
                }
            }
        }
    }
}