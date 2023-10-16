using ECDLink.DataAccessLayer.Entities.PointsEngine;
using System;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPointsEngineService
    {

        // Points library
        List<PointsLibrary> GetPointsLibraryForActivity(string activity);
        List<PointsLibrary> GetPointsLibraryForTenant();
        List<PointsUser> GetIndividualUserPoints(Guid pointsLibraryId, string userId, int month, int year);
        List<PointsUserSummary> GetSummaryUserPoints(string userId, DateTime startDate, DateTime? endDate = null);
        PointsUser InsertIndividualUserPoints(PointsUser input);
        PointsUser UpdateIndividualUserPoints(PointsUser input);
        PointsUserSummary InsertIndividualSummaryUserPoints(PointsUserSummary input);
        PointsUserSummary UpdateIndividualSummaryUserPoints(PointsUserSummary input);

        bool UpdateUserSummaryPoints(string userId, DateTime today);

        // GG
        bool CalculatePregnantMomClientRegistration(string userId, DateTime today);
        bool CalculateInfantClientRegistration(string userId, DateTime today);
        bool CalculatePregnantMomVisits(string userId, DateTime today);
        bool CalculateInfantVisits(string userId, DateTime today);

        // GG TODO: Team points - development pending

        // SS
        bool CalculateChildrenRegistrationAdd(string userId, DateTime today);
        bool CalculateChildrenRegistrationRemoval(string userId, DateTime today);
        bool CalculateAttendanceSubmitted(string userId, DateTime today);
        bool CalculateIncomeStatements(string userId, DateTime today);
        bool CalculateIncomeStatementsSubmitted(string userId, DateTime today);
        bool CalculateIncomeStatementPreSchoolFees(string userId, DateTime today);
        bool CalculateThreeConsecutiveIncomeStatementsSubmitted(string userId, DateTime today);

        // SS TODO: Pre-school fees on profile - development pending

    }
}
