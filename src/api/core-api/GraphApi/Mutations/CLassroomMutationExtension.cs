using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Managers;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EcdLink.Api.CoreApi.GraphApi.Queries;
using ECDLink.DataAccessLayer.Entities.Classroom;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using Microsoft.Azure.Documents;
using ECDLink.DataAccessLayer.Hierarchy;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClassroomMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public ClassroomGroup UpdatePractitionerToTeachClassroom([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
               [Service] HierarchyEngine engine,
            string classroomId,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoom = (ClassroomGroup)classRepo.GetAll().Where(x => x.Id.Equals(classroomId));
            if (classRoom != null)
            {
                //get the users hierarchy to reuse
                var hierarchy = engine.GetUserHierarchy((userId != null ? userId : uId));

                ClassReassignmentHistory newReassignment = new ClassReassignmentHistory();
                if (userId != null)
                {
                    //update classrooms hierarchy and send through to next function
                    if (hierarchy != null)
                    {
                        classRoom.Hierarchy = hierarchy;

                        var reassignmentRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: uId);
                        newReassignment.LoggedBy = uId;
                        newReassignment.IsActive = true;
                        newReassignment.Reason = "Principal Linked Practitioner";
                        newReassignment.ReassignedClass = classroomId;
                        newReassignment.ReassignedDate = DateTime.Now;
                        newReassignment.ReassignedToUser = userId;
                        newReassignment.UserId = userId;
                        newReassignment.ReassignedBackToUserId = classRoom.UserId.ToString();
                    }
                }
                classRoom.UserId = Guid.Parse(userId);
                classRoom.ClassroomId = Guid.Parse(classroomId);
                classRoom.Name = classRoom.Name;
                classRoom.IsActive = true;
                classRoom.ProgrammeTypeId = classRoom.ProgrammeTypeId;
                var updateResult = classRepo.Update(classRoom);

                //also update the userhierarchy on classroomgroup, as well as classProgramme so that a practitioner can see this
                this.UpdateClassProgrammeForPractitioner(contextAccessor, dbFactory, repoFactory, Guid.Parse(classroomId), hierarchy);

                return classRoom;
            }

            return new ClassroomGroup();
        }
        public ClassroomGroup UpdateClassroomGroup([Service] IHttpContextAccessor contextAccessor,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
    [Service] HierarchyEngine engine,
    Guid id,
    ClassroomGroup input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoom = (ClassroomGroup)classRepo.GetAll().Where(x => x.Id.Equals(id)).FirstOrDefault();
            var hierarchy = engine.GetUserHierarchy((input.UserId != null ? input.UserId.ToString() : uId));
            if (classRoom == null)
            {
                if (!string.IsNullOrEmpty(hierarchy))
                {
                    //create new classroomgroup
                    ClassroomGroup classRoomCreate = new ClassroomGroup()
                    {
                        Id = input.Id,
                        UserId = (input.UserId != null ? input.UserId : null),
                        ProgrammeTypeId = input.ProgrammeTypeId,
                        IsActive = true,
                        UpdatedBy = uId.ToString(),
                        Name = input.Name,
                        Hierarchy = hierarchy,
                        ClassroomId = input.ClassroomId
                    };

                    var newClassRoomGroup = classRepo.Insert(classRoomCreate);
                    this.UpdateClassProgrammeForPractitioner(contextAccessor, dbFactory, repoFactory, input.ClassroomId, hierarchy);
                    return newClassRoomGroup;

                }
            } else { 
                //get the users hierarchy to reuse
                ClassReassignmentHistory newReassignment = new ClassReassignmentHistory();
                if (input.UserId != null) {
                    //update classrooms hierarchy and send through to next function

                    if (hierarchy != null)
                    {
                        //newHierarchy = userHierarchy.Hierarchy;                       
                        classRoom.Hierarchy = hierarchy;

                        var reassignmentRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: uId);
                        newReassignment.LoggedBy = uId;
                        newReassignment.IsActive = true;
                        newReassignment.Reason = "Principal Linked Practitioner";
                        newReassignment.ReassignedClass = id.ToString();
                        newReassignment.ReassignedDate = DateTime.Now;
                        newReassignment.ReassignedToUser = input.UserId.ToString();
                        newReassignment.UserId = input.UserId.ToString();
                        newReassignment.ReassignedBackToUserId = classRoom.UserId.ToString();
                    }                    
                }
                classRoom.UserId = input.UserId;
                classRoom.ClassroomId = input.ClassroomId;
                classRoom.Name = input.Name;
                classRoom.IsActive = input.IsActive;
                classRoom.ProgrammeTypeId = input.ProgrammeTypeId;
                var updateResult = classRepo.Update(classRoom);

                //also update the userhierarchy on classroomgroup, as well as classProgramme so that a practitioner can see this
                this.UpdateClassProgrammeForPractitioner(contextAccessor, dbFactory, repoFactory, input.ClassroomId, hierarchy);

                return classRoom;
            }

            return new ClassroomGroup();
        }

        private bool UpdateClassProgrammeForPractitioner([Service] IHttpContextAccessor contextAccessor,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory, Guid classroomId,  string newHierarchy)
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
    }
}
