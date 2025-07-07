using ECDLink.Core.Services.Interfaces;
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


        public bool ReassignClassroomsFromHistoryService([Service] IReassignmentService reassignmentService,
            string userId)
        {
            return reassignmentService.ReassignClassroomsFromHistory(userId);
        }

        public bool ExpireRelationshipLinksService([Service] IReassignmentService reassignmentService)
        {
            reassignmentService.ExpireRelationshipLinks();
            return true;
        }

        public bool ReassignAllClassroomsFromHistoryService([Service] IReassignmentService reassignmentService)
        {
            return reassignmentService.ReassignClassroomsFromHistory(null);
        }

        public bool ReassignAbsentees([Service] IReassignmentService reassignmentService)
        {
           return reassignmentService.ReassignAbsentees();
        }


        #endregion
    }
}
