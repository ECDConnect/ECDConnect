using EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress;
using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
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

            // TODO - Why is this returning blank??? It should probably error if it does not find the group to update
            return new ClassroomGroup();
        }
        public ClassroomGroup UpdateClassroomGroup(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IPointsEngineService pointsService,
            Guid id,
            ClassroomGroup input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var schoolRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var pracRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            ClassroomGroup classRoomGroup = classRepo.GetAll().Where(x => x.Id == id).Include(x => x.Classroom).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

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

                    // EC-3508 - as soon as a class is created, we set the progress to 2
                    var practitionerToUpdate = pracRepo.GetByUserId(uId);
                    if (practitionerToUpdate.Progress != 2)
                    {
                        practitionerToUpdate.Progress = 2;
                        practitionerToUpdate.IsPrincipal = true;
                        pracRepo.Update(practitionerToUpdate);
                    }

                    // notifiy the practitioner that he was assigned to a class
                    var practitioner = pracRepo.GetByUserId(input.UserId.Value);
                    // only send to practitioner and not principal
                    if (practitioner != null && !practitioner.IsPrincipalOrAdmin())
                    {
                        var classroom = schoolRepo.GetById(input.ClassroomId);
                        var principalToSend = userManager.FindByIdAsync(classroom.UserId.Value.ToString()).Result;
                        var userToSend = userManager.FindByIdAsync(input.UserId.Value.ToString()).Result;
                        List<TagsReplacements> replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "ClassName",
                                ReplacementValue = input.Name
                            },
                            new TagsReplacements()
                            {
                                FindValue = "PrincipalName",
                                ReplacementValue = principalToSend.FirstName + " " + principalToSend.Surname
                            }
                        };
                        notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReassignedToNewClass, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true, null, new List<RelatedEntity> { new RelatedEntity(newClassRoomGroup.Id, "ClassRoomGroup") });
                    }

                    // add points for adding a new class for the principal
                    pointsService.CalculateAddNewClassToPreschool(uId);

                    return newClassRoomGroup;
                }
            }
            else
            {
                //get the users hierarchy to reuse
                var oldHierarchy = classRoomGroup.Hierarchy;

                if (input.UserId != null)
                {
                    if (hierarchy != null && oldHierarchy != classRoomGroup.Hierarchy)
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
                var previousUserId = classRoomGroup.UserId;
                classRoomGroup.Hierarchy = hierarchy;
                classRoomGroup.UserId = input.UserId;
                classRoomGroup.ClassroomId = input.ClassroomId;
                classRoomGroup.Name = input.Name;
                classRoomGroup.IsActive = input.IsActive;
                classRoomGroup.ProgrammeTypeId = programmeType;
                classRoomGroup.UpdatedBy = uId.ToString();
                classRepo.Update(classRoomGroup);

                //if this was a new assignment to a new practitioner trigger message to notify them
                if (previousUserId != input.UserId)
                {
                    var practitioner = pracRepo.GetByUserId(input.UserId.Value);
                    // only send to practitioner and not principal
                    if (practitioner != null && !practitioner.IsPrincipalOrAdmin())
                    {
                        var principalToSend = userManager.FindByIdAsync(classRoomGroup.Classroom.UserId.Value.ToString()).Result;
                        var userToSend = userManager.FindByIdAsync(input.UserId.Value.ToString()).Result;
                        List<TagsReplacements> replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "ClassName",
                                ReplacementValue = input.Name
                            },
                            new TagsReplacements()
                            {
                                FindValue = "PrincipalName",
                                ReplacementValue = principalToSend.FirstName + " " + principalToSend.Surname
                            }
                        };
                        notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReassignedToNewClass, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true, null, new List<RelatedEntity> { new RelatedEntity(classRoomGroup.Id, "ClassRoomGroup") });
                    }

                    // if the user has changed, we need to disable notification for previous user.
                    var previousUser = userManager.FindByIdAsync(previousUserId.ToString()).Result;
                    var previousReassignedMessages = notificationService.GetMessagesForUser(previousUserId.ToString(), TemplateTypeConstants.ReassignedToNewClass, classRoomGroup.Id);
                    if (previousReassignedMessages.Count > 0)
                    {
                        foreach (var item in previousReassignedMessages)
                        {
                            notificationService.DisableNotification(item.Id.ToString());
                        }
                    }
                }

                //also update the userhierarchy on classroomgroup, as well as classProgramme so that a practitioner can see this
                var learnersReassigned = UpdateLearners(repoFactory, uId.ToString(), id, hierarchy);
                UpdateChildren(repoFactory, uId.ToString(), hierarchy, learnersReassigned, input.UserId.ToString());
                UpdateClassProgrammeForPractitioner(contextAccessor, repoFactory, input.ClassroomId, hierarchy);

                // remove unassigned notification for classroom
                var messages = notificationService.GetMessages(TemplateTypeConstants.UnassignedClasses, input.ClassroomId);
                if (messages.Any())
                {
                    foreach (var item in messages)
                    {
                        notificationService.DisableNotification(item.Id.ToString());
                    }
                }
                return classRoomGroup;
            }

            // add points for adding a new class for the principal
            pointsService.CalculateAddNewClassToPreschool(uId);
            
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

            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);

            Classroom updateClass = dbRepo.GetById(input.Id);

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
                }
                //send notification of change to Coach
                /* List<TagsReplacements> replacements = new List<TagsReplacements>();
                 var principal = userManager.FindByIdAsync(updateClass.UserId).Result;
                 replacements.Add(new TagsReplacements()
                 {
                     FindValue = "PrincipalOrFAA",
                     ReplacementValue = principal.FirstName + " " + principal.Surname
                 });
                 replacements.Add(new TagsReplacements()
                 {
                     FindValue = "ProgrammeName",
                     ReplacementValue = updateClass.Name != null ? updateClass.Name : ""
                 });

                 var practitioner = practitionerRepo.GetByUserId(updateClass.UserId.ToString());
                 if (practitioner != null && practitioner.CoachHierarchy != null && practitioner.IsRegistered == true && practitioner.IsPrincipal == true)
                 {
                     var coachToSend = userManager.FindByIdAsync(practitioner.CoachHierarchy).Result;
                     if (coachToSend != null)
                     {
                         notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachAddresUpdatedScheduleVisit, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true, null,
                             new List<RelatedEntity> { new RelatedEntity(practitioner.UserId.Value, "ApplicationUser") });
                     }
                 }*/
            }

            return updateClass;
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public ClassProgramme UpdateClassProgramme(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            Guid id,
            ClassProgramme input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            IGenericRepository<ClassroomGroup, Guid> classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classroomGroup = classRepo.GetAll().Where(x => x.Id == input.ClassroomGroupId).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            if (classroomGroup == null)
            {
                throw new ArgumentException("Classroom Group not found");
            }

            string hierarchy = engine.GetUserHierarchy(classroomGroup.UserId.GetValueOrDefault(uId));

            if (string.IsNullOrEmpty(hierarchy))
            {
                throw new ArgumentException("Hierarchy for practitioner not found");
            }

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
                existingClassProgramme.IsFullDay = input.IsFullDay;
                existingClassProgramme.IsActive = input.IsActive;

                return classProgrammeRepo.Update(existingClassProgramme);
            }
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
                    if (children != null)
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

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public bool AddChildProgressReportPeriods(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            Guid classroomId,
            List<ChildProgressReportPeriodModel> childProgressReportPeriods)
        {
            var user = contextAccessor.HttpContext.GetUser() as ApplicationUser;
            var uId = user.Id; 

            if (childProgressReportPeriods == null || childProgressReportPeriods.Count < 2 || childProgressReportPeriods.Count > 4)
            {
                throw new ArgumentException("Invalid number of reporting periods submitted", "childProgressReportingPeriods");
            }

            var reportPeriodRepo = repoFactory.CreateGenericRepository<ChildProgressReportPeriod>(userContext: uId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var practitioner = practitionerRepo.GetByUserId(uId);
            var permissions = practitioner.User.UserPermissions;

            reportPeriodRepo.InsertMany(childProgressReportPeriods.Select(x => new ChildProgressReportPeriod
            {
                ClassroomId = classroomId,
                Id = x.Id,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
            }));

            // create notifications
            if (practitioner.IsPrincipalOrAdmin() || (permissions != null && permissions.Where(x => x.Permission.Name == Constants.PermissionNames.CreateProgressReports).Count() != 0))
            {
                foreach (var item in childProgressReportPeriods)
                {
                    var sevenDaysBeforeEnd = item.EndDate.AddDays(-7);
                    var replacements = new List<TagsReplacements>
                    {
                        new TagsReplacements()
                        {
                            FindValue = "ReportEndDate",
                            ReplacementValue = item.EndDate.ToString("dd MMM yyyy")
                        }
                    };
                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.FinishProgressReport, sevenDaysBeforeEnd, user, "", MessageStatusConstants.Amber, replacements, item.EndDate,
                                                                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(item.Id, "ChildProgressReportPeriod") });
                }
            }

            return true;
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public Learner UpdateLearnerWithUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            LearnerInputModel input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id.ToString();
            var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: uId);

            var learnerToUpdate = learnerRepo.GetAll().Where(x => x.UserId == input.UserId 
                                                             && x.IsActive 
                                                             && x.ClassroomGroupId == input.ClassroomGroupId).FirstOrDefault();
            if (learnerToUpdate != null) {
                learnerToUpdate.IsActive = input.IsActive;
                learnerToUpdate.StoppedAttendance = input.StoppedAttendance;
                return learnerRepo.Update(learnerToUpdate);
            }
            return null;
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public Learner UpdateLearnerHierarchy(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            string learnerId, string classroomGroupId)
        {
            var uId = contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : engine.GetAdminUserId().GetValueOrDefault();

            var learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);
            var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            var staticHierarchyRepo = repoFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: uId);

            Learner learnerUser = learnerRepo.GetAll().Where(x => x.UserId == Guid.Parse(learnerId) && x.IsActive == true).FirstOrDefault();
            Child childUser = childRepo.GetByUserId(learnerId);
            UserHierarchyEntity hierarchyEntry = staticHierarchyRepo.GetAll().Where(x => x.UserId == childUser.UserId).FirstOrDefault();

            // Get correct practitioner hierarchy
            IGenericRepository<ClassroomGroup, Guid> classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classroomGroup = classRepo.GetAll().Where(x => x.Id == Guid.Parse(classroomGroupId)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();

            if (classroomGroup == null)
            {
                throw new ArgumentException("Classroom Group not found");
            }

            string newHierarchy = engine.GetUserHierarchy(classroomGroup.UserId.GetValueOrDefault(uId));

            if (string.IsNullOrEmpty(newHierarchy))
            {
                throw new ArgumentException("Hierarchy for practitioner not found");
            }

            string childHierarchy = "";
            
            if (learnerUser != null && childUser != null && newHierarchy != null)
            {
                if (hierarchyEntry != null)
                {
                    learnerUser.Hierarchy = newHierarchy;
                    learnerRepo.Update(learnerUser);

                    hierarchyEntry.ParentId = classroomGroup.UserId.GetValueOrDefault(uId);
                    hierarchyEntry.NamedTypePath = hierarchyEntry.NamedTypePath.Replace("System.Child.", "System.Administrator.Practitioner.Child.");
                    childHierarchy = HierarchyHelper.AppendHierarchy(newHierarchy, hierarchyEntry.Key.ToString());
                    staticHierarchyRepo.Update(hierarchyEntry);

                    childUser.Hierarchy = childHierarchy;
                    childRepo.Update(childUser);
                }
            }
            return null;
        }
    }
}
