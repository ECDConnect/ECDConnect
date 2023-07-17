using ECDLink.DataAccessLayer.Entities.PointsEngine;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsEngineService
    {

        // Points library
        List<PointsLibrary> GetPointsLibraryForActivity(string activity);
        List<PointsLibrary> GetPointsLibraryForTenant();
        List<PointsUser> GetIndividualUserPoints(string subActivity, string userId, int month, int year);
        List<PointsUserSummary> GetSummaryUserPoints(string userId, int year);
        PointsUser InsertIndividualUserPoints(PointsUser input);
        PointsUser UpdateIndividualUserPoints(PointsUser input);
        PointsUserSummary InsertIndividualSummaryUserPoints(PointsUserSummary input);
        PointsUserSummary UpdateIndividualSummaryUserPoints(PointsUserSummary input);

        // GG
        bool ManagePregnantMomClientRegistration(string userId);
        bool ManageInfantClientRegistration(string userId);
        bool ManagePregnantMomVisits(string userId);
        bool ManageInfantVisits(string userId);
        bool UpdateUserSummaryPoints(string userId);

        // GG TODO: Team points - development pending

        // SS
        bool AddChildrenRegistration(string userId);
        bool RemoveChildrenRegistration(string userId);
        bool ManageAttendanceSubmitted(string userId);
        bool ManageIncomeStatementsSubmitted(string userId);
        bool ManageIncomeStatementPreSchoolFees(string userId);
        bool ManageThreeConsecutiveIncomeStatementsSubmitted(string userId);

        // SS TODO: Pre-school fees - development pending

    }
}
