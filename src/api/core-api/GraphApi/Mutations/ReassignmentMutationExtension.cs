using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ReassignmentMutationExtension
    {
        #region Service Calls       
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public bool AddReassignmentForPractitionerService(
        [Service] IReassignmentService reassignmentService,
        string fromUserId,
        string toUserId,
        string reason,
        DateTime startDate,
        string loggedByUser,
        string classroomGroup = null,
        bool permanentAssign = false,
        DateTime? endDate = null
        )
        {
            return reassignmentService.AddReassignmentForPractitioner(fromUserId, toUserId, reason, startDate, loggedByUser, classroomGroup, permanentAssign, endDate);
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public bool ReassignClassroomsFromHistoryService([Service] IReassignmentService reassignmentService,
            string userId)
        {
            return reassignmentService.ReassignClassroomsFromHistory(userId);
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public bool ExpireRelationshipLinksService([Service] IReassignmentService reassignmentService)
        {
            reassignmentService.ExpireRelationshipLinks();
            return true;
        }
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public bool ReassignAllClassroomsFromHistoryService([Service] IReassignmentService reassignmentService)
        {
            return reassignmentService.ReassignClassroomsFromHistory(null);
        }
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public bool ReassignAbsentees([Service] IReassignmentService reassignmentService)
        {
           return reassignmentService.ReassignAbsentees();
        }


        #endregion
    }
}
