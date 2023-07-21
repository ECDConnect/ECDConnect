//using ECDLink.AutomatedJobs.Cron;
//using ECDLink.Core.Services.Interfaces;
//using ECDLink.PostgresTenancy.Services;
//using ECDLink.Tenancy.Context;

//namespace ECDConnect.WorkerService.Anonymise;

//public class ChildAnonymiseJob : CronJobService
//{
//    private readonly IServiceScopeFactory _scopeFactory;

//    public ChildAnonymiseJob(IServiceScopeFactory scopeFactory, IScheduleConfig<ChildAnonymiseJob> config)
//        : base(config.CronExpression, config.TimeZoneInfo)
//    {
//        _scopeFactory = scopeFactory;
//    }

//    public override async Task DoWork(CancellationToken cancellationToken)
//    {
//        using (var scope = _scopeFactory.CreateScope())
//        {
//            SetTenantContext(scope);

//            var anonChildService = scope.ServiceProvider.GetRequiredService<IChildrenAnonymiseService>();

//            anonChildService.AnonymiseChild();
//        }
//    }

//    // TODO: Convert to multi-tenancy jobs
//    //Single Tenant for now
//    private void SetTenantContext(IServiceScope scope)
//    {
//        var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

//        var tenant = tenancyRepo.GetAllTenants()
//            .Where(x => x.TenantType == ECDLink.Tenancy.Enums.TenantType.Tenant)
//            .OrderBy(x => x.Id)
//            .FirstOrDefault();

//        TenantExecutionContext.SetTenant(tenant);
//    }
//}
