using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TraineeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Trainee ScheduleConsolidationMeetingDate([Service] PersonnelService personnelService, string userId, DateTime? scheduledDate)
        {
            return personnelService.ScheduleConsolidationMeetingDate(userId, scheduledDate);
        }

    }
}
