using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Hierarchy;
using Microsoft.Azure.Documents;
using ECDLink.Core.Services.Interfaces;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AbsenteeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public Absentees AddAbsenteeForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            [Service] IInvitationReassignmentService reassignmentService,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classProgram = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);            
            var updated = new Absentees();
            if (classProgram != null)
            {
                reason = (string.IsNullOrEmpty(reason)?"Practitioner Marked Absent":reason);
                var absent = new Absentees
                {
                    UserId = practitionerId,
                    Reason = reason,
                    AbsentDate = absentDate,
                    LoggedBy = loggedByUser,
                    ReassignedClass = classProgram,
                    ReassignedToPractitioner = reassignedToPractitioner,
                    UpdatedBy = loggedByUser,
                    UpdatedDate = DateTime.Now
                };
                updated = absenteeRepo.Insert(absent);

                //Log to the history table for reassignment back to owner user
                reassignmentService.AddReassignmentForPractitioner(uId, practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classProgram, false);
            }

            //Save the history so it can be reassigned
            return updated;            
        }

        public bool ReassignAbsenteeFromHistory([Service] IHttpContextAccessor contextAccessor,
            [Service] IInvitationReassignmentService reassignmentService,
            string userId)
        {            
            var uId = contextAccessor.HttpContext.GetUser().Id;
            return reassignmentService.ReassignClassroomsFromHistory(uId, userId);
        }

    }
}
