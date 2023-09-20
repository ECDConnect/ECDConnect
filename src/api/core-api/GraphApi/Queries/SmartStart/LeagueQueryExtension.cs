using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Api.CoreApi.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class LeagueQueryExtension
    {
        public LeagueQueryExtension()
        {
        }

        public List<LeagueClub> GetAllLeagues([Service] IClubService clubService, string userId)
        {
            return clubService.GetAllLeagues(userId);
        }


    }
}
