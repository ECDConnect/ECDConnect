using ECDLink.Abstractrions.Enums;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Jobs;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Notifications
{
    public class RequestLogOnNotification : CronJobService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public RequestLogOnNotification(IServiceScopeFactory scopeFactory, IScheduleConfig<RequestLogOnNotification> config)
            : base(config.CronExpression, config.TimeZoneInfo)
        {
            _scopeFactory = scopeFactory;
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                TenancyContext.SetTenantContext(scope);

                var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();

                var twoOne = DateTime.UtcNow.AddDays(-21).Date;
                var threeZero = DateTime.UtcNow.AddDays(-30).Date;

                var practitioners = dbContext.Practitioners
                                            .Include(x => x.User)
                                            .Where(x => x.IsActive)
                                            .Where(x => x.User.LastSeen.Date.Equals(twoOne) || x.User.LastSeen.Date.Equals(threeZero))
                                            .ToList();

                var existingNotifications = dbContext.JobNotifications
                                                .Where(x => x.TemplateType == TemplateTypeEnum.ThreeWeekNotLoggedOn
                                                || x.TemplateType == TemplateTypeEnum.FourWeekNotLoggedOn)
                                                .ToList();

                foreach (var practitioner in practitioners)
                {
                    // If an existing notification exists
                    if (existingNotifications.Any(x => string.Equals(x.UserId, practitioner.UserId)))
                    {
                        continue;
                    }

                    if (practitioner.User.LastSeen.Date == twoOne)
                    {
                        dbContext.JobNotifications.Add(new JobNotification
                        {
                            UserId = practitioner.UserId,
                            UserLastSeen = practitioner.User.LastSeen,
                            Protocol = practitioner.User.ContactPreference,
                            TemplateType = TemplateTypeEnum.ThreeWeekNotLoggedOn
                        });

                        continue;
                    }

                    if (practitioner.User.LastSeen.Date == threeZero)
                    {
                        dbContext.JobNotifications.Add(new JobNotification
                        {
                            UserId = practitioner.UserId,
                            UserLastSeen = practitioner.User.LastSeen,
                            Protocol = practitioner.User.ContactPreference,
                            TemplateType = TemplateTypeEnum.FourWeekNotLoggedOn
                        });

                        continue;
                    }
                }

                dbContext.SaveChanges();
            }
        }
    }
}
