using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;

namespace ECDConnect.WorkerService.Integration;

public sealed class IntegrationDataSyncProcessingService : IScopedProcessingService
{
    private int _executionCount;
    private readonly ILogger<IntegrationDataSyncProcessingService> _logger;
    private readonly IGenericRepositoryFactory _repoFactory;
    private AuthenticationDbContext _dbContext;
    private IIntegrationService _integrationService;
    public IntegrationDataSyncProcessingService(
        ILogger<IntegrationDataSyncProcessingService> logger, IGenericRepositoryFactory repoFactory, AuthenticationDbContext dbContext,[Service] IIntegrationService integrationService)//, [Service] IDbContextFactory<AuthenticationDbContext> dbFactory
    {
        _logger = logger;
        _repoFactory = repoFactory;
        _dbContext = dbContext;
        _integrationService = integrationService;
    }

    public async Task DoWorkAsync(CancellationToken stoppingToken, IServiceScope scope)
    {
        var adminId = "c7f3ac46-dc54-4915-a01d-8bc673d3f6f6";// _hierarchyEngine.GetAdminUserId();
        int timingDelay = 5;// 60;

        while (!stoppingToken.IsCancellationRequested)
        {
            //TenantExecutionContext.SetTenant();
            SetTenantContext(scope);
            ++_executionCount;

            _logger.LogInformation(
                "{ServiceName} working, execution count: {Count}",
                nameof(IntegrationDataSyncProcessingService),
                _executionCount);


            // SetTenantContext(scope);
            //var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();
            //var dbRepo = _repoFactory.CreateGenericRepository<IntegrationLog>(CustomScope: context, userContext: adminId);
            var schedules = _dbContext.ServiceScheduler.ToList();
            await _integrationService.IntegrationUpdates();
            //var logs = dbRepo.GetAll().FirstOrDefault();
            //_logger.LogInformation(logs.TenantId.ToString());
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




            await Task.Delay(10_000, stoppingToken);
        }
    }

    private void SetTenantContext(IServiceScope scope)
    {
        var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

        var tenant = tenancyRepo.GetAllTenants()
            .Where(x => x.TenantType == ECDLink.Tenancy.Enums.TenantType.Tenant)
            .OrderBy(x => x.Id)
            .FirstOrDefault();

        TenantExecutionContext.SetTenant(tenant);
    }


}
