using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface ILeagueService
    {
        void AddLeagues(List<LeagueInputModel> input);
        LeagueSetupModel GetLeagueSetup();
    }
}