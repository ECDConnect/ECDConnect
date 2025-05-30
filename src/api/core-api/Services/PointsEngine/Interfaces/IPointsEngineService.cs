using EcdLink.Api.CoreApi.GraphApi.Models.Points;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using System;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsEngineService
    {
        List<PointsUserSummary> GetSummaryUserPoints(Guid userId, DateTime startDate, DateTime? endDate = null);
        PointsToDoItemModel GetPointsTodoItems(Guid userId);
        List<PointsActivity> GetPointActivities();
        PointsUserYearMonthSummary GetYearPointsView(Guid userId);
        PointsUserDateSummary GetSharedData(Guid userId, bool isMonthly);
        void CalculateChildAttendanceRegisterSaved(Guid userId);
        void CalculateChildRegistrationComplete(Guid childUserId);
        void CalculateChildRemovedFromPreschool(Guid userId);
        void CalculateThemePlanned(Guid userId);
        void CalculateNoThemePlanned(Guid userId);
        void CalculateAddNewPractitionerToPreschool(Guid userId);
        void CalculateAddNewClassToPreschool(Guid userId);
        void CalculateDownloadIncomeStatement(Guid userId);
        void CalculateAddExpenseOrIncomeToStatement(Guid userId);
        void CalculatePreschoolFeesGreaterThan0ForEachChild();
        void CalculateCompleteChildProgressObservations(Guid userId);
        void CalculateCreateChildProgressReport(Guid userId);
        void CalculateDownloadPreschoolOrClassProgressSummary(Guid userId);
        void CalculateCompleteOnlineTrainingCourse(Guid userId);
        void CalculateAddingShortDescription(Guid userId);
        void CalculateCompleteCommunityProfile(Guid userId);
        void CalculateConnectWithAnotherUser(Guid userId);
    }
}
