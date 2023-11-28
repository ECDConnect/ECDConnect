using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClubQueryExtension
    {
        public ClubQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClubModel GetClubForUser(
            [Service] IClubService clubService,
            string userId)
        {
            var club = clubService.GetClubForUser(userId);

            return club;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<DetailClubModel> GetClubsForCoach(
            [Service] IClubService clubService,
            string coachUserId)
        {
            var clubs = clubService.GetClubsForCoach(coachUserId);

            return clubs.ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public DetailClubModel GetClubById(
            [Service] IClubService clubService,
            Guid clubId)
        {
            var club = clubService.GetClubById(clubId);

            return club;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        
        public ActivityMeetRegular GetActivityMeetRegularDetails([Service] IClubService clubService, Guid clubId, int month, int year)
        {
            return clubService.GetActivityMeetRegularDetails(clubId, month, year);
        }

        public ActivityBeCreative GetActivityBeCreativeDetails([Service] IClubService clubService, Guid clubId)
        {
            return clubService.GetActivityBeCreativeDetails(clubId);
        }

        public ActivityHostFamilyDays GetActivityHostFamilyDetails([Service] IClubService clubService, Guid clubId)
        {
            return clubService.GetActivityHostFamilyDetails(clubId);
        }

        public ActivityLeaveNoOneBehind GetActivityLeaveNoOneBehindDetails([Service] IClubService clubService, Guid clubId)
        {
            return clubService.GetActivityLeaveNoOneBehindDetails(clubId);
        }

        public ActivityChildAttendance GetActivityChildAttendance([Service] IClubService clubService, Guid clubId)
        {
            return clubService.GetActivityChildAttendance(clubId);
        }

        public ActivityChildProgress GetActivityChildProgress([Service] IClubService clubService, Guid clubId)
        {
            return clubService.GetActivityChildProgress(clubId);
        }

    }
}
