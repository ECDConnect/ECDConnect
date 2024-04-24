using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using System;
using ECDLink.Core.Services.Interfaces;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class LeagueQueryExtension
    {
        public LeagueQueryExtension()
        {
        }

        // Remove
        public List<LeagueClubsModel> GetLeaguesForCoach([Service] IClubService clubService, string coachUserId)
        {
            return clubService.GetLeaguesForCoach(coachUserId).ToList();
        }

        // Remove
        public LeagueClubsModel GetLeagueForUser([Service] IClubService clubService, string userId)
        {            
            return clubService.GetLeagueForUser(userId);
        }

    }
}
