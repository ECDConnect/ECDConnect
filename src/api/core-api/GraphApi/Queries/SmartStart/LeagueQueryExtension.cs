using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Api.CoreApi.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class LeagueQueryExtension
    {
        public LeagueQueryExtension()
        {
        }

        public List<LeagueClubsModel> GetLeaguesForCoach([Service] IClubService clubService, string coachUserId)
        {
            return clubService.GetLeaguesForCoach(coachUserId).ToList();
        }

        public LeagueClubsModel GetLeagueForUser([Service] IClubService clubService, string userId)
        {            
            return clubService.GetLeagueForUser(userId);
        }
    }
}
