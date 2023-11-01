using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClubMeetingMutationExtension
    {
        public ClubMeetingMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubMeeting AddCoachCircleMeeting([Service] IClubService clubService, ClubMeetingModel input)
        {
            return clubService.AddClubMeeting(input, Constants.CoachingCircleSettings.meeting_type_coach_circle);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubMeeting AddClubMeeting([Service] IClubService clubService, ClubMeetingModel input)
        {
            input.Name = Constants.ClubSettings.meet_regularly;
            return clubService.AddClubMeeting(input, Constants.ClubSettings.meeting_type_club_meeting);
        }

    }
}
