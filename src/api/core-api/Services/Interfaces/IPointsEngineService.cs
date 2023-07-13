using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        // SS - TODO

        // Schedular for monthly and yearly calculations
        Task<DateTime> GetLastRunTime(string task);
        Task<ServiceScheduler> GetTaskResults(string task);
    }
}
