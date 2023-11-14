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
            input.Name = input.Name == "" ? Constants.ClubSettings.meet_regularly : input.Name;
            return clubService.AddClubMeeting(input, Constants.ClubSettings.meeting_type_club_meeting);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubMeeting AddFamilyDayMeeting([Service] IClubService clubService, ClubMeetingModel input)
        {
            string meeting_type = "";
            switch (input.MeetingType)
            {
                case "Play Day":
                    meeting_type = Constants.ClubSettings.meeting_type_play_day;
                    break;
                case "Story Day":
                    meeting_type = Constants.ClubSettings.meeting_type_story_day;
                    break;
                case "End of Year Celebration":
                    meeting_type = Constants.ClubSettings.meeting_type_end_of_year_celebration;
                    break;
                case "Open Day":
                    meeting_type = Constants.ClubSettings.meeting_type_open_day;
                    break;
                case "Other":
                    meeting_type = Constants.ClubSettings.meeting_type_other;
                    break;
            }
            input.Name = input.Name == "" ? meeting_type : input.Name;
            return clubService.AddClubMeeting(input, meeting_type);
        }

    }
}
