using ECDLink.DataAccessLayer.Context;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDConnect.WorkerService;

public sealed class ScopedBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ScopedBackgroundService> _logger;

    public ScopedBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<ScopedBackgroundService> logger) =>
        (_serviceProvider, _logger) = (serviceProvider, logger);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            $"{nameof(ScopedBackgroundService)} is running.");

        await DoWorkAsync(stoppingToken);
    }

    private async Task DoWorkAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            $"{nameof(ScopedBackgroundService)} is working.");

        using (IServiceScope scope = _serviceProvider.CreateScope())
        {
            SetTenantContext(scope);
            IScopedProcessingService scopedProcessingService =
                scope.ServiceProvider.GetRequiredService<IScopedProcessingService>();

            //var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();

            await scopedProcessingService.DoWorkAsync(stoppingToken, scope);
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            $"{nameof(ScopedBackgroundService)} is stopping.");

        await base.StopAsync(stoppingToken);
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
