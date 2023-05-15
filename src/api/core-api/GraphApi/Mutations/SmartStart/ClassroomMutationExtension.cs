using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ClassroomMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public ClassroomGroup UpdatePractitionerToTeachClassroom(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
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
        public ClassroomGroup UpdateClassroomGroup(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            Guid id,
            ClassroomGroup input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoomGroup = classRepo.GetAll().Where(x => x.Id.Equals(id)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            Guid? programmeType = input.ProgrammeTypeId;
            //if a programmetype already exists on a previously created classroomgroup, use that to avoid mismatching programmes
            var existingGroup = classRepo.GetAll()
                    .Where(x => x.ClassroomId == input.ClassroomId)
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();

            if (existingGroup != null) { 
                programmeType = existingGroup.ProgrammeTypeId;
            }

            var hierarchy = engine.GetUserHierarchy(input.UserId != null ? input.UserId.ToString() : uId);
            if (classRoomGroup == null)
            {
                if (!string.IsNullOrEmpty(hierarchy))
                {
                    //create new classroomgroup
                    ClassroomGroup classRoomCreate = new ClassroomGroup()
                    {
                        Id = input.Id,
                        UserId = input.UserId != null ? input.UserId : null,
                        ProgrammeTypeId = programmeType,
                        IsActive = true,
                        UpdatedBy = uId.ToString(),
                        Name = input.Name,
                        Hierarchy = hierarchy,
                        ClassroomId = input.ClassroomId
                    };

                    var newClassRoomGroup = classRepo.Insert(classRoomCreate);
                    UpdateClassProgrammeForPractitioner(contextAccessor, repoFactory, input.ClassroomId, hierarchy);
                    return newClassRoomGroup;

                }
            }
            else
            {
                //get the users hierarchy to reuse
                var oldHierarchy = classRoomGroup.Hierarchy;
               
                if (input.UserId != null)
                {                     
                    if (hierarchy != null && (oldHierarchy != classRoomGroup.Hierarchy))
                    {
                        var historyRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: uId);
                        ClassReassignmentHistory newReassignment = new ClassReassignmentHistory();

                        newReassignment.LoggedBy = uId;
                        newReassignment.IsActive = true;
                        newReassignment.Reason = "Principal assigned class to practitioner";
                        newReassignment.ReassignedClassroomGroups = id.ToString() + ";";
                        newReassignment.ReassignedToDate = DateTime.Now;
                        newReassignment.ReassignedToUser = input.UserId.ToString();
                        newReassignment.UserId = input.UserId.ToString();
                        newReassignment.ReassignedBackToUserId = uId;
                        newReassignment.ReassignedBackToDate = DateTime.Now;
                       
                        historyRepo.Insert(newReassignment);
                    }
                }

                //update classrooms hierarchy and send through to next function         
                classRoomGroup.Hierarchy = hierarchy;
                classRoomGroup.UserId = input.UserId;
                classRoomGroup.ClassroomId = input.ClassroomId;
                classRoomGroup.Name = input.Name;
                classRoomGroup.IsActive = input.IsActive;
                classRoomGroup.ProgrammeTypeId = programmeType;
                classRoomGroup.UpdatedBy = uId; 
                classRepo.Update(classRoomGroup);

                //also update the userhierarchy on classroomgroup, as well as classProgramme so that a practitioner can see this
                var learnersReassigned = UpdateLearners(repoFactory, uId, id, hierarchy);
                UpdateChildren(repoFactory, uId, hierarchy, learnersReassigned, input.UserId.ToString());              
                UpdateClassProgrammeForPractitioner(contextAccessor, repoFactory, input.ClassroomId, hierarchy);

                return classRoomGroup;
            }

            return new ClassroomGroup();
        }

        public ClassProgramme UpdateClassProgramme(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            Guid id,
            ClassProgramme input)
        {
            string uId = contextAccessor.HttpContext.GetUser().Id;
            IGenericRepository<ClassroomGroup, Guid> classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classroomGroup = classRepo.GetAll().Where(x => x.Id.Equals(input.ClassroomGroupId)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            string hierarchy = engine.GetUserHierarchy(classroomGroup.UserId != null ? classroomGroup.UserId.ToString() : uId);

            if (classroomGroup != null)
            {
                if (!string.IsNullOrEmpty(hierarchy))
                {
                    var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
                    var existingClassProgramme = classProgrammeRepo.GetById(id);

                    if (existingClassProgramme == null)
                    {
                        //create new ClassProgramme
                        ClassProgramme classProgrammeCreate = new ClassProgramme()
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

                        return classProgrammeRepo.Insert(classProgrammeCreate);
                    }
                    else
                    {
                        existingClassProgramme.UpdatedDate = DateTime.Now;
                        existingClassProgramme.ClassroomGroupId = input.ClassroomGroupId;
                        existingClassProgramme.Hierarchy = hierarchy;
                        existingClassProgramme.MeetingDay = input.MeetingDay;
                        // TODO: existingClassProgramme.ProgrammeStartDate should not be updated?
                        //existingClassProgramme.ProgrammeStartDate = input.ProgrammeStartDate,
                        existingClassProgramme.IsFullDay = input.IsFullDay;
                        existingClassProgramme.IsActive = input.IsActive;

                        return classProgrammeRepo.Update(existingClassProgramme);
                    }
                }
            }

            return new ClassProgramme();
        }

        private void UpdateClassProgrammeForPractitioner(
            [Service] IHttpContextAccessor contextAccessor, 
            IGenericRepositoryFactory repoFactory,
            Guid classroomId,
            string newHierarchy)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            ClassProgramme classProgramme = classProgrammeRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomId)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            if (classProgramme != null && !string.IsNullOrWhiteSpace(newHierarchy) && classProgramme.Hierarchy != newHierarchy)
            {
                classProgramme.Hierarchy = newHierarchy;
                classProgrammeRepo.Update(classProgramme);
            }
        }

        private List<string> UpdateLearners(
            IGenericRepositoryFactory repoFactory, 
            string uId, 
            Guid classroomGroupId, 
            string newHierarchy)
        {
            List<string> learnersReassigned = new List<string>();

            var learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);
            List<Learner> learners = learnerRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomGroupId) && x.IsActive == true).ToList();
            if (learners != null && learners.Count > 0 && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                foreach (var learner in learners)
                {
                    if (learner.Hierarchy != newHierarchy)
                    {
                        learner.Hierarchy = newHierarchy;
                        learnerRepo.Update(learner);
                        learnersReassigned.Add(learner.UserId);
                    }
                }   
            }
            return learnersReassigned;
        }

        private List<string> UpdateChildren(
            IGenericRepositoryFactory repoFactory, 
            string uId, 
            string newHierarchy, 
            List<string> learnerIds,
            string newUserId)
        {
            List<string> childrenReassigned = new List<string>();
            var staticHierarchyRepo = repoFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: uId);
            var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);

            if (learnerIds != null && !string.IsNullOrWhiteSpace(newHierarchy) && learnerIds.Count > 0)
            {
                foreach (var learnerId in learnerIds)
                {
                    Child children = childRepo.GetByUserId(learnerId);
                    if (children != null )
                    {
                       string childNewHierarchy = "";
                       UserHierarchyEntity childHierarchy = staticHierarchyRepo.GetAll().Where(x => x.UserId.Equals(children.UserId)).FirstOrDefault();

                        if (childHierarchy != null)
                        {
                            //update NamedTypePath to not be System.Child. but System.Administrator.Practitioner.Child.
                            childHierarchy.NamedTypePath = childHierarchy.NamedTypePath.Replace("System.Child.", "System.Administrator.Practitioner.Child.");
                            //update hierarchy not be 0.466. but 0.1.455.459.
                            childNewHierarchy = HierarchyHelper.AppendHierarchy(newHierarchy, childHierarchy.Key.ToString());
                            childHierarchy.Hierarchy = childNewHierarchy;
                            childHierarchy.ParentId = newUserId;
                            staticHierarchyRepo.Update(childHierarchy);
                            //uppdate child record Hierarchy
                            Child updatedChild = childRepo.GetByUserId(children.UserId);
                            updatedChild.Hierarchy = childNewHierarchy;
                            childRepo.Update(updatedChild);
                        }

                    }
                }
            }
            return childrenReassigned;
        }
    }
}
