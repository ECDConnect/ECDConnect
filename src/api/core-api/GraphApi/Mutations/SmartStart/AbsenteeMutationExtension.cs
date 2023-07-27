using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AbsenteeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public Absentees AddAbsenteeForPractitioner(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IAbsenteeService absenteetService,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classProgram = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return absenteetService.AddAbsenteeForPractitioner(uId, practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classProgram);
        }

        public bool ReassignAbsenteeFromHistory([Service] IHttpContextAccessor contextAccessor,
            [Service] IReassignmentService reassignmentService,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.ReassignClassroomsFromHistory(uId, userId);
        }

    }
}
