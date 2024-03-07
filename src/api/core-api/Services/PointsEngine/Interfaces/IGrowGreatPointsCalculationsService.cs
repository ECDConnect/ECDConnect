using System;

namespace EcdLink.Api.CoreApi.Services.PointsEngine.Interfaces
{
    public interface IGrowGreatPointsCalculationsService
    {
        bool CalculatePregnantMomClientRegistration(string userId, DateTime today);
        bool CalculateInfantClientRegistration(string userId, DateTime today);
        bool CalculatePregnantMomVisits(string userId, DateTime today);
        bool CalculateInfantVisits(string userId, DateTime today);
        void CalculateBreastFeedingClubPoints(Guid clinicId);
    }
}
