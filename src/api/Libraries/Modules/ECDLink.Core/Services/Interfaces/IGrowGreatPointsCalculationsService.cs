using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IGrowGreatPointsCalculationsService
    {
        void CalculatePregnantMomClientRegistration(Guid userId);
        void CalculateInfantClientRegistration(Guid userId);
        void CalculatePregnantMotherReferralPoints(Guid userId);
        void CalculateInfantVisitAndReferralPoints(Guid userId);
        void CalculatePregnantMotherVisitsCompletedPoints();
        void CalculateInfantVisitsCompletedPoints();
        void CalculateBreastFeedingClubPoints(Guid clinicId);
    }
}
