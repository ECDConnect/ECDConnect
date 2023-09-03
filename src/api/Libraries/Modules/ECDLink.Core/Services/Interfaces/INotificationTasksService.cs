using System;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationTasksService
    {
        //daily
        public Task DailyUnassignedClassesNotification();
        Task DailyChildrenRegistrationsIncompleteNotification();
        Task Daily3WeekLogonCheck();
        Task DailyChildrenNotAssignedToClassNotification();
        Task DailyUnassignedProgrammesNotification();
        Task DailyAttendanceNotTrackedNotification();

        //other
        Task MonthlyStatementsReminderAsync();
        Task WeeklyAttendancesReminderAsync();
        Task ProgressReportsReminderAsync();
        Task YearlyPreschoolFeeReminderAsync();
        Task MonthlyStartupSupportEndReminderAsync();
        Task MonthlyPlanningReminderAsync();

    }
}
