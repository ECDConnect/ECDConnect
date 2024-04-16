using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.GraphQL.Attributes;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface ILeagueService
    {
        void AddLeagues(List<LeagueInputModel> input);
        LeagueSetupModel GetLeagueSetup();
        List<PortalLeagueModel> GetLeagues(string searchString, Guid? districtId = null, PagedQueryInput pagingInput = null);
        LeagueWithRankingsModel GetLeague(Guid leagueId, DateTime startDate, DateTime endDate);

        void AddClinicToLeague(Guid leagueId, Guid clinicId);
        void EditLeague(Guid leagueId, string name, List<Guid> clinicsToAdd, List<Guid> clinicsToRemove);
        void DeleteLeague(Guid leagueId);
    }
}