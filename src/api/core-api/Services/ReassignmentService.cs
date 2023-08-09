using DotLiquid.Util;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Core.Services
{
    public class ReassignmentService : IReassignmentService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly ISystemSetting<AbsenteeCutoffDelayOptions> _absenteeDelay;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly AttendanceTrackingRepository _attendanceRepo;

        public ReassignmentService(
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            ISystemSetting<InvitationCutoffDelayOptions> invitationDelay, [Service] AttendanceTrackingRepository attendanceRepo)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _attendanceRepo = attendanceRepo;
        }

        public void ReassignAbsentees()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            int hrsToReassign = int.Parse(_absenteeDelay.Value.AbsenteeCutoffDelay);
            var dbRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: adminId);
            //get all entries that ha snot yet been reassigned back to where they should be
            var reassignments = dbRepo.GetAll()
                                        .Where(x => x.ReassignedBackToDate == null)
                                        .ToList();

            if (reassignments.Count > 0)
            {
                foreach (var reassign in reassignments)
                {
                    if (reassign.ReassignedToDate <= DateTime.Now.AddHours(-hrsToReassign))
                    {
                        ReassignClassroomsFromHistory(adminId, reassign.UserId);
                    }
                }
            }
        }

        public void AssignFutureDatedAbsentees()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            int hrsToReassign = int.Parse(_absenteeDelay.Value.AbsenteeCutoffDelay);
            var dbRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: adminId);
            //get all future dated absentees - where created date < Absentdate but absentdate is today
            var reassignments = dbRepo.GetAll()
                                        .Where(x => x.ReassignedBackToDate == null)
                                        .ToList();

            if (reassignments.Count > 0)
            {
                foreach (var reassign in reassignments)
                {
                    if (reassign.ReassignedToDate <= DateTime.Now.AddHours(-hrsToReassign))
                    {
                        ReassignClassroomsFromHistory(adminId, reassign.UserId);
                    }
                }
            }
        }

        public void ExpireRelationshipLinks()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practiRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var pracsToExpire = practiRepo.GetAll()
                                        .Where(x => x.IsLeaving == true)
                                        .Where(x => x.DateToBeRemoved != null)
                                        .ToList();

            var serviceSchedulerRepo = _repositoryFactory.CreateGenericRepository<ServiceScheduler>(userContext: adminId);
            var schedLine = serviceSchedulerRepo.GetAll().Where(x => string.Equals(x.Name, "ExpireInvitationsJob")).FirstOrDefault();
            schedLine.StartTime = DateTime.Now;

            if (pracsToExpire.Count > 0)
            {
                foreach (var prac in pracsToExpire)
                {
                    if (prac.PrincipalHierarchy != null && prac.UserId != null)
                    {
                        //Reassign all classes and programmes back to principal
                        AddReassignmentForPractitioner(adminId, prac.UserId, prac.PrincipalHierarchy.ToString(), "Removing link between Principal and Practitioner", DateTime.Now, adminId, null, true);
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
            
            schedLine.UpdatedDate = DateTime.Now;
            schedLine.UpdatedBy = adminId;
            schedLine.Results = pracsToExpire.Count().ToString();
            schedLine.EndTime = DateTime.Now;
            serviceSchedulerRepo.Update(schedLine);
        }

        public bool AddReassignmentForPractitioner(string uId,
            string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            string loggedByUser,
            string classroomGroup = null,
            bool permanentAssign = false
            )
        {
            var historyRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: uId);

            try
            {
                if (startDate.Date <= DateTime.Today.Date)//  DateTime.Now.AddDays(1))//for future dated reassignments/absentees
                {
                    if (fromUserId != null && toUserId != null)
                    {
                        var toUserHierarchy = _hierarchyEngine.GetUserHierarchy((toUserId != null ? toUserId : uId));
                        var fromUserHierarchy = _hierarchyEngine.GetUserHierarchy((fromUserId != null ? fromUserId : uId));

                        //Log to the history table
                        var history = new ClassReassignmentHistory
                        {
                            UserId = fromUserId,
                            Reason = reason,
                            LoggedBy = loggedByUser,
                            ReassignedToUser = toUserId,
                            ReassignedToDate = startDate,
                            HierarchyToUser = toUserHierarchy,
                            HierarchyBackToUser = fromUserHierarchy
                        };
                       
                        if (permanentAssign) history.ReassignedBackToDate = DateTime.Now; //if a permanent reassign, set the date of ReassignedBackToDate so it doesnt get picked up for reassignment from history

                        var historySaved = historyRepo.Insert(history);

                        if (!string.IsNullOrEmpty(toUserHierarchy) && !string.IsNullOrEmpty(fromUserHierarchy))
                        {
                            //reassign classroomGroups - populate the other objects done insid ethe classroomgroups function
                            ReassignmentLists reassignment = UpdateClassroomGroups(uId, fromUserId, toUserId, fromUserHierarchy, toUserHierarchy, classroomGroup);
                            //reassign attendance
                            UpdateAttendance(fromUserId, toUserId, toUserHierarchy, reassignment.ClassProgrammesReassigned, reassignment.LearnersReassigned);
                            //update the history line with classes, children and classroomgroups also moved
                            if (reassignment.ClassroomGroupsReassigned != null) historySaved.ReassignedClassroomGroups = string.Join(";", reassignment.ClassroomGroupsReassigned);
                            if (reassignment.ClassroomsReassigned != null) historySaved.ReassignedClassrooms = string.Join(";", reassignment.ClassroomsReassigned);
                            if (reassignment.ClassProgrammesReassigned != null) historySaved.ReassignedClassProgrammes = string.Join(";", reassignment.ClassProgrammesReassigned);
                            if (reassignment.ChildrenReassignedUserIds != null) historySaved.ReassignedChildrenUserIds = string.Join(";", reassignment.ChildrenReassignedUserIds);
                            if (reassignment.LearnersReassigned != null) historySaved.ReassignedLearners = string.Join(";", reassignment.LearnersReassigned);
                            historyRepo.Update(historySaved);
                        }

                        if (startDate <= DateTime.Today) //backdating reassignments - immediately reassign everything back so that the records match up and functionality remains consistent
                        {
                            ReassignClassroomsFromHistory(uId, fromUserId);
                        }

                        return true;
                    }
                    else return false;
                }
                else return false;
            }
            catch (Exception e)
            {
                // Error
                return false;
            }
        }

        private ReassignmentLists UpdateClassroomGroups(string uId, string fromUserId,
            string toUserId, string fromUserHierarchy, string toUserHierarchy, string classroomGroup = null)
        {
            ReassignmentLists reassignment = new ReassignmentLists();
            if (toUserHierarchy != null && fromUserHierarchy != null)
            {
                List<string> classgroupList = new List<string>();
                var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
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
                        reassignment.ClassroomsReassigned = UpdateClassrooms(uId, fromUserId, toUserId, toUserHierarchy, updatedClassroomGroup.ClassroomId.ToString());
                        //update classProgramme
                        reassignment.ClassProgrammesReassigned = UpdateClassProgrammes(uId, classroomGroupObj.Id, toUserHierarchy);
                        //reassign learners
                        reassignment.LearnersReassigned = UpdateLearners(uId, classroomGroupObj.Id, fromUserHierarchy, toUserHierarchy);
                        //reassign children
                        reassignment.ChildrenReassignedUserIds = UpdateChildren(uId, toUserHierarchy, reassignment.LearnersReassigned, toUserId);
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
                            reassignment.ClassProgrammesReassigned = UpdateClassProgrammes(uId, classGroup.Id, toUserHierarchy);
                            //reassign learners
                            reassignment.LearnersReassigned = UpdateLearners(uId, classGroup.Id, fromUserHierarchy, toUserHierarchy);
                            //reassign children
                            reassignment.ChildrenReassignedUserIds = UpdateChildren(uId, toUserHierarchy, reassignment.LearnersReassigned, toUserId);
                        }
                    }
                    //update classroom
                    reassignment.ClassroomsReassigned = UpdateClassrooms(uId, fromUserId, toUserId, toUserHierarchy, null);
                }
                reassignment.ClassroomGroupsReassigned = classgroupList;
            }
            return reassignment;
        }

        private List<string> UpdateClassrooms(string uId, string fromUserId,
            string toUserId, string toUserHierarchy, string classroom = null)
        {
            List<string> classroomsReassigned = new List<string>();
            var classroomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: uId);

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

        private List<string> UpdateClassProgrammes(string uId, Guid classroomGroupId, string newHierarchy)
        {
            List<string> classroomsProgrammesReassigned = new List<string>();

            var classProgrammeRepo = _repositoryFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
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

        private List<string> UpdateLearners(string uId, Guid classroomGroupId, string oldHierarchy, string newHierarchy)
        {
            List<string> learnersReassigned = new List<string>();

            var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: uId);
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

        private List<string> UpdateChildren(string uId, string newHierarchy, List<string> learnerIds, string newUserId)
        {
            List<string> childrenReassigned = new List<string>();
            var staticHierarchyRepo = _repositoryFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: uId);
            var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: uId);

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

        public bool ReassignClassroomsFromHistory(string uId, string userId = null)
        {
            var historyRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: uId);
            bool reAssigned = false;

            if (userId != null)
            {

                List<ClassReassignmentHistory> history = historyRepo.GetListByUserId(userId);
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
                                        ReassignmentLists newReassignment = UpdateClassroomGroups(uId, historyItem.ReassignedToUser, historyItem.UserId, historyItem.HierarchyToUser, historyItem.HierarchyBackToUser, reassignedGroup);
                                        //reassign attendance
                                        UpdateAttendance(historyItem.UserId, historyItem.ReassignedToUser, historyItem.HierarchyToUser, newReassignment.ClassProgrammesReassigned, newReassignment.LearnersReassigned);

                                        //Log to the history table for the inverse of the presvious historyitem to indicate reassignment to how it was before
                                        var newReassignmentHistory = new ClassReassignmentHistory
                                        {
                                            UserId = historyItem.ReassignedToUser,
                                            Reason = "Reassignment back from history item " + historyItem.Id,
                                            LoggedBy = uId,
                                            ReassignedToDate = DateTime.Now,
                                            ReassignedToUser = historyItem.UserId,
                                            ReassignedBackToUserId = null,
                                            HierarchyToUser = historyItem.HierarchyBackToUser,
                                            HierarchyBackToUser = null,
                                            ReassignedBackToDate = DateTime.Now
                                        };
                                        var newHistorySaved = historyRepo.Insert(newReassignmentHistory);

                                        //update the history line with classes, children and classroomgroups also moved
                                        if (newReassignment.ClassroomGroupsReassigned != null) newHistorySaved.ReassignedClassroomGroups = string.Join(";", newReassignment.ClassroomGroupsReassigned);
                                        if (newReassignment.ClassroomsReassigned != null) newHistorySaved.ReassignedClassrooms = string.Join(";", newReassignment.ClassroomsReassigned);
                                        if (newReassignment.ClassProgrammesReassigned != null) newHistorySaved.ReassignedClassProgrammes = string.Join(";", newReassignment.ClassProgrammesReassigned);
                                        if (newReassignment.ChildrenReassignedUserIds != null) newHistorySaved.ReassignedChildrenUserIds = string.Join(";", newReassignment.ChildrenReassignedUserIds);
                                        if (newReassignment.LearnersReassigned != null) newHistorySaved.ReassignedLearners = string.Join(";", newReassignment.LearnersReassigned);
                                        historyRepo.Update(newHistorySaved);
                                    }
                                }
                            }
                            //update the original history row to teh date its reassigned
                            historyItem.ReassignedBackToDate = DateTime.Now;
                            historyItem.ReassignedBackToUserId = historyItem.UserId;
                            historyRepo.Update(historyItem);
                            reAssigned = true;
                        }
                        else reAssigned = false;
                    }
                }
            }
            else
            {
                //run a list from all users whom is meant to be reassigned and loop but resend to same fn with userid
                List<ClassReassignmentHistory> history = historyRepo.GetAll().Where(x => x.ReassignedBackToDate == null).ToList();
                if (history.Count > 0)
                {
                    foreach (var historyItem in history)
                    {
                        ReassignClassroomsFromHistory(uId, historyItem.UserId);
                    }
                }
            }

            return reAssigned;
        }
    }
}
