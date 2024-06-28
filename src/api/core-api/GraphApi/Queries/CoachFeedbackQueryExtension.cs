using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CoachFeedbackQueryExtension
    {
        [Permission(PermissionGroups.COMMUNITY, GraphActionEnum.View)]
        public CoachFeedbackSetupModel GetRatingsAndFeedbackTypes([Service] ICommunityService communionService)
        {
            return new CoachFeedbackSetupModel()
            {
                FeedbackTypes = communionService.GetFeedbackTypes(),
                SupportRatings = communionService.GetSupportRatings(),
            };
        }
    }
}
