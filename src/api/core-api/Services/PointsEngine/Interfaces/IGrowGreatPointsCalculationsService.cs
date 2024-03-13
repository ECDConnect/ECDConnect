using ECDLink.DataAccessLayer.Entities.Visits;
using System;

namespace EcdLink.Api.CoreApi.Services.PointsEngine.Interfaces
{
    public interface IGrowGreatPointsCalculationsService
    {
        void CalculatePregnantMomClientRegistration(Guid userId);
        void CalculateInfantClientRegistration(Guid userId);
        void CalculatePregnantMotherReferralPoints(Guid userId);
        void CalculateInfantVisitAndReferralPoints(Guid userId);

        //bool CalculatePregnantMomVisits(string userId, DateTime today);
        //bool CalculateInfantVisits(string userId, DateTime today);
        void CalculateBreastFeedingClubPoints(Guid clinicId);
    }
}
