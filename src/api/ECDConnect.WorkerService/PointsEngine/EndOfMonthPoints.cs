using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using HotChocolate;

namespace ECDConnect.WorkerService.Notifications;

public class EndOfMonthPoints : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private IPointsEngineService _pointsEngineService;

    public EndOfMonthPoints(
        IServiceScopeFactory scopeFactory,
        IScheduleConfig<EndOfMonthPoints> config,
        [Service] IPointsEngineService pointsEngineService)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
        _pointsEngineService = pointsEngineService;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            SetTenantContext(scope);

            var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();

            DateTime today = DateTime.Now.Date;

            if (today.Date == today.GetEndOfMonth().Date)
            {
                List<HealthCareWorker> hcWorkers = dbContext.HealthCareWorkers.Where(x => x.IsActive).ToList();
                foreach (var item in hcWorkers)
                {
                    _pointsEngineService.UpdateUserSummaryPoints(item.Id.ToString(), today);
                }
            }
            dbContext.SaveChanges();
        }
    }

    // TODO: Convert to multi-tenancy jobs
    // Single Tenant for now
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
