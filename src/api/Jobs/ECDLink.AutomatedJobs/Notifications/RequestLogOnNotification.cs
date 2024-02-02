using ECDLink.Abstractrions.Enums;
using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Jobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Notifications
{
    public class RequestLogOnNotification : CronJobService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public RequestLogOnNotification(IServiceScopeFactory scopeFactory, CronJobConfig<RequestLogOnNotification> config, ILogger<RequestLogOnNotification> logger)
            : base(config, logger)
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

                var users = dbContext.Users.Where(x => x.IsActive)
                                            .Where(x => x.LastSeen.Date == twoOne || x.LastSeen.Date == threeZero)
                                            .ToList();

                var existingNotifications = dbContext.JobNotifications
                                                .Where(x => x.TemplateType == TemplateTypeEnum.ThreeWeekNotLoggedOn
                                                || x.TemplateType == TemplateTypeEnum.FourWeekNotLoggedOn)
                                                .ToList();

                foreach (var user in users)
                {
                    // If an existing notification exists
                    if (existingNotifications.Any(x => x.UserId == user.Id))
                    {
                        continue;
                    }

                    //do larger age first so taht user does not get too many messages
                    if (user.LastSeen.Date <= threeZero)
                    {
                        dbContext.JobNotifications.Add(new JobNotification
                        {
                            UserId = user.Id,
                            UserLastSeen = user.LastSeen,
                            Protocol = user.ContactPreference,
                            TemplateType = TemplateTypeEnum.FourWeekNotLoggedOn,
                            TenantId = user.TenantId,
                            InsertedDate = DateTime.UtcNow
                        });

                        continue;
                    }

                    //make sure user doesnt get notification fopr 30 and 21
                    if (existingNotifications.Any(x => x.UserId == user.Id))
                    {
                        continue;
                    }

                    if (user.LastSeen.Date <= twoOne) { 
                        dbContext.JobNotifications.Add(new JobNotification
                        {
                            UserId = user.Id,
                            UserLastSeen = user.LastSeen,
                            Protocol = user.ContactPreference,
                            TemplateType = TemplateTypeEnum.ThreeWeekNotLoggedOn,
                            TenantId = user.TenantId,
                            InsertedDate = DateTime.UtcNow
                        });

                        continue;
                    }

                }

                dbContext.SaveChanges();
            }
        }
    }
}
