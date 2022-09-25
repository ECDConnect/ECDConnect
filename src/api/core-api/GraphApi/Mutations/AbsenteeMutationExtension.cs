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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AbsenteeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public Absentees AddAbsenteeForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classProgram,
            string reassignedToPractitioner)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            var historyRepo = repoFactory.CreateRepository<ClassReassignmentHistory>(userContext: uId);

            var absent = new Absentees
            {
                UserId = practitionerId,
                Reason = reason,
                AbsentDate = absentDate,
                LoggedBy = loggedByUser,
                ReassignedClass = classProgram,
                ReassignedToPractitioner = reassignedToPractitioner
            };

            var updated = absenteeRepo.Insert(absent);

            //Log to the history table
            var history = new ClassReassignmentHistory
            {
                UserId = practitionerId,
                Reason = reason,
                ReassignedDate = DateTime.Now,
                LoggedBy = loggedByUser,
                ReassignedClass = classProgram,
                ReassignedToUser = reassignedToPractitioner
            };

            var historySaved = historyRepo.Insert(history);

            //reassign classroom
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var classroom = classroomGroupRepo.GetByUserId(practitionerId);
            if (classroom != null && reassignedToPractitioner!= null) {
                classroom.UserId = Guid.Parse(reassignedToPractitioner);
                classroomGroupRepo.Update(classroom);
            }

            //Save the history so it can be reassigned

            return updated;            
        }

        public bool ReassignClassroomsFromHistory([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var historyRepo = repoFactory.CreateRepository<ClassReassignmentHistory>(userContext: uId);
            bool reAssigned = false;
            List<ClassReassignmentHistory> history = historyRepo.GetListByUserId(userId);
            foreach (var historyItem in history)
            {
                if (historyItem.ReassignedDate == DateTime.Now.AddDays(-1))
                {

                    //Log to the history table the reassignment back to original user
                    var updateHistory = new ClassReassignmentHistory
                    {                        
                        Reason = "Reassigning to original",
                        ReassignedBackDate = DateTime.Now,
                        ReassignedBackToUserId = historyItem.UserId
                    };

                    var historySaved = historyRepo.Update(updateHistory);

                    //reassign classroom
                    var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
                    var classroom = classroomGroupRepo.GetByUserId(historyItem.ReassignedToUser);
                    if (classroom != null)
                    {
                        classroom.UserId = Guid.Parse(historyItem.UserId);
                        classroomGroupRepo.Update(classroom);
                    }
                }
                reAssigned = true;
            }

            //Save the history so it can be reassigned

            return reAssigned;
        }

    }
}
