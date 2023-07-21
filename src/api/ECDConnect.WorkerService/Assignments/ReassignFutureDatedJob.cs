//using ECDLink.AutomatedJobs.Cron;

//namespace ECDConnect.WorkerService.Assignments;

//public class ReassignFutureDatedJob : CronJobService
//{
//    private readonly IServiceScopeFactory _scopeFactory;

//    public ReassignFutureDatedJob(IServiceScopeFactory scopeFactory, IScheduleConfig<ReassignFutureDatedJob> config)
//        : base(config.CronExpression, config.TimeZoneInfo)
//    {
//        _scopeFactory = scopeFactory;
//    }

//    public override async Task DoWork(CancellationToken cancellationToken)
//    {
//        using (var scope = _scopeFactory.CreateScope())
//        {
//            //                var anonChildService = scope.ServiceProvider.GetRequiredService<IChildrenAnonymiseService>();

//            //anonChildService.AnonymiseChild();

//            //AssignFutureAbsentees //settle Future dated absentees first
//        }
//    }
//}
