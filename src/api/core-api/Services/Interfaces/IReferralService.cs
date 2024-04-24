using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IReferralService
    {
        List<PortalReferralsSummaryModel> GetReferralsSummary(
            Guid userId,
            List<Guid> clinicIds,
            DateTime startDate,
            DateTime endDate);

        IEnumerable<PortalReferralModel> GetReferrals(
            Guid userId,
            List<Guid> clinicIds,
            DateTime startDate,
            DateTime endDate);
    }
}