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
            [Service] IAbsenteeService absenteeService,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classProgram = null,
            DateTime? absentDateEnd = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return absenteeService.AddAbsenteeForPractitioner(uId, practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classProgram, absentDateEnd);
        }

        public Absentees EditAbsentee(
    [Service] IAbsenteeService absenteetService,
    string absenteeId,
    bool deleteAbsentee = false,
    string reassignedToPractitioner = null,
    string reason = null,
    DateTime? absentDate = null,
    DateTime? absentDateEnd = null)
        {
            return absenteetService.EditAbsentee(absenteeId, deleteAbsentee, reassignedToPractitioner, reason, absentDate, absentDateEnd);
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
