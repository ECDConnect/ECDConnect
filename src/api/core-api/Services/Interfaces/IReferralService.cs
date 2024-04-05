using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IReferralService
    {
        List<PortalReferralsSummaryModel> GetReferralsForClinics(List<Guid> clinicIds, DateTime startDate, DateTime endDate);
        List<PortalReferralsSummaryModel> GetReferralsForTeamLead(Guid userId, DateTime startDate, DateTime endDate);
    }
}