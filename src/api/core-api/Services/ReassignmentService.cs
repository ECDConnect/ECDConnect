using AngleSharp.Browser.Dom;
using DotLiquid.Util;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.SmartStart.Services.Interfaces;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Core.Services
{
    public class ReassignmentService : IReassignmentService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly AttendanceTrackingRepository _attendanceRepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly string _applicationUserId;
        private readonly IGenericRepository<Absentees, Guid> _absenteeRepo;
        private readonly IGenericRepository<ClassReassignmentHistory, Guid> _reassignmentsRepo;
        //private readonly IPersonnelService _personnelService;

        public ReassignmentService(
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] AttendanceTrackingRepository attendanceRepo/*,
            [Service] IPersonnelService personnelService*/)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _attendanceRepo = attendanceRepo;
            _userManager = userManager;
            //_personnelService = personnelService;

            _absenteeRepo = _repositoryFactory.CreateGenericRepository<Absentees>(userContext: _applicationUserId);
            _reassignmentsRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: _applicationUserId);
        }

        public bool ReassignAbsentees()
        {
            //first process start of leaves absentees
            var absenteesDueToAssign = _absenteeRepo.GetAll()
                .Where(x => x.AbsentDate.Date <= DateTime.Now.Date)
                .Where(x => x.CompletedDate == null)
                //.Where(x => x.UserId == "36cef0da-a73a-4d1c-8b63-b4021adb495a")
                .Where(y => y.PractitionerRemovalHistoryId == null)
                .ToList();

            if (absenteesDueToAssign.Any())
            {
                foreach (var item in absenteesDueToAssign)
                {
                    var reassignmentsStart = _reassignmentsRepo.GetAll()
                    .Where(x => x.ReassignedBackToDate == null)
                    .Where(x => x.AbsenteeId.Equals(item.Id)).FirstOrDefault();
                    //.Where(x => absenteesDueToAssign.Select(u => u.Id).Contains(x.AbsenteeId))
                    //.Where(x => absenteesDueToAssign.Where(u => u.Id.Equals(x.AbsenteeId)))
                    //.Where(x => absenteesDueToAssign.Where(c => c.CompletedDate == null).Select(u =>  u.Id.Equals(x.AbsenteeId)))
                    //.ToList();
                    if (reassignmentsStart != null) {
                        ProcessReassignments(reassignmentsStart.Id, false);
                    }
                }
            }


            //get all absentees that is due to be reassigned and excluded from the permanent removal PractitionerRemovalHistory
            var absenteesDueToReassign = _absenteeRepo.GetAll()
                .Where(x => x.AbsentDateEnd.HasValue && x.AbsentDateEnd.Value.Date < DateTime.Now.Date)
                .Where(x => x.CompletedDate == null)
                //.Where(x => x.UserId == "36cef0da-a73a-4d1c-8b63-b4021adb495a")
                .Where(y => y.PractitionerRemovalHistoryId == null)
                .ToList();

            if (absenteesDueToReassign.Any())
            {
                foreach (var item in absenteesDueToReassign)
                {
                    var reassignmentsEnd = _reassignmentsRepo.GetAll()
                    .Where(x => x.ReassignedBackToDate == null)
                    .Where(x => x.AbsenteeId.Equals(item.Id)).FirstOrDefault();
                    //.Where(x => absenteesDueToAssign.Select(u => u.Id).Contains(x.AbsenteeId))
                    //.Where(x => absenteesDueToAssign.Where(u => u.Id.Equals(x.AbsenteeId)))
                    //.Where(x => absenteesDueToAssign.Where(c => c.CompletedDate == null).Select(u =>  u.Id.Equals(x.AbsenteeId)))
                    //.ToList();
                    if (reassignmentsEnd != null)
                    {
                        ProcessReassignments(reassignmentsEnd.Id, true);
                    }
                    item.CompletedDate = DateTime.Now;
                    _absenteeRepo.Update(item);
                }
            }

            //get all entries that ha snot yet been reassigned back to where they should be
            //var reassignments = dbRepo.GetAll()
            //                            .Where(x => x.ReassignedBackToDate == null)
            //                            .ToList();
            //var reassignments = _reassignmentsRepo.GetAll()
            //                .Where(x => x.ReassignedBackToDate == null)
            //                //.Where(x => absenteesDueToReassign.Select(u => u.UserId).Contains(x.UserId))                            
            //                .Where(x => absenteesDueToReassign.Where(u => u.Id.Equals(x.AbsenteeId)))
            //                //.Where(x => absenteesDueToReassign.Where(c => c.CompletedDate == null).Select(u =>  u.Id.Equals(x.AbsenteeId)))
            //                .ToList();
            //.Where(x => absenteesDueToReassign.Select(u => u.Id.Equals(x.AbsenteeId))
            //.Where(x => x.ReassignedBackToDate == null && x.UserId.Contains(absenteesDueToReassign.Select(x => x.UserId)))


            //if (reassignments.Count > 0)
            //{
            //    foreach (var reassign in reassignments)
            //    {
            //        ReassignClassroomsFromHistory(reassign.UserId);
            //    }
            //}
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
                    if (prac.PrincipalHierarchy != null && prac.UserId != null)
                    {
                        //Reassign all classes and programmes back to principal
                        AddReassignmentForPractitioner(
                            prac.UserId, 
                            prac.PrincipalHierarchy.ToString(), 
                            "Removing link between Principal and Practitioner", 
                            DateTime.Now, 
                            _applicationUserId, 
                            null, 
                            true);
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
            string absenteeId = null
            )
        {
            bool isReassigned = false;
            try
            {
                if (fromUserId != null)
                {
                    //make sure no other assignment exists for this user with same details
                    //var assignments = _reassignmentsRepo.GetAll().Where(x => x.UserId.Equals(Guid.Parse(fromUserId)) && x.AssignedToDate.Date == startDate.Date);
                    //if (assignments.Any())
                    //{
                    //}
                    ClassReassignmentHistory reassignment = new ClassReassignmentHistory
                    {
                        UserId = fromUserId,
                        Reason = reason,
                        LoggedBy = loggedByUser,
                        ReassignedToUser = toUserId,
                        AssignedToDate = startDate,
                        ReassignedToDate = startDate,                       
                    };

                    if (absenteeId != null)
                    {
                        reassignment.AbsenteeId = Guid.Parse(absenteeId);
                    }
                    if (permanentAssign)
                    {
                        reassignment.ReassignedBackToDate = DateTime.Now; //if a permanent reassign, set the date of ReassignedBackToDate so it doesnt get picked up for reassignment from history                        
                    }
                    if (classroomGroup != null)
                    {
                        reassignment.ReassignedClassroomGroups = classroomGroup;
                    }
                    //what the role will be when reassignments kicks in
                    if (toRole != null)
                    {
                        reassignment.AssignedRole = toRole;
                    }
                    //what the role will be when reassignment is reverted/before teh reassignment
                    if (fromRole != null)
                    {
                        reassignment.ReassignedRoleBack = fromRole;
                    }
                    _reassignmentsRepo.Insert(reassignment);

                    var fromUser = _userManager.FindByIdAsync(fromUserId).Result;
                    var fromUserHierarchy = _hierarchyEngine.GetUserHierarchy((fromUserId != null ? fromUserId : _applicationUserId));
                    reassignment.HierarchyBackToUser = fromUserHierarchy;
                    if (toUserId != null)
                    {
                        var toUser = _userManager.FindByIdAsync(toUserId).Result;
                        var toUserHierarchy = _hierarchyEngine.GetUserHierarchy((toUserId != null ? toUserId : _applicationUserId));

                        reassignment.HierarchyToUser = toUserHierarchy;
                    }

                    //provide enddate               
                    if (endDate != null)
                        reassignment.ReassignedToDate = (DateTime)endDate;
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
            catch (Exception e)
            {
                // Error
                isReassigned = false;
            }
            return isReassigned;
        }

        public ClassReassignmentHistory ProcessReassignments(Guid reassignmentId, bool reassignBack = false)
        {
            //determine are we dealing with 

            if (reassignmentId != Guid.Empty)
            {
                var reassignment = _reassignmentsRepo.GetById(reassignmentId);
                if (reassignment != null)
                {
                    if (!reassignBack) //only forward assignments its the due date of the reassignment to start and everything needs to be shifted
                    {
                        if (reassignment.AssignedToDate.Date <= DateTime.Now.Date)
                        { //|| reassignment.ReassignedToDate
                            if (!string.IsNullOrEmpty(reassignment.HierarchyToUser) && !string.IsNullOrEmpty(reassignment.HierarchyBackToUser))
                            {
                                //reassign classroomGroups - populate the other objects done insid ethe classroomgroups function
                                ReassignmentLists reassignmentLists = UpdateClassroomGroups(reassignment.UserId, reassignment.ReassignedToUser, reassignment.HierarchyBackToUser, reassignment.HierarchyToUser, reassignment.ReassignedClassroomGroups);
                                //reassign attendance
                                UpdateAttendance(reassignment.UserId, reassignment.ReassignedToUser, reassignment.HierarchyToUser, reassignmentLists.ClassProgrammesReassigned, reassignmentLists.LearnersReassigned);
                                //update the history line with classes, children and classroomgroups also moved
                                if (reassignmentLists.ClassroomGroupsReassigned != null) reassignment.ReassignedClassroomGroups = string.Join(";", reassignmentLists.ClassroomGroupsReassigned);
                                if (reassignmentLists.ClassroomsReassigned != null) reassignment.ReassignedClassrooms = string.Join(";", reassignmentLists.ClassroomsReassigned);
                                if (reassignmentLists.ClassProgrammesReassigned != null) reassignment.ReassignedClassProgrammes = string.Join(";", reassignmentLists.ClassProgrammesReassigned);
                                if (reassignmentLists.ChildrenReassignedUserIds != null) reassignment.ReassignedChildrenUserIds = string.Join(";", reassignmentLists.ChildrenReassignedUserIds);
                                if (reassignmentLists.LearnersReassigned != null) reassignment.ReassignedLearners = string.Join(";", reassignmentLists.LearnersReassigned);
                                _reassignmentsRepo.Update(reassignment);
                            }

                            //reassigned roles and permissions
                            if (reassignment.AssignedRole != reassignment.ReassignedRoleBack)
                            {
                                var practiRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
                                var practitioner = practiRepo.GetByUserId(reassignment.UserId);
                                if (practitioner != null)
                                {
                                    if (reassignment.AssignedRole == Roles.PRINCIPAL && reassignment.ReassignedRoleBack == Roles.PRACTITIONER)
                                    {
                                        //_personnelService.SwitchPrincipal(reassignment.UserId, reassignment.ReassignedBackToUserId);

                                    }
                                    if (reassignment.AssignedRole == Roles.PRACTITIONER && reassignment.ReassignedRoleBack == Roles.PRINCIPAL)
                                    {
                                        //_personnelService.SwitchPrincipal(reassignment.ReassignedBackToUserId, reassignment.UserId);

                                    }
                                    //FAA to principal
                                    if (reassignment.AssignedRole == "FAA" && reassignment.ReassignedRoleBack == Roles.PRACTITIONER)
                                    {
                                        practitioner.IsFundaAppAdmin = true;
                                    }
                                    if (reassignment.AssignedRole == Roles.PRACTITIONER && reassignment.ReassignedRoleBack == "FAA")
                                    {
                                        practitioner.IsFundaAppAdmin = false;
                                    }
                                    reassignment.AssignedRoleDate = DateTime.Now;
                                    _reassignmentsRepo.Update(reassignment);
                                }
                            }
                        }
                    } else if (reassignBack) //only back assignments its the end due date of the reassignment to end and everything needs to be shifted back to before the reassignment/absentee)
                    {

                        if (reassignment.ReassignedBackToDate.HasValue && reassignment.ReassignedBackToDate.Value.Date <= DateTime.Now.Date)
                        { //|| reassignment.ReassignedToDate
                            if (!string.IsNullOrEmpty(reassignment.HierarchyToUser) && !string.IsNullOrEmpty(reassignment.HierarchyBackToUser))
                            {
                                //reassign classroomGroups - populate the other objects done insid ethe classroomgroups function
                                ReassignmentLists reassignmentLists = UpdateClassroomGroups(reassignment.UserId, reassignment.ReassignedToUser, reassignment.HierarchyBackToUser, reassignment.HierarchyToUser, reassignment.ReassignedClassroomGroups);
                                //reassign attendance
                                UpdateAttendance(reassignment.ReassignedToUser, reassignment.UserId, reassignment.HierarchyBackToUser, reassignmentLists.ClassProgrammesReassigned, reassignmentLists.LearnersReassigned);
                                //update the history line with classes, children and classroomgroups also moved
                                if (reassignmentLists.ClassroomGroupsReassigned != null) reassignment.ReassignedClassroomGroups = string.Join(";", reassignmentLists.ClassroomGroupsReassigned);
                                if (reassignmentLists.ClassroomsReassigned != null) reassignment.ReassignedClassrooms = string.Join(";", reassignmentLists.ClassroomsReassigned);
                                if (reassignmentLists.ClassProgrammesReassigned != null) reassignment.ReassignedClassProgrammes = string.Join(";", reassignmentLists.ClassProgrammesReassigned);
                                if (reassignmentLists.ChildrenReassignedUserIds != null) reassignment.ReassignedChildrenUserIds = string.Join(";", reassignmentLists.ChildrenReassignedUserIds);
                                if (reassignmentLists.LearnersReassigned != null) reassignment.ReassignedLearners = string.Join(";", reassignmentLists.LearnersReassigned);
                                _reassignmentsRepo.Update(reassignment);
                            }

                            //reassigned roles and permissions
                            if (reassignment.ReassignedRoleBack != reassignment.AssignedRole)
                            {
                                var practiRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
                                var practitioner = practiRepo.GetByUserId(reassignment.ReassignedToUser);
                                if (practitioner != null)
                                {
                                    if (reassignment.AssignedRole == Roles.PRINCIPAL && reassignment.ReassignedRoleBack == Roles.PRACTITIONER)
                                    {
                                        //swap ids for reassigning back
                                        //_personnelService.SwitchPrincipal(reassignment.ReassignedBackToUserId,reassignment.UserId);

                                    }
                                    if (reassignment.AssignedRole == Roles.PRACTITIONER && reassignment.ReassignedRoleBack == Roles.PRINCIPAL)
                                    {
                                        //_personnelService.SwitchPrincipal(reassignment.UserId,reassignment.ReassignedBackToUserId);

                                    }
                                    //FAA to principal
                                    if (reassignment.ReassignedRoleBack == "FAA" && reassignment.AssignedRole == Roles.PRACTITIONER)
                                    {
                                        practitioner.IsFundaAppAdmin = true;
                                    }
                                    if (reassignment.ReassignedRoleBack == Roles.PRACTITIONER && reassignment.AssignedRole == "FAA")
                                    {
                                        practitioner.IsFundaAppAdmin = false;
                                    }
                                    reassignment.AssignedRoleDate = DateTime.Now;
                                    _reassignmentsRepo.Update(reassignment);
                                }
                            }
                        }

                    }

                    reassignment.AssignedToDate = DateTime.Now;
                    _reassignmentsRepo.Update(reassignment);
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
                        reassignment.ClassroomsReassigned = UpdateClassrooms(fromUserId, toUserId, toUserHierarchy, updatedClassroomGroup.ClassroomId.ToString());
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
                    reassignment.ClassroomsReassigned = UpdateClassrooms(fromUserId, toUserId, toUserHierarchy, null);
                }
                reassignment.ClassroomGroupsReassigned = classgroupList;
            }
            return reassignment;
        }

        private List<string> UpdateClassrooms(string fromUserId,
            string toUserId, string toUserHierarchy, string classroom = null)
        {
            List<string> classroomsReassigned = new List<string>();
            var classroomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);

            if (classroom != null)
            {
                // a group has been passed in, so match the userid and the classroomgroup, and update that
                var classroomList = classroomRepo.GetAll().Where(x => x.Id.Equals(classroom)).ToList();
                if (classroomList != null)
                {
                    //filter to only where user id matches
                    classroomList = classroomList.Where(x => x.UserId.Equals(fromUserId)).ToList();
                    if (classroomList != null)
                    {
                        foreach (var classes in classroomList)
                        {
                            classes.Hierarchy = toUserHierarchy;
                            classes.UserId = toUserId;
                            var updatedClassroomGroup = classroomRepo.Update(classes);

                            classroomsReassigned.Add(updatedClassroomGroup.Id.ToString());
                        }
                    }
                }
            }
            else
            {
                //reassign all classrooms and classroomgroups if none in particular is given                        
                var classroomList = classroomRepo.GetAll().Where(x => x.UserId.ToString() == fromUserId).ToList();
                if (classroomList != null)
                {
                    foreach (var classes in classroomList)
                    {
                        classes.Hierarchy = toUserHierarchy;
                        classes.UserId = toUserId;
                        var updatedClassroomGroup = classroomRepo.Update(classes);

                        classroomsReassigned.Add(updatedClassroomGroup.Id.ToString());
                    }
                }
            }
            return classroomsReassigned;
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
                        learnersReassigned.Add(learner.UserId);
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

        private void UpdateAttendance(string fromUserId, string toUserId, string newHierarchy, List<string> classProgrammes, List<string> learnerIds)
        {
            //TODO: work in start end dates to attendance to prevent a history record being edited/overridden and incorrectly allocated to new practitioner
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

        public bool ReassignClassroomsFromHistory(string userId = null)
        {
            bool reAssigned = false;

            if (userId != null)
            {
                List<ClassReassignmentHistory> history = _reassignmentsRepo.GetListByUserId(userId);
                if (history != null)
                {
                    //filter history only on items that has not yet been reverted
                    history = history.Where(x => x.ReassignedBackToDate == null).ToList();
                    foreach (var historyItem in history)
                    {
                        if (!string.IsNullOrEmpty(historyItem.ReassignedToUser) && !string.IsNullOrEmpty(historyItem.HierarchyToUser) && !string.IsNullOrEmpty(historyItem.HierarchyBackToUser))
                        {
                            if (!string.IsNullOrEmpty(historyItem.ReassignedClassroomGroups))
                            {
                                if (!string.IsNullOrEmpty(historyItem.ReassignedClassroomGroups))
                                {

                                    string[] reassignedClassroomGroups = historyItem.ReassignedClassroomGroups.Split(";");

                                    foreach (string reassignedGroup in reassignedClassroomGroups)
                                    {
                                        //Log to the history table the reassignment back to original user as a new row for continuation                                    
                                        ReassignmentLists newReassignment = UpdateClassroomGroups(historyItem.ReassignedToUser, historyItem.UserId, historyItem.HierarchyToUser, historyItem.HierarchyBackToUser, reassignedGroup);
                                        //reassign attendance
                                        UpdateAttendance(historyItem.UserId, historyItem.ReassignedToUser, historyItem.HierarchyToUser, newReassignment.ClassProgrammesReassigned, newReassignment.LearnersReassigned);

                                        //Log to the history table for the inverse of the presvious historyitem to indicate reassignment to how it was before
                                        var newReassignmentHistory = new ClassReassignmentHistory
                                        {
                                            UserId = historyItem.ReassignedToUser,
                                            Reason = "Reassignment back from history item " + historyItem.Id,
                                            LoggedBy = _applicationUserId,
                                            ReassignedToDate = DateTime.Now,
                                            ReassignedToUser = historyItem.UserId,
                                            ReassignedBackToUserId = null,
                                            HierarchyToUser = historyItem.HierarchyBackToUser,
                                            HierarchyBackToUser = null,
                                            ReassignedBackToDate = DateTime.Now
                                        };
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
                            historyItem.ReassignedBackToUserId = historyItem.UserId;
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
                        ReassignClassroomsFromHistory(historyItem.UserId);
                    }
                }
            }

            return reAssigned;
        }
    }
}
