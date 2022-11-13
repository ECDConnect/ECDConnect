using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Hierarchy;
using Microsoft.Azure.Documents;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using static ECDLink.Core.SystemSettings.SettingGroups;
using Microsoft.Extensions.DependencyInjection;
using EcdLink.Api.CoreApi.Services;
using System.Drawing;
using ECDLink.Core.Services;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ReassignmentMutationExtension
    {
        #region Service Calls       

        public bool AddReassignmentForPractitionerService(
        [Service] IHttpContextAccessor contextAccessor,
        [Service] IInvitationReassignmentService reassignmentService,
        string fromUserId,
        string toUserId,
        string reason,
        DateTime startDate,
        string loggedByUser,
        string classroomGroup = null,
        bool permanentAssign = false
        )
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.AddReassignmentForPractitioner(uId, fromUserId, toUserId, reason, startDate, loggedByUser, classroomGroup, permanentAssign);
        }


        public bool ReassignClassroomsFromHistoryService([Service] IHttpContextAccessor contextAccessor,
            [Service] IInvitationReassignmentService reassignmentService,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.ReassignClassroomsFromHistory(uId, userId);
        }
        public bool ExpireRelationshipLinksService([Service] IHttpContextAccessor contextAccessor,
    [Service] IInvitationReassignmentService reassignmentService)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            reassignmentService.ExpireRelationshipLinks();
            return true;
        }


        #endregion
    }
}
