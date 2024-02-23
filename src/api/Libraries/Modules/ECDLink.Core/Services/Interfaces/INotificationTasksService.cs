using System;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface INotificationTasksService
    {
        //daily
        public Task DailyUnassignedClassesNotification();
        Task DailyChildrenRegistrationsIncompleteNotification();
        Task DailyChildrenNotAssignedToClassNotification();
        //Task DailyUnassignedProgrammesNotification();
        Task DailyAttendanceNotTrackedNotification();
        Task CoachChecksNotification(bool weeklyChecksOnly = false);
        Task WeeklyCoachTraineesCheckReminderAsync();
        //other
        Task MonthlyStatementsReminderAsync();
        Task WeeklyAttendancesReminderAsync();
        Task ProgressReportsReminderAsync();
        Task YearlyPreschoolFeeReminderAsync();
        //Task MonthlyStartupSupportEndReminderAsync();
        Task MonthlyPlanningReminderAsync();
        Task MonthlyAttendanceSLSyncAsync();
        Task SelfAssessmentReminderAsync();
        Task MonthlyTopPointsEarnerNotification();
        Task MonthlyEarnMorePointsNotification();
        Task YearlyPointsSummaryNotification();
    }
}
