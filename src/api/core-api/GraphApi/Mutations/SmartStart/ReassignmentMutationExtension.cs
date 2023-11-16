using ECDLink.Core.Services.Interfaces;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ReassignmentMutationExtension
    {
        #region Service Calls       

        public bool AddReassignmentForPractitionerService(
        [Service] IHttpContextAccessor contextAccessor,
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
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.AddReassignmentForPractitioner(uId.ToString(), fromUserId, toUserId, reason, startDate, loggedByUser, classroomGroup, permanentAssign, endDate);
        }


        public bool ReassignClassroomsFromHistoryService([Service] IHttpContextAccessor contextAccessor,
            [Service] IReassignmentService reassignmentService,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.ReassignClassroomsFromHistory(uId.ToString(), userId);
        }

        public bool ExpireRelationshipLinksService([Service] IHttpContextAccessor contextAccessor,
    [Service] IReassignmentService reassignmentService)
        {
            reassignmentService.ExpireRelationshipLinks();
            return true;
        }

        public bool ReassignAllClassroomsFromHistoryService([Service] IHttpContextAccessor contextAccessor,
    [Service] IReassignmentService reassignmentService)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.ReassignClassroomsFromHistory(uId.ToString(), null);
        }


        #endregion
    }
}
