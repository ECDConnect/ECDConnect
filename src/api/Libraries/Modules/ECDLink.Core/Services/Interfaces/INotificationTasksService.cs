using System;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationTasksService
    {
        //daily
        Task MonthlyTopPointsEarnerNotification();
        Task MonthlyEarnMorePointsNotification();
        Task YearlyPointsSummaryNotification();
        Task DailyUserOfflineNotification();
    }
}
