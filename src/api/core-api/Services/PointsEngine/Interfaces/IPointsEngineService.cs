using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
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
        void UpdateUserSummaryPoints(string userId, PointsLibrary activity, DateTime today, bool isPrincipalOrAdmin = false, int? timeScored = null);
        List<PointsLibrary> GetPointsLibraryForActivity(string activity, string subActivity = null);
        List<PointsLibrary> GetPointsLibraryForTenant();
        List<PointsUserSummary> GetSummaryUserPoints(Guid userId, DateTime startDate, DateTime? endDate = null);
        List<PointsUserSummary> GetOldSummaryUserPoints(Guid userId, DateTime startDate, DateTime? endDate = null);        
        PointsUserSummary InsertIndividualSummaryUserPoints(PointsUserSummary input);
        PointsUserSummary UpdateIndividualSummaryUserPoints(PointsUserSummary input);

        // SS
        bool CalculateChildrenRegistrationAdd(string userId);
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

        /// <summary>
        /// Gets the percentile standing of a user within relative to others within the team/clinic
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        TeamStandingModel GetHealthCareWorkerTeamStanding(Guid userId);

        // Clubs
        bool CalculateHostFamilyDays(Guid clubId, string userId, DateTime today);
        bool CalculateMeetRegularly(Guid clubId, Guid clubMeetingId);
        bool CalculateBeCreative(Guid clubId, string userId, DateTime today);

        List<KeyValuePair<string, int>> GetClubMemberPointsTotals(Guid clubId, int year, int? month = null);

        List<KeyValuePair<string, int>> GetUserPointsTotals(List<Guid> userIds, int year, int? month = null);

        ClinicPointsModel GetPointsDetailsForClinic(Guid clinicId);
        LeagueClinicsModel GetLeagueWithClinicRankings(Guid leagueId, DateTime? quarterStart = null, DateTime? quarterEnd = null);
        List<LeagueClinicPointsModel> GetClinicRankingsForActivity(Guid pointsActivityId, Guid? pointsCategoryId, DateTime startDate, DateTime endDate);

        List<PointsPointsTodoItemModel> GetHealthCareWorkerPointsTodoItems(Guid healthCareWorkerId);
    }
}
