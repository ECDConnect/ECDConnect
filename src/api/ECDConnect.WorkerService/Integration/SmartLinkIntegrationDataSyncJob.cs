using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using Microsoft.Extensions.DependencyInjection;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;

namespace ECDConnect.WorkerService.SmartLinkIntegrationDataSyncJob;

public class SmartLinkIntegrationDataSyncJob : BackgroundService
{
    private readonly ILogger<SmartLinkIntegrationDataSyncJob> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IGenericRepositoryFactory _repoFactory;
    //private readonly HierarchyEngine _hierarchyEngine;

    public SmartLinkIntegrationDataSyncJob(ILogger<SmartLinkIntegrationDataSyncJob> logger, IServiceScopeFactory scopeFactory, IGenericRepositoryFactory repoFactory) //, HierarchyEngine hierarchyEngine
    {
        _scopeFactory = scopeFactory;
        _repoFactory = repoFactory;
        _logger = logger;
        //_hierarchyEngine = hierarchyEngine;
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {

        return base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running via integration at: {time}", DateTimeOffset.Now);
            await Task.Delay(1000, stoppingToken);
            //List<int> AllowedDays = new List<int>() { 27, 28, 29, 30, 31 };

            //if (!AllowedDays.Contains(DateTime.Today.Day)) return;
            var services = new ServiceCollection()
                .AddLogging()
                //.AddSingleton<IReassignmentService, ReassignmentService>()
                .BuildServiceProvider();

            var adminId = "c7f3ac46-dc54-4915-a01d-8bc673d3f6f6";// _hierarchyEngine.GetAdminUserId();
            int timingDelay = 5;// 60;

            //run the Payment Processor
            using (var scope = _scopeFactory.CreateScope())
            {
               // SetTenantContext(scope);

                var dbRepo = _repoFactory.CreateGenericRepository<IntegrationLog>(userContext: adminId);
                var logs = dbRepo.GetAll().FirstOrDefault();
                _logger.LogInformation(logs.TenantId.ToString());
                //dbRepo.Insert(new IntegrationLog() { Id = Guid.NewGuid(), InsertedDate = DateTime.Now, IsActive = true, LogNotes = "Tast Started", LogResult = "OK", UserId = adminId });
                //var dbRepo = _repoFactory.CreateGenericRepository<ServiceScheduler>(userContext: adminId);
                //var datasyncJobs = dbRepo.GetAll().Where(x => x.Name == "SmartLinkIntegrationDataSync").ToList();
                //foreach (var datasyncJob in datasyncJobs)
                //{
                //    datasyncJob.StartTime = DateTime.Now;
                //    timingDelay = int.Parse(datasyncJob.TimingDelay);
                //    CronHelper.SetTenantContext(scope, datasyncJob.TenantId.ToString());

                //    var invitationService = scope.ServiceProvider.GetRequiredService<IReassignmentService>();

                //    invitationService.ExpireRelationshipLinks();

                //    datasyncJob.Results = "Success";
                //    datasyncJob.EndTime = DateTime.Now;
                //    dbRepo.Update(datasyncJob);
                //}
                //dbRepo.Insert(new IntegrationLog() { Id = Guid.NewGuid(), InsertedDate = DateTime.Now, IsActive = true, LogNotes = "Tast Ended", LogResult = "OK", UserId = adminId });
            }

            await Task.Delay(TimeSpan.FromMinutes(timingDelay), stoppingToken);
        }
   
    }
}
