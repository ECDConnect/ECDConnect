using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

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
               [Service] IReassignmentService reassignmentService,
            string classroomId,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoom = (ClassroomGroup)classRepo.GetAll().Where(x => x.Id.Equals(classroomId));
            if (classRoom != null)
            {

                reassignmentService.AddReassignmentForPractitioner(uId, uId, userId, "Principal Linked Practitioner", DateTime.Now, uId, classroomId, true);
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
                    this.UpdateClassProgrammeForPractitioner(contextAccessor, repoFactory, input.ClassroomId, hierarchy);
                    return newClassRoomGroup;

                }
            }
            else
            {
                //get the users hierarchy to reuse
                ClassReassignmentHistory newReassignment = new ClassReassignmentHistory();
                if (input.UserId != null)
                {
                    //update classrooms hierarchy and send through to next function

                    if (hierarchy != null)
                    {
                        classRoom.Hierarchy = hierarchy;

                        newReassignment.LoggedBy = uId;
                        newReassignment.IsActive = true;
                        newReassignment.Reason = "Principal Linked Practitioner";
                        newReassignment.ReassignedClassroomGroups = id.ToString() + ";";
                        newReassignment.ReassignedToDate = DateTime.Now;
                        newReassignment.ReassignedToUser = input.UserId.ToString();
                        newReassignment.UserId = input.UserId.ToString();
                        newReassignment.ReassignedBackToUserId = uId;
                        newReassignment.ReassignedBackToDate = DateTime.Now;
                    }
                }
                classRoom.UserId = input.UserId;
                classRoom.ClassroomId = input.ClassroomId;
                classRoom.Name = input.Name;
                classRoom.IsActive = input.IsActive;
                classRoom.ProgrammeTypeId = input.ProgrammeTypeId;

                //also update the userhierarchy on classroomgroup, as well as classProgramme so that a practitioner can see this
                this.UpdateClassProgrammeForPractitioner(contextAccessor, repoFactory, input.ClassroomId, hierarchy);

                return classRoom;
            }

            return new ClassroomGroup();
        }

        public ClassProgramme UpdateClassProgramme([Service] IHttpContextAccessor contextAccessor,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
    [Service] HierarchyEngine engine,
    Guid id,
    ClassProgramme input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoom = (ClassroomGroup)classRepo.GetAll().Where(x => x.Id.Equals(input.ClassroomGroupId)).FirstOrDefault();
            var hierarchy = engine.GetUserHierarchy((classRoom.UserId != null ? classRoom.UserId.ToString() : uId));
            if (classRoom != null)
            {
                if (!string.IsNullOrEmpty(hierarchy))
                {
                    var programmeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
                    var existingProgramme = programmeRepo.GetById(id);

                    if (existingProgramme == null)
                    {
                        //create new classroomgroup
                        ClassProgramme classRoomCreate = new ClassProgramme()
                        {
                            Id = input.Id,
                            ClassroomGroupId = input.ClassroomGroupId,
                            IsActive = true,
                            UpdatedBy = uId.ToString(),
                            ProgrammeStartDate = input.ProgrammeStartDate,
                            MeetingDay = input.MeetingDay,
                            IsFullDay = input.IsFullDay,
                            UpdatedDate = DateTime.Now,
                            Hierarchy = hierarchy
                        };

                        return programmeRepo.Insert(classRoomCreate);
                    }
                    else
                    {
                        existingProgramme.UpdatedDate = DateTime.Now;
                        existingProgramme.ClassroomGroupId = input.ClassroomGroupId;
                        existingProgramme.Hierarchy = hierarchy;
                        existingProgramme.MeetingDay = input.MeetingDay;
                        existingProgramme.IsFullDay = input.IsFullDay;
                        existingProgramme.IsActive = input.IsActive;

                        return programmeRepo.Update(existingProgramme);
                    }
                }
            }

            return new ClassProgramme();
        }

        private void UpdateClassProgrammeForPractitioner([Service] IHttpContextAccessor contextAccessor,
                                                         [Service] IGenericRepositoryFactory repoFactory,
                                                         Guid classroomId,
                                                         string newHierarchy)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            ClassProgramme classProgramme = (ClassProgramme)classProgrammeRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomId)).FirstOrDefault();
            if (classProgramme != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                classProgramme.Hierarchy = newHierarchy;
                classProgrammeRepo.Update(classProgramme);
            }
        }
    }
}
