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
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using Microsoft.Azure.Documents;
using System.Drawing;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AbsenteeMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public Absentees AddAbsenteeForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            string fromUserId,
            string toUserId,
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

                var absent = new Absentees
                {
                    UserId = fromUserId,
                    Reason = reason,
                    AbsentDate = absentDate,
                    LoggedBy = loggedByUser,
                    ReassignedClass = classProgram,
                    ReassignedToPractitioner = toUserId,
                    
                };
                updated = absenteeRepo.Insert(absent);

                //Log to the history table for reassignment back to owner user
                ReassignmentMutationExtension reassignment = new ReassignmentMutationExtension();
                reassignment.AddReassignmentForPractitioner(contextAccessor, repoFactory, engine, fromUserId, toUserId, reason, absentDate, loggedByUser, classProgram);
            }

            //Save the history so it can be reassigned

            return updated;            
        }

        public bool ReassignAbsenteeFromHistory([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var historyRepo = repoFactory.CreateRepository<ClassReassignmentHistory>(userContext: uId);
            bool reAssigned = false;
            ReassignmentMutationExtension reassignment = new ReassignmentMutationExtension();
            return reassignment.ReassignClassroomsFromHistory(contextAccessor, repoFactory, userId);
        }

        private bool UpdateClassProgrammeForPractitioner([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory, Guid classroomId, string newHierarchy)
        {
            bool updated = false;
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            ClassProgramme classProgramme = (ClassProgramme)classProgrammeRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomId)).FirstOrDefault();
            if (classProgramme != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                classProgramme.Hierarchy = newHierarchy;
                classProgrammeRepo.Update(classProgramme);
            }
            return updated;
        }

//        private bool UpdateLearnerForPractitioner([Service] IHttpContextAccessor contextAccessor,
//[Service] IGenericRepositoryFactory repoFactory, Guid classroomGroupId, string hierarchy)
//        {
//            bool updated = false;
//            var uId = contextAccessor.HttpContext.GetUser().Id;

//            var learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);
//            Learner learners = (ClassProgramme)learnerRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomId)).FirstOrDefault();
//            if (classProgramme != null && !string.IsNullOrWhiteSpace(newHierarchy))
//            {
//                classProgramme.Hierarchy = newHierarchy;
//                classProgrammeRepo.Update(classProgramme);
//            }
//            return updated;
//        }

    }
}
