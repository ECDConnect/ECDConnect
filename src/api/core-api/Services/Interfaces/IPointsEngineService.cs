using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
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
        bool CalculateIncomeStatements(string userId, StatementsIncomeStatement lastStatement);
       

        // SS TODO: Pre-school fees on profile - development pending
        bool CalculatePreSchoolFees(string userId, DateTime today);

        /// <summary>
        /// Gets the percentile standing of a user within relative to others within the club
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        UserClubStandingModel GetUserClubStanding(string userId);
        // Clubs
        bool CalculateLeaveNoOneBehind(); // called from cron 30 Nov
        bool CalculateHostFamilyDays(Guid clubId, string userId, DateTime today);
        bool CalculateCompleteChildProgressReports(); // called from cron 31 July and 30 Nov
        bool CalculateMeetRegularly(Guid clubId, string userId, DateTime today);
        bool CalculateBeCreative(Guid clubId, string userId, DateTime today);

    }
}
