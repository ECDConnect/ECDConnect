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
        Task CoachChecksTraineeNotification(bool weeklyChecksOnly = false);
        Task CoachChecksPractitionersNotification(bool weeklyChecksOnly = false);
        //other
        Task MonthlyStatementsReminderAsync();
        Task WeeklyAttendancesReminderAsync();
        Task ProgressReportsReminderAsync();
        Task YearlyPreschoolFeeReminderAsync();
        //Task MonthlyStartupSupportEndReminderAsync();
        Task MonthlyPlanningReminderAsync();
        Task MonthlyAttendanceSLSyncAsync();
        Task SelfAssessmentReminderAsync();
        Task SelfAssessmentReminderNewAsync();
        Task MonthlyTopPointsEarnerNotification();
        Task MonthlyEarnMorePointsNotification();
        Task YearlyPointsSummaryNotification();
        Task DailyUserOfflineNotification();
        Task DailyAttendanceSMSNotification();
    }
}
