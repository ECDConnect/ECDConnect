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
            [Service] IAbsenteeService absenteeService,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classProgram = null,
            DateTime? absentDateEnd = null,
            bool isRoleAssign = false,
            string fromRole = null,
            string toRole = null,
            string roleAssignedToUser = null)
        {
            return absenteeService.AddAbsenteeForPractitioner(practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classProgram, absentDateEnd, isRoleAssign, fromRole, toRole,roleAssignedToUser, null);
        }

        public Absentees EditAbsentee(
    [Service] IAbsenteeService absenteetService,
    string absenteeId,
    bool deleteAbsentee = false,
    string reassignedToPractitioner = null,
    string reason = null,
    DateTime? absentDate = null,
    DateTime? absentDateEnd = null,
    bool isRoleAssign = false,
    string roleAssignedToUser = null)
        {
            return absenteetService.EditAbsentee(absenteeId, deleteAbsentee, reassignedToPractitioner, reason, absentDate, absentDateEnd, isRoleAssign, roleAssignedToUser);
        }

        public bool ReassignAbsenteeFromHistory([Service] IReassignmentService reassignmentService,
            string userId)
        {
            return reassignmentService.ReassignClassroomsFromHistory(userId);
        }

    }
}
