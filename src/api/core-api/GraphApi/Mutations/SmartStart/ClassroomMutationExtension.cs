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
using ECDLink.Abstractrions.Constants;
using EcdLink.Api.CoreApi.Services;
using ECDLink.DataAccessLayer.Entities.Notifications;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Managers;

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
            var uId = contextAccessor.HttpContext.GetUser().Id.ToString();
            var classRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoom = (ClassroomGroup)classRepo.GetAll().Where(x => x.Id == Guid.Parse(classroomId));
            if (classRoom != null)
            {

                reassignmentService.AddReassignmentForPractitioner(uId, userId, "Principal Linked Practitioner", DateTime.Now, uId, classroomId, true);
                return classRoom;
            }

            return new ClassroomGroup();
        }
        public ClassroomGroup UpdateClassroomGroup(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            Guid id,
            ClassroomGroup input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classRoomGroup = classRepo.GetAll().Where(x => x.Id == id).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            Guid? programmeType = input.ProgrammeTypeId;

            var hierarchy = engine.GetUserHierarchy(input.UserId.HasValue ? input.UserId : uId);
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
                        newReassignment.ReassignedToUser = input.UserId;
                        newReassignment.UserId = (Guid)input.UserId;
                        newReassignment.ReassignedBackToUserId = uId;
                        newReassignment.ReassignedBackToDate = DateTime.Now;
                       
                        historyRepo.Insert(newReassignment);
                    }
                }

                //update classrooms hierarchy and send through to next function
                string previousUser = classRoomGroup.UserId.ToString();
                classRoomGroup.Hierarchy = hierarchy;
                classRoomGroup.UserId = input.UserId;
                classRoomGroup.ClassroomId = input.ClassroomId;
                classRoomGroup.Name = input.Name;
                classRoomGroup.IsActive = input.IsActive;
                classRoomGroup.ProgrammeTypeId = programmeType;
                classRoomGroup.UpdatedBy = uId.ToString();
                classRepo.Update(classRoomGroup);

                //if this was a new assignment to a new practitioner trigger message to notify them
               if (classRoomGroup.UserId != input.UserId)
                {
                    var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
                    Classroom classRoom = classroomRepo.GetAll().Where(x => x.Id.Equals(classRoomGroup.ClassroomId)).FirstOrDefault();
                    var principalToSend = userManager.FindByIdAsync(classRoom.UserId.Value.ToString()).Result;
                    var userToSend = userManager.FindByIdAsync(input.UserId.Value.ToString()).Result;
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ClassName",
                        ReplacementValue = input.Name
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "PrincipalName",
                        ReplacementValue = principalToSend.FirstName + " " + principalToSend.Surname
                    });

                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReassignedToNewClass, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true);
                    //message the old user they were removed
                    var oldUserToSend = userManager.FindByIdAsync(previousUser).Result;
                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.RemovedFromProgramme, DateTime.Now.Date, oldUserToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true);
                }

                //also update the userhierarchy on classroomgroup, as well as classProgramme so that a practitioner can see this
                var learnersReassigned = UpdateLearners(repoFactory, uId.ToString(), id, hierarchy);
                UpdateChildren(repoFactory, uId.ToString(), hierarchy, learnersReassigned, input.UserId.ToString());              
                UpdateClassProgrammeForPractitioner(contextAccessor, repoFactory, input.ClassroomId, hierarchy);

                //if (classRoomGroup.ClassroomId != null) 
                //{
                //    var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
                //    Classroom classRoom = classroomRepo.GetAll().Where(x => x.Id.Equals(classRoomGroup.ClassroomId)).FirstOrDefault();
                //    if (classRoom != null)
                //    {
                //        var principalToSend = userManager.FindByIdAsync(classRoom.UserId.Value.ToString()).Result;
                //        List<TagsReplacements> replacements = new List<TagsReplacements>();
                //        replacements.Add(new TagsReplacements()
                //        {
                //            FindValue = "ClassName",
                //            ReplacementValue = classRoomGroup.Name
                //        });
                //        notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClasses, DateTime.Now.Date, principalToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7).Date, false,true);
                //    }
                //}

                return classRoomGroup;
            }

            return new ClassroomGroup();
        }

        public Classroom updateClassroomSiteAddress(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService,
            Guid id,
            Classroom input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            IGenericRepository<SiteAddress, Guid> addressRepo = repoFactory.CreateGenericRepository<SiteAddress>(userContext: uId);
            IGenericRepository<Classroom, Guid> dbRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);

            Classroom updateClass = dbRepo.GetById(input.Id);
            bool sendNotification = false;

            if (input.SiteAddress != null)
            {
                SiteAddress address = addressRepo.GetById(input.SiteAddressId.Value);

                if (address != null)
                {
                    if (input?.SiteAddress?.Ward != null)
                        address.Ward = input.SiteAddress.Ward;
                    if (input?.SiteAddress?.AddressLine1 != null)
                        address.AddressLine1 = input.SiteAddress.AddressLine1;
                    if (input?.SiteAddress?.AddressLine2 != null)
                        address.AddressLine2 = input.SiteAddress.AddressLine2;
                    if (input?.SiteAddress?.AddressLine3 != null)
                        address.AddressLine3 = input.SiteAddress.AddressLine3;
                    if (input?.SiteAddress?.PostalCode != null)
                        address.PostalCode = input.SiteAddress.PostalCode;
                    if (input?.SiteAddress.ProvinceId != null)
                        address.ProvinceId = input.SiteAddress.ProvinceId;
                    var updateAddressResult = addressRepo.Update(address);
                    sendNotification = true;
                }

                if (address is null)
                {
                    //create siteaddress
                    SiteAddress newAddress = new SiteAddress();
                    if (input.SiteAddress.Ward != null)
                        newAddress.Ward = input.SiteAddress.Ward;
                    if (input.SiteAddress.AddressLine1 != null)
                        newAddress.AddressLine1 = input.SiteAddress.AddressLine1;
                    if (input.SiteAddress.AddressLine2 != null)
                        newAddress.AddressLine2 = input.SiteAddress.AddressLine2;
                    if (input.SiteAddress.AddressLine3 != null)
                        newAddress.AddressLine3 = input.SiteAddress.AddressLine3;
                    if (input.SiteAddress.PostalCode != null)
                        newAddress.PostalCode = input.SiteAddress.PostalCode;
                    if (input.SiteAddress.ProvinceId != null)
                        newAddress.ProvinceId = input.SiteAddress.ProvinceId;
                    var updateAddressResult = addressRepo.Insert(newAddress);
                    if (updateAddressResult != null)
                        updateClass.SiteAddressId = updateAddressResult.Id;
                        var updateResult = dbRepo.Update(updateClass);
                    sendNotification = true;
                }
                //send notification of change to Coach
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                var principal = userManager.FindByIdAsync(updateClass.UserId).Result;
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "PrincipalOrFAA",
                    ReplacementValue = principal.FirstName + " " + principal.Surname
                });
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ProgrammeName",
                    ReplacementValue = updateClass.Name != null  ? updateClass.Name : ""
                });
                
                var parentId = engine.GetUserParentUserId(principal.Id);
                if (parentId != null) {
                   var coachToSend = userManager.FindByIdAsync(parentId.ToString()).Result;
                    if (coachToSend != null)
                    {
                        notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachAddresUpdatedScheduleVisit, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), true);
                    }
                }
            }

            return updateClass;
        }

        public ClassProgramme UpdateClassProgramme(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            Guid id,
            ClassProgramme input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            IGenericRepository<ClassroomGroup, Guid> classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            ClassroomGroup classroomGroup = classRepo.GetAll().Where(x => x.Id == input.ClassroomGroupId).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            string hierarchy = engine.GetUserHierarchy(classroomGroup.UserId.GetValueOrDefault(uId));

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
            ClassProgramme classProgramme = classProgrammeRepo.GetAll().Where(x => x.ClassroomGroupId == classroomId).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
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
            List<Learner> learners = learnerRepo.GetAll().Where(x => x.ClassroomGroupId == classroomGroupId && x.IsActive == true).ToList();
            if (learners != null && learners.Count > 0 && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                foreach (var learner in learners)
                {
                    if (learner.Hierarchy != newHierarchy)
                    {
                        learner.Hierarchy = newHierarchy;
                        learnerRepo.Update(learner);
                        learnersReassigned.Add(learner.UserId.ToString());
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
                       UserHierarchyEntity childHierarchy = staticHierarchyRepo.GetAll().Where(x => x.UserId == children.UserId).FirstOrDefault();

                        if (childHierarchy != null)
                        {
                            //update NamedTypePath to not be System.Child. but System.Administrator.Practitioner.Child.
                            childHierarchy.NamedTypePath = childHierarchy.NamedTypePath.Replace("System.Child.", "System.Administrator.Practitioner.Child.");
                            //update hierarchy not be 0.466. but 0.1.455.459.
                            childNewHierarchy = HierarchyHelper.AppendHierarchy(newHierarchy, childHierarchy.Key.ToString());
                            childHierarchy.Hierarchy = childNewHierarchy;
                            childHierarchy.ParentId = Guid.Parse(newUserId);
                            staticHierarchyRepo.Update(childHierarchy);
                            //uppdate child record Hierarchy
                            Child updatedChild = childRepo.GetByUserId(children.UserId.ToString());
                            updatedChild.Hierarchy = childNewHierarchy;
                            childRepo.Update(updatedChild);
                        }

                    }
                }
            }
            return childrenReassigned;
        }

        public bool UpdatePreschoolFeeForClassroom(
            [Service] IPointsEngineService pointsEngineService,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            Guid classroomId,
            double? amount)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var classroom = classroomRepo.GetById(classroomId);

            classroom.PreschoolFeeAmount = amount;
            classroom.PreschoolFeeAmountLastUpdateDate = DateTime.Now;

            classroomRepo.Update(classroom);

            pointsEngineService.CalculatePreSchoolFees(uId.ToString(), DateTime.Now);
            //if (classroom.UserId != null)
            {
                notificationService.ExpireNotificationsTypesForUser(classroom.UserId.ToString(), TemplateTypeConstants.UpdatePreschoolFee);
            }

            return true;
        }
    }
}
