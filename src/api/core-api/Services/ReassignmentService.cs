using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Core.Services
{
    public class ReassignmentService : IReassignmentService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private IHttpContextAccessor _contextAccessor;
        private readonly AttendanceTrackingRepository _attendanceRepo;
        private readonly ApplicationUserManager _userManager;
        private readonly Guid? _applicationUserId;
        private readonly IGenericRepository<Absentees, Guid> _absenteeRepo;
        private readonly IGenericRepository<ClassReassignmentHistory, Guid> _reassignmentsRepo;
        private IPersonnelService __personnelService;
        private readonly IServiceProvider _services;
        private readonly INotificationService _notificationService;

        public ReassignmentService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            [Service] ApplicationUserManager userManager,
            [Service] AttendanceTrackingRepository attendanceRepo,
            IServiceProvider services,
            INotificationService notificationService)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _attendanceRepo = attendanceRepo;
            _userManager = userManager;
            _services = services;
            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _absenteeRepo = _repositoryFactory.CreateGenericRepository<Absentees>(userContext: _applicationUserId);
            _reassignmentsRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: _applicationUserId);
            _notificationService = notificationService;
        }

        private IPersonnelService _personnelService
        {
            get
            {
                if (__personnelService == null) __personnelService = (IPersonnelService)_services.GetServices<IPersonnelService>();
                return __personnelService;
            }
        }

        public bool ReassignAbsentees()
        {
            //first process start of leaves absentees
            var absenteesDueToAssign = _absenteeRepo.GetAll()
                .Where(x => x.AbsentDate.Date <= DateTime.Now.Date && x.IsActive == true) //less than now because of backdating leave
                .Where(x => x.CompletedDate == null && x.AssignedDate == null)
                .Where(x => x.PractitionerRemovalHistoryId == null)
                .ToList();

            if (absenteesDueToAssign.Any())
            {
                foreach (var item in absenteesDueToAssign)
                {
                    var reassignmentsStart = _reassignmentsRepo.GetAll()
                    .Where(x => x.ReassignedBackToDate == null)
                    .Where(x => x.AbsenteeId.Equals(item.Id)).FirstOrDefault();

                    if (reassignmentsStart != null)
                    {
                        ProcessReassignments(reassignmentsStart.Id, false);

                        item.AssignedDate = DateTime.Now; //mark that the assignment process has started and is excluded from reruns which reset the dates
                        item.UpdatedDate = DateTime.Now;
                        item.UpdatedBy = _applicationUserId.ToStringOrNull();
                        _absenteeRepo.Update(item);
                    }
                }
            }

            //get all absentees that is due to be reassigned and excluded from the permanent removal PractitionerRemovalHistory
            var absenteesDueToReassign = _absenteeRepo.GetAll()
                .Where(x => x.AbsentDateEnd.HasValue && x.AbsentDateEnd.Value.Date < DateTime.Now.Date) //only day after end date to reassign back
                .Where(x => x.CompletedDate == null)
                .Where(x => x.AssignedDate.HasValue && x.AssignedDate.Value.Date <= DateTime.Now.Date) //items that has already started the assignment process but not yet complete
                .Where(x => x.PractitionerRemovalHistoryId == null)
                .ToList();

            if (absenteesDueToReassign.Any())
            {
                foreach (var item in absenteesDueToReassign)
                {
                    var reassignmentsEnd = _reassignmentsRepo.GetAll()
                    .Where(x => x.ReassignedBackToDate == null)
                    .Where(x => x.AbsenteeId.Equals(item.Id)).FirstOrDefault();
                    if (reassignmentsEnd != null)
                    {
                        ProcessReassignments(reassignmentsEnd.Id, true);
                        
                        item.CompletedDate = DateTime.Now;
                        item.UpdatedDate = DateTime.Now;
                        item.UpdatedBy = _applicationUserId.ToStringOrNull();
                        _absenteeRepo.Update(item);
                    }
                }
            }

            return absenteesDueToReassign.Any();
        }

        public void ExpireRelationshipLinks()
        {
            var practiRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            var pracsToExpire = practiRepo.GetAll()
                                        .Where(x => x.IsLeaving == true)
                                        .Where(x => x.DateToBeRemoved != null)
                                        .ToList();

            if (pracsToExpire.Count > 0)
            {
                foreach (var prac in pracsToExpire)
                {
                    if (prac.PrincipalHierarchy != null && prac.UserId.Value != Guid.Empty)
                    {
                        //Reassign all classes and programmes back to principal
                        AddReassignmentForPractitioner(
                            prac.UserId.ToString(), 
                            prac.PrincipalHierarchy.ToString(), 
                            "Removing link between Principal and Practitioner", 
                            DateTime.Now,
                            _applicationUserId.ToStringOrNull(), 
                            null, 
                            true);

                        _notificationService.ExpireNotificationsTypesForUser(prac.PrincipalHierarchy.ToString(), TemplateTypeConstants.RejectedInvitation, prac.User.FirstName + " " + prac.User.Surname );
                    }

                    prac.DateToBeRemoved = null;
                    prac.DateAccepted = null;
                    prac.DateLinked = null;
                    prac.IsLeaving = false;
                    //update and clear the principals details
                    prac.PrincipalHierarchy = null;
                    prac.ShareInfo = false;

                    practiRepo.Update(prac);                    
                }
            }
        }

        public bool AddReassignmentForPractitioner(string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            string loggedByUser,
            string classroomGroup = null,
            bool permanentAssign = false,
            DateTime? endDate = null,
            bool isRoleAssign = false,
            string fromRole = null,
            string toRole = null,
            string roleAssignedToUser = null,
            string absenteeId = null
            )
        {
            bool isReassigned = false;
            try
            {
                if (fromUserId != null)
                {
                    //what about duplicates?
                    ClassReassignmentHistory reassignment = new ClassReassignmentHistory
                    {
                        UserId = Guid.Parse(fromUserId),
                        Reason = reason,
                        LoggedBy = Guid.Parse(loggedByUser),
                        ReassignedToUser = Guid.Parse(toUserId),
                        AssignedToDate = startDate
                    };

                    if (absenteeId != null)
                    {
                        reassignment.AbsenteeId = Guid.Parse(absenteeId);
                    }
                    if (permanentAssign)
                    {
                        reassignment.ReassignedBackToDate = DateTime.Now; //if a permanent reassign, set the date of ReassignedBackToDate so it doesnt get picked up for reassignment from history
                        reassignment.ReassignedToDate = DateTime.Now;
                    }
                    if (classroomGroup != null)
                    {
                        reassignment.ReassignedClassroomGroups = classroomGroup;
                    }
                    //what the role will be when reassignments kicks in
                    if (isRoleAssign)
                    {
                        if (toRole != null)
                        {
                            reassignment.AssignedRole = toRole;
                        }
                        //what the role will be when reassignment is reverted/before teh reassignment
                        if (fromRole != null)
                        {
                            reassignment.ReassignedRoleBack = fromRole;
                        }
                        if (roleAssignedToUser != null)
                        {
                            reassignment.RoleAssignedToUser = roleAssignedToUser;
                        }

                    }
                    _reassignmentsRepo.Insert(reassignment);

                    var fromUser = _userManager.FindByIdAsync(fromUserId).Result;
                    var fromUserHierarchy = _hierarchyEngine.GetUserHierarchy((fromUserId != null ? Guid.Parse(fromUserId) : _applicationUserId));
                    reassignment.HierarchyBackToUser = fromUserHierarchy;
                    if (toUserId != null)
                    {
                        var toUser = _userManager.FindByIdAsync(toUserId).Result;
                        var toUserHierarchy = _hierarchyEngine.GetUserHierarchy((toUserId != null ? Guid.Parse(toUserId) : _applicationUserId));

                        reassignment.HierarchyToUser = toUserHierarchy;
                    }

                    //provide enddate               
                    //if (endDate != null)
                        //reassignment.ReassignedToDate = (DateTime)endDate;
                    //update the reassignments
                    _reassignmentsRepo.Update(reassignment);

                    if (startDate.Date <= DateTime.Now.Date) //backdating reassignments - immediately reassign everything back so that the records match up and functionality remains consistent
                    {
                        //process the reassignment and backdate again
                        ProcessReassignments(reassignment.Id, false);

                        isReassigned = true;
                    }
                }
                else isReassigned = false;
            }
            catch (Exception)
            {
                // Error
                isReassigned = false;
            }
            return isReassigned;
        }

        public bool EditReassignment(
            string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            bool isRoleAssign = false,
            string roleAssignedToUser = null,
            string absenteeId = null,
            bool deleteReassignment = false
            )
        {
            bool isReassigned = false;
            try
            {
                if (fromUserId != null && absenteeId != null)
                {
                    var reassignment = _reassignmentsRepo.GetAll().Where(x => x.AbsenteeId.HasValue && x.AbsenteeId.Equals(new Guid(absenteeId))).FirstOrDefault();
                    if (reassignment != null)
                    {

                        if (startDate > DateTime.Now.Date)
                        {
                            if ( startDate != reassignment.AssignedToDate && reassignment.AssignedToDate.Date >= DateTime.Now.Date )
                            {
                                //change if date is still in future or today
                                reassignment.AssignedToDate = startDate;
                            }
                        
                            if (reassignment.ReassignedToUser.ToString() != toUserId)
                            {
                                reassignment.ReassignedToUser = Guid.Parse(toUserId);
                            }
                            reassignment.Reason = reason;
                        };

                        //what the role will be when reassignments kicks in
                        if (isRoleAssign)
                        {
                            if (roleAssignedToUser != null)
                            {
                                reassignment.RoleAssignedToUser = roleAssignedToUser;
                            }
                        }
                        
                        if (toUserId != null)
                        {
                            var toUserHierarchy = _hierarchyEngine.GetUserHierarchy((toUserId != null ? Guid.Parse(toUserId) : _applicationUserId));

                            reassignment.HierarchyToUser = toUserHierarchy;
                        }
                        if (deleteReassignment)
                        {
                            reassignment.IsActive = false;                        
                        }

                        //update the reassignments
                        _reassignmentsRepo.Update(reassignment);

                        if (startDate.Date <= DateTime.Now.Date && reassignment.IsActive) //backdating reassignments - immediately reassign everything back so that the records match up and functionality remains consistent
                        {
                            //process the reassignment and backdate again
                            ProcessReassignments(reassignment.Id, false);

                            isReassigned = true;
                        }
                    }
                }
                    else isReassigned = false;
                }
                catch (Exception)
                {
                    // Error
                    isReassigned = false;
                }
            return isReassigned;
        }

        public ClassReassignmentHistory ProcessReassignments(Guid reassignmentId, bool reassignBack = false)
        {
            if (reassignmentId != Guid.Empty)
            {
                var reassignment = _reassignmentsRepo.GetById(reassignmentId);
                if (reassignment != null)
                {
                    if (!reassignBack) //only forward assignments its the due date of the reassignment to start and everything needs to be shifted
                    {
                        if (reassignment.AssignedToDate.Date <= DateTime.Now.Date)
                        {
                            if (!string.IsNullOrEmpty(reassignment.HierarchyToUser) && !string.IsNullOrEmpty(reassignment.HierarchyBackToUser))
                            {
                                //reassign classroomGroups - populate the other objects done insid ethe classroomgroups function
                                ReassignmentLists reassignmentLists = UpdateClassroomGroups(reassignment.UserId.ToString(), reassignment.ReassignedToUser?.ToString(), reassignment.HierarchyBackToUser, reassignment.HierarchyToUser, reassignment.ReassignedClassroomGroups);
                                //reassign attendance
                                UpdateAttendance(reassignment.UserId.ToString(), reassignment.ReassignedToUser?.ToString(), reassignment.HierarchyToUser, reassignmentLists.ClassProgrammesReassigned, reassignmentLists.LearnersReassigned);
                                //update the history line with classes, children and classroomgroups also moved
                                if (reassignmentLists.ClassroomGroupsReassigned.Any()) reassignment.ReassignedClassroomGroups = string.Join(";", reassignmentLists.ClassroomGroupsReassigned);
                                if (reassignmentLists.ClassroomsReassigned.Any()) reassignment.ReassignedClassrooms = string.Join(";", reassignmentLists.ClassroomsReassigned);
                                if (reassignmentLists.ClassProgrammesReassigned.Any()) reassignment.ReassignedClassProgrammes = string.Join(";", reassignmentLists.ClassProgrammesReassigned);
                                if (reassignmentLists.ChildrenReassignedUserIds.Any()) reassignment.ReassignedChildrenUserIds = string.Join(";", reassignmentLists.ChildrenReassignedUserIds);
                                if (reassignmentLists.LearnersReassigned.Any()) reassignment.ReassignedLearners = string.Join(";", reassignmentLists.LearnersReassigned);
                                reassignment.AssignedToDate = DateTime.Now;
                                _reassignmentsRepo.Update(reassignment);
                            }

                            //reassigned roles and permissions
                            if (reassignment.AssignedRole != reassignment.ReassignedRoleBack && reassignment.RoleAssignedToUser != null)
                            {
                                var practiRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
                                var practitioner = practiRepo.GetByUserId(reassignment.RoleAssignedToUser);
                                if (practitioner != null) //check that this is a legtitimate user
                                {
                                    if (reassignment.AssignedRole == Roles.PRINCIPAL && reassignment.ReassignedRoleBack == Roles.PRACTITIONER)
                                    {
                                        _personnelService.SwitchPrincipal(reassignment.UserId.ToString(), reassignment.ReassignedBackToUserId.ToString());
                                    }
                                    if (reassignment.AssignedRole == Roles.PRACTITIONER && reassignment.ReassignedRoleBack == Roles.PRINCIPAL)
                                    {
                                        _personnelService.SwitchPrincipal(reassignment.ReassignedBackToUserId.ToString(), reassignment.UserId.ToString());
                                    }
                                    reassignment.AssignedRoleDate = DateTime.Now;
                                }
                            }
                        }
                    } else if (reassignBack) //only back assignments its the end due date of the reassignment to end and everything needs to be shifted back to before the reassignment/absentee)
                    {

                        if (reassignment.ReassignedBackToDate == null) //hasnt been processed yet
                        {

                            ReassignClassroomsFromHistory(reassignment.UserId.ToString(), reassignmentId.ToString());

                            //reassigned roles and permissions
                            if (reassignment.ReassignedRoleBack != reassignment.AssignedRole)
                            {
                                var practiRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
                                var practitioner = practiRepo.GetByUserId(reassignment.ReassignedToUser.ToString());
                                if (practitioner != null)
                                {
                                    if (reassignment.AssignedRole == Roles.PRINCIPAL && reassignment.ReassignedRoleBack == Roles.PRACTITIONER)
                                    {
                                        //swap ids for reassigning back
                                        _personnelService.SwitchPrincipal(reassignment.ReassignedBackToUserId.ToString(),reassignment.UserId.ToString());

                                    }
                                    if (reassignment.AssignedRole == Roles.PRACTITIONER && reassignment.ReassignedRoleBack == Roles.PRINCIPAL)
                                    {
                                        _personnelService.SwitchPrincipal(reassignment.UserId.ToString(),reassignment.ReassignedBackToUserId.ToString());

                                    }
                                    reassignment.AssignedRoleDate = DateTime.Now;
                                }
                            }
                        }
                    }

                    reassignment.AssignedToDate = DateTime.Now;
                    _reassignmentsRepo.Update(reassignment);

                    //remove all notifications for the users
                    _notificationService.ExpireNotificationsTypesForUser(reassignment.UserId.ToString(), TemplateTypeConstants.PractitionerMarkedAbsent);
                    if (reassignment.ReassignedBackToUserId.ToString() != "") {
                        _notificationService.ExpireNotificationsTypesForUser(reassignment.ReassignedBackToUserId.ToString(), TemplateTypeConstants.PractitionerMarkedAbsent);
                        _notificationService.ExpireNotificationsTypesForUser(reassignment.ReassignedBackToUserId.ToString(), TemplateTypeConstants.PrincipalMarkedOnLeave);
                        _notificationService.ExpireNotificationsTypesForUser(reassignment.ReassignedBackToUserId.ToString(), TemplateTypeConstants.PractitionerMarkedOnLeave);

                    }
                }
                return reassignment;
            } else { return null; }

        }


        private ReassignmentLists UpdateClassroomGroups(string fromUserId,
            string toUserId, string fromUserHierarchy, string toUserHierarchy, string classroomGroup = null)
        {
            ReassignmentLists reassignment = new ReassignmentLists();
            if (toUserHierarchy != null && fromUserHierarchy != null)
            {
                List<string> classgroupList = new List<string>();
                var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
                if (classroomGroup != null)
                {

                    var classroomGroupObj = classroomGroupRepo.GetById(Guid.Parse(classroomGroup));
                    if (classroomGroupObj != null)
                    {

                        classroomGroupObj.Hierarchy = toUserHierarchy;
                        classroomGroupObj.UserId = Guid.Parse(toUserId);
                        var updatedClassroomGroup = classroomGroupRepo.Update(classroomGroupObj);
                        classgroupList.Add(updatedClassroomGroup.Id.ToString());
                        //update classroom
                        reassignment.ClassroomsReassigned = GetClassrooms(fromUserId, toUserId, toUserHierarchy, updatedClassroomGroup.ClassroomId.ToString());
                        //update classProgramme
                        reassignment.ClassProgrammesReassigned = UpdateClassProgrammes(classroomGroupObj.Id, toUserHierarchy);
                        //reassign learners
                        reassignment.LearnersReassigned = UpdateLearners(classroomGroupObj.Id, fromUserHierarchy, toUserHierarchy);
                        //reassign children
                        reassignment.ChildrenReassignedUserIds = UpdateChildren(toUserHierarchy, reassignment.LearnersReassigned, toUserId);
                    }
                }
                else
                {
                    //reassign all classrooms and classroomgroups if none in particular is given                        
                    var classroomGroups = classroomGroupRepo.GetAll().Where(x => x.UserId.ToString() == fromUserId).ToList();
                    if (classroomGroups != null)
                    {

                        foreach (var classGroup in classroomGroups)
                        {
                            classGroup.Hierarchy = toUserHierarchy;
                            classGroup.UserId = Guid.Parse(toUserId);
                            var updatedClassroomGroup = classroomGroupRepo.Update(classGroup);
                            classgroupList.Add(updatedClassroomGroup.Id.ToString());

                            //update classProgramme
                            reassignment.ClassProgrammesReassigned = UpdateClassProgrammes(classGroup.Id, toUserHierarchy);
                            //reassign learners
                            reassignment.LearnersReassigned = UpdateLearners(classGroup.Id, fromUserHierarchy, toUserHierarchy);
                            //reassign children
                            reassignment.ChildrenReassignedUserIds = UpdateChildren(toUserHierarchy, reassignment.LearnersReassigned, toUserId);
                        }
                    }
                    //update classroom
                    reassignment.ClassroomsReassigned = GetClassrooms(fromUserId, toUserId, toUserHierarchy, null);
                }
                reassignment.ClassroomGroupsReassigned = classgroupList;
            }
            return reassignment;
        }

        private List<string> GetClassrooms(string fromUserId, string toUserId, string toUserHierarchy, string classroom = null)
        {
            var classroomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            if (classroom == null)
            {
                return classroomRepo.GetAll().Where(x => x.UserId.ToString() == fromUserId).Select(x => x.Id.ToString()).ToList();
            } else
            {
                var classroomList = classroomRepo.GetAll().Where(x => x.Id == Guid.Parse(classroom)).ToList();
                if (classroomList != null)
                {
                    return classroomList.Where(x => x.UserId.Value == Guid.Parse(fromUserId)).Select(x => x.Id.ToString()).ToList();
                }
                return null;
            }
        }

        private List<string> UpdateClassProgrammes(Guid classroomGroupId, string newHierarchy)
        {
            List<string> classroomsProgrammesReassigned = new List<string>();

            var classProgrammeRepo = _repositoryFactory.CreateGenericRepository<ClassProgramme>(userContext: _applicationUserId);
            List<ClassProgramme> classProgramme = classProgrammeRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomGroupId)).ToList();
            if (classProgramme != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                foreach (ClassProgramme programme in classProgramme)
                {
                    programme.Hierarchy = newHierarchy;
                    classProgrammeRepo.Update(programme);

                    classroomsProgrammesReassigned.Add(programme.Id.ToString());
                }
            }
            return classroomsProgrammesReassigned;
        }

        private List<string> UpdateLearners(Guid classroomGroupId, string oldHierarchy, string newHierarchy)
        {
            List<string> learnersReassigned = new List<string>();

            var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: _applicationUserId);
            List<Learner> learners = learnerRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomGroupId)).ToList();
            if (learners != null && !string.IsNullOrWhiteSpace(newHierarchy))
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

        private List<string> UpdateChildren(string newHierarchy, List<string> learnerIds, string newUserId)
        {
            List<string> childrenReassigned = new List<string>();
            var staticHierarchyRepo = _repositoryFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: _applicationUserId);
            var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);

            if (learnerIds != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                foreach (var learnerId in learnerIds)
                {
                    Child children = childRepo.GetByUserId(learnerId);
                    if (children != null)
                    {
                        string childNewHierarchy = "";
                        UserHierarchyEntity childHierarchy = staticHierarchyRepo.GetAll().Where(x => x.UserId == children.UserId.Value).FirstOrDefault();

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
                            Child updatedChild = childRepo.GetByUserId(children.UserId.Value);
                            updatedChild.Hierarchy = childNewHierarchy;
                            childRepo.Update(updatedChild);
                        }
                    }
                }
            }
            return childrenReassigned;
        }

        private void UpdateAttendance(string fromUserId, string toUserId, string newHierarchy, List<string> classProgrammes, List<string> learnerIds)
        {
            //TODO: work in start end dates to attendance to prevent a history record being edited/overridden and incorrectly allocated to new practitioner
            if (classProgrammes != null) {
                foreach (var program in classProgrammes)
                {
                    if (learnerIds != null && !string.IsNullOrWhiteSpace(newHierarchy))
                    {
                        foreach (var learnerId in learnerIds)
                        {
                            List<Attendance> attendanceData = _attendanceRepo.GetAllByParentClassroom(Guid.Parse(program), learnerId, fromUserId);

                            if (attendanceData.Count > 0)
                            {
                                foreach (var attendance in attendanceData)
                                {

                                    _attendanceRepo.UpdateAttendance(attendance, toUserId);
                                }
                            }
                        }
                    }
                }
            }
        }

        public bool ReassignClassroomsFromHistory(string userId = null, string reassignmentId = null)
        {
            bool reAssigned = false;

            if (userId != null)
            {
                List<ClassReassignmentHistory> history = reassignmentId != null ? new List<ClassReassignmentHistory>() { _reassignmentsRepo.GetById(new Guid(reassignmentId)) } : _reassignmentsRepo.GetListByUserId(userId);
                if (history != null)
                {
                    //filter history only on items that has not yet been reverted
                    history = history.Where(x => x.ReassignedBackToDate == null).ToList();                    

                    foreach (var historyItem in history)
                    {
                        if (historyItem.ReassignedToUser.HasValue && !string.IsNullOrEmpty(historyItem.HierarchyToUser) && !string.IsNullOrEmpty(historyItem.HierarchyBackToUser))
                        {
                            if (!string.IsNullOrEmpty(historyItem.ReassignedClassroomGroups))
                            {
                                if (!string.IsNullOrEmpty(historyItem.ReassignedClassroomGroups))
                                {

                                    string[] reassignedClassroomGroups = historyItem.ReassignedClassroomGroups.Split(";");

                                    foreach (string reassignedGroup in reassignedClassroomGroups)
                                    {
                                        //Log to the history table the reassignment back to original user as a new row for continuation                                    
                                        ReassignmentLists newReassignment = UpdateClassroomGroups(historyItem.ReassignedToUser.ToString(), historyItem.UserId.ToString(), historyItem.HierarchyToUser, historyItem.HierarchyBackToUser, reassignedGroup);
                                        //reassign attendance
                                        UpdateAttendance(historyItem.UserId.ToString(), historyItem.ReassignedToUser.Value.ToString(), historyItem.HierarchyToUser, newReassignment.ClassProgrammesReassigned, newReassignment.LearnersReassigned);

                                        //Log to the history table for the inverse of the presvious historyitem to indicate reassignment to how it was before
                                        var newReassignmentHistory = new ClassReassignmentHistory
                                        {
                                            UserId = historyItem.ReassignedToUser.Value,
                                            Reason = "Reassignment back from history item " + historyItem.Id,
                                            LoggedBy = _applicationUserId,
                                            ReassignedToDate = DateTime.Now,
                                            ReassignedToUser = historyItem.UserId.Value,
                                            ReassignedBackToUserId = null,
                                            HierarchyToUser = historyItem.HierarchyBackToUser,
                                            HierarchyBackToUser = null,
                                            ReassignedBackToDate = DateTime.Now,
                                            AssignedToDate = DateTime.Now                                            
                                           
                                        };
                                        if (historyItem.AbsenteeId != null)
                                        {
                                            newReassignmentHistory.AbsenteeId = historyItem.AbsenteeId;
                                        }
                                        var newHistorySaved = _reassignmentsRepo.Insert(newReassignmentHistory);

                                        //update the history line with classes, children and classroomgroups also moved
                                        if (newReassignment.ClassroomGroupsReassigned != null) newHistorySaved.ReassignedClassroomGroups = string.Join(";", newReassignment.ClassroomGroupsReassigned);
                                        if (newReassignment.ClassroomsReassigned != null) newHistorySaved.ReassignedClassrooms = string.Join(";", newReassignment.ClassroomsReassigned);
                                        if (newReassignment.ClassProgrammesReassigned != null) newHistorySaved.ReassignedClassProgrammes = string.Join(";", newReassignment.ClassProgrammesReassigned);
                                        if (newReassignment.ChildrenReassignedUserIds != null) newHistorySaved.ReassignedChildrenUserIds = string.Join(";", newReassignment.ChildrenReassignedUserIds);
                                        if (newReassignment.LearnersReassigned != null) newHistorySaved.ReassignedLearners = string.Join(";", newReassignment.LearnersReassigned);
                                        _reassignmentsRepo.Update(newHistorySaved);
                                    }
                                }
                            }
                            //update the original history row to teh date its reassigned
                            historyItem.ReassignedBackToDate = DateTime.Now;                            
                            historyItem.ReassignedBackToUserId = historyItem.UserId.Value;
                            _reassignmentsRepo.Update(historyItem);
                            reAssigned = true;
                        }
                        else reAssigned = false;
                    }
                }
            }
            else
            {
                //run a list from all users whom is meant to be reassigned and loop but resend to same fn with userid
                List<ClassReassignmentHistory> history = _reassignmentsRepo.GetAll().Where(x => x.ReassignedBackToDate == null).ToList();
                if (history.Count > 0)
                {
                    foreach (var historyItem in history)
                    {
                        ReassignClassroomsFromHistory(historyItem.UserId.ToString());
                    }
                }
            }

            return reAssigned;
        }
    }
}
