using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.AutomatedServiceWorkers.Util;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities;

namespace ECDLink.AutomatedServiceWorkers.ExpireInvitations
{
    public class ExpireInvitationsJob : BackgroundService
    {
        private readonly ILogger<ExpireInvitationsJob> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly HierarchyEngine _hierarchyEngine;

        public ExpireInvitationsJob(ILogger<ExpireInvitationsJob> logger, IServiceScopeFactory scopeFactory, IGenericRepositoryFactory repoFactory, HierarchyEngine hierarchyEngine)
        {
            _scopeFactory = scopeFactory;
            _repoFactory = repoFactory;
            _logger = logger;
            _hierarchyEngine = hierarchyEngine;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {

            return base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                var services = new ServiceCollection()
                    .AddLogging()
                    .AddSingleton<IReassignmentService, ReassignmentService>()
                    .BuildServiceProvider();

                int timingDelay = 60;//default

                var jobToRun = CronHelper.GetServiceJobs(_hierarchyEngine, _repoFactory, "ExpireInvitationsJob");

                using (var scope = _scopeFactory.CreateScope())
                {
                    foreach (var expiryJob in jobToRun)
                    {
                        expiryJob.StartTime = DateTime.Now;
                        timingDelay = int.Parse(expiryJob.TimingDelay);
                        CronHelper.SetTenantContext(scope, expiryJob.TenantId.ToString());

                        var invitationService = scope.ServiceProvider.GetRequiredService<IReassignmentService>();
                        invitationService.ExpireRelationshipLinks();

                        CronHelper.UpdateServiceJobResults(_hierarchyEngine, _repoFactory, expiryJob);
                    }
                }

                await Task.Delay(TimeSpan.FromHours(timingDelay), stoppingToken);
            }
       
        }
    }
}
