using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IWLPointsEngineService
    {
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
