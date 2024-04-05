using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IReferralService
    {
        List<PortalReferralsSummaryModel> GetReferralsSummaryForClinics(List<Guid> clinicIds, DateTime startDate, DateTime endDate);
        List<PortalReferralsSummaryModel> GetReferralsSummaryForTeamLead(Guid userId, DateTime startDate, DateTime endDate);
        List<PortalReferralModel> GetReferralsForTeamLead(Guid userId, DateTime startDate, DateTime endDate);

        List<PortalReferralModel> GetReferralsForClinics(List<Guid> clinicIds, DateTime startDate, DateTime endDate);

        IEnumerable<PortalReferralModel> GetReferrals(List<Guid> clinicIds, DateTime startDate, DateTime endDate);
    }
}