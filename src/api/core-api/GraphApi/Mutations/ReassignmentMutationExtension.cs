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
using ECDLink.DataAccessLayer.Hierarchy;
using Microsoft.Azure.Documents;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using static ECDLink.Core.SystemSettings.SettingGroups;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ReassignmentMutationExtension
    {
        private readonly ISystemSetting<InvitationCutoffDelayOptions> _invitationDelay;

        public ReassignmentMutationExtension(ISystemSetting<InvitationCutoffDelayOptions> invitationDelay)
        {
            _invitationDelay = invitationDelay;
        }

        public ReassignmentMutationExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public bool AddReassignmentForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] HierarchyEngine engine,
            string fromUserId,
            string toUserId,
            string reason,
            DateTime startDate,
            string loggedByUser,
            string classroomGroup = null,
            bool permanentAssign = false
            )
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;            
            var historyRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: uId);

            try
            {
                if (fromUserId != null && toUserId != null)
                {
                    var toUserHierarchy = engine.GetUserHierarchy((toUserId != null ? toUserId : uId));
                    var fromUserHierarchy = engine.GetUserHierarchy((fromUserId != null ? fromUserId : uId));

                    //Log to the history table
                    var history = new ClassReassignmentHistory
                    {
                        UserId = fromUserId,
                        Reason = reason,
                        LoggedBy = loggedByUser,
                        ReassignedToUser = toUserId,
                        ReassignedToDate = startDate,
                        HierarchyToUser = toUserHierarchy,
                        HierarchyBackToUser = fromUserHierarchy,
                    };
                    
                    if(permanentAssign) history.ReassignedBackToDate = DateTime.Now; //if a permanent reassign, set the date of ReassignedBackToDate so it doesnt get picked up for reassignment from history
                    
                    var historySaved = historyRepo.Insert(history);

                    if (!string.IsNullOrEmpty(toUserHierarchy) && !string.IsNullOrEmpty(fromUserHierarchy)) { 
                        //reassign classroomGroups - populate the other objects done insid ethe classroomgroups function
                        ReassignmentLists reassignment = UpdateClassroomGroups(contextAccessor, repoFactory, fromUserId, toUserId, toUserHierarchy, classroomGroup);

                        //update the history line with classes, children and classroomgroups also moved
                        if (reassignment.ClassroomGroupsReassigned!=null) historySaved.ReassignedClassroomGroups = string.Join(";", reassignment.ClassroomGroupsReassigned);
                        if (reassignment.ClassroomsReassigned != null) historySaved.ReassignedClassrooms = string.Join(";", reassignment.ClassroomsReassigned);
                        if (reassignment.ClassProgrammesReassigned != null) historySaved.ReassignedClassProgrammes = string.Join(";", reassignment.ClassProgrammesReassigned);
                        if (reassignment.ChildrenReassignedUserIds != null) historySaved.ReassignedChildrenUserIds = string.Join(";", reassignment.ChildrenReassignedUserIds);
                        if (reassignment.LearnersReassigned != null) historySaved.ReassignedLearners =  string.Join(";", reassignment.LearnersReassigned);
                        historyRepo.Update(historySaved);
                    }

                    return true;
                }
                else return false;
            }
            catch (Exception e)
            {
                // Error
                return false;
            }     
        }

        private ReassignmentLists UpdateClassroomGroups([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory, string fromUserId,
            string toUserId, string toUserHierarchy, string classroomGroup = null)
        {
            ReassignmentLists reassignment = new ReassignmentLists();
            if (toUserHierarchy != null)
            {
                var uId = contextAccessor.HttpContext.GetUser().Id;
                

                var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
                if (classroomGroup != null)
                {
                    var classroomGroupObj = classroomGroupRepo.GetById(Guid.Parse(classroomGroup));
                    if (classroomGroupObj != null)
                    {
                        if (toUserHierarchy != null)
                        {
                            classroomGroupObj.Hierarchy = toUserHierarchy;
                            classroomGroupObj.UserId = Guid.Parse(toUserId);
                            var updatedClassroomGroup = classroomGroupRepo.Update(classroomGroupObj);

                            //update classroom
                            reassignment.ClassroomsReassigned = UpdateClassrooms(contextAccessor, repoFactory, fromUserId, toUserId, toUserHierarchy, updatedClassroomGroup.ClassroomId.ToString());
                            //update classProgramme
                            reassignment.ClassProgrammesReassigned = UpdateClassProgrammes(contextAccessor, repoFactory, classroomGroupObj.Id, toUserHierarchy);
                            //reassign learners
                            reassignment.LearnersReassigned = UpdateLearners(contextAccessor, repoFactory, classroomGroupObj.Id, toUserHierarchy);
                            //reassign children
                            reassignment.ChildrenReassignedUserIds = UpdateChildren(contextAccessor, repoFactory, toUserHierarchy, reassignment.LearnersReassigned);

                            reassignment.ClassroomGroupsReassigned.Append(updatedClassroomGroup.Id.ToString());
                        }
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

                            //update classProgramme
                            reassignment.ClassProgrammesReassigned = UpdateClassProgrammes(contextAccessor, repoFactory, classGroup.Id, toUserHierarchy);
                            //reassign learners
                            reassignment.LearnersReassigned = UpdateLearners(contextAccessor, repoFactory, classGroup.Id, toUserHierarchy);

                            //reassign children
                            reassignment.ChildrenReassignedUserIds = UpdateChildren(contextAccessor, repoFactory, toUserHierarchy, reassignment.LearnersReassigned);

                            reassignment.ClassroomGroupsReassigned.Append(updatedClassroomGroup.Id.ToString());
                        }
                    }
                    //update classroom
                    reassignment.ClassroomsReassigned = UpdateClassrooms(contextAccessor, repoFactory, fromUserId, toUserId, toUserHierarchy, null);
                }
            }
            return reassignment;
        }

        private string[] UpdateClassrooms([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory, string fromUserId,
            string toUserId, string toUserHierarchy, string classroom = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            string[] classroomsReassigned = null;
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            
            if (classroom != null)
            {
                // a group has been passed in, so match the userid and the classroomgroup, and update that

                var classroomList = classroomRepo.GetAll().Where(x => x.Id.Equals(classroom));
                if (classroomList != null)
                {
                    //filter to only where user id matches
                    classroomList = classroomList.Where(x => x.UserId.Equals(fromUserId));
                    if (classroomList != null)
                    {
                        foreach (var classes in classroomList)
                        {
                            classes.Hierarchy = toUserHierarchy;
                            classes.UserId = toUserId;
                            var updatedClassroomGroup = classroomRepo.Update(classes);

                            classroomsReassigned.Append(updatedClassroomGroup.Id.ToString());
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

                        classroomsReassigned.Append(updatedClassroomGroup.Id.ToString());
                    }
                }
            }
            return classroomsReassigned;
        }

        private string[] UpdateClassProgrammes([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory, Guid classroomGroupId, string newHierarchy)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            string[] classroomsProgrammesReassigned = null;

            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            ClassProgramme classProgramme = (ClassProgramme)classProgrammeRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomGroupId)).FirstOrDefault();
            if (classProgramme != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                classProgramme.Hierarchy = newHierarchy;
                classProgrammeRepo.Update(classProgramme);

                classroomsProgrammesReassigned.Append(classProgramme.Id.ToString());
            }
            return classroomsProgrammesReassigned;
        }

        private string[] UpdateLearners([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory, Guid classroomGroupId, string newHierarchy)
        {
            string[] learnersReassigned = null;
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);
            List<Learner> learners = learnerRepo.GetAll().Where(x => x.ClassroomGroupId.Equals(classroomGroupId)).ToList();
            if (learners != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                foreach (var learner in learners)
                {
                    learner.Hierarchy = newHierarchy;
                    learnerRepo.Update(learner);

                    learnersReassigned.Append(learner.UserId);
                }
            }
            return learnersReassigned;
        }

        private string[] UpdateChildren([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory, string newHierarchy, string[] learnerIds)
        {
            string[] childrenReassigned = null;
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            //List<Child> learners = childRepo.GetAll().Where(x => x.UserId.Equals(classroomGroupId)).ToList();
            if (learnerIds != null && !string.IsNullOrWhiteSpace(newHierarchy))
            {
                foreach (var learnerId in learnerIds)
                {
                    Child children = childRepo.GetByUserId(learnerId);
                    if (children != null)
                    {
                        children.Hierarchy = newHierarchy;
                        childRepo.Update(children);

                        childrenReassigned.Append(children.UserId);
                    }
                }
            }
            return childrenReassigned;
        }


        public bool ReassignClassroomsFromHistory([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var historyRepo = repoFactory.CreateRepository<ClassReassignmentHistory>(userContext: uId);
            bool reAssigned = false;
            List<ClassReassignmentHistory> history = historyRepo.GetListByUserId(userId);
            if (history != null)
            {
                int hrsToReassign = int.Parse(_invitationDelay.Value.InvitationCutoffDelay);
                //filter history only on items that ha snot yet been reverted
                history = history.Where(x => x.ReassignedBackToDate == null).ToList();
                foreach (var historyItem in history)
                {
                    //if (historyItem.ReassignedToDate <= DateTime.Now.AddHours(-hrsToReassign))
                    if (!string.IsNullOrEmpty(historyItem.ReassignedBackToUserId) && !string.IsNullOrEmpty(historyItem.ReassignedToUser) && !string.IsNullOrEmpty(historyItem.HierarchyToUser) && !string.IsNullOrEmpty(historyItem.HierarchyBackToUser))
                    {
                        if (!string.IsNullOrEmpty(historyItem.ReassignedClassroomGroups))
                        {
                            if (historyItem.ReassignedClassroomGroups.Contains(";"))
                            {
                                string[] reassignedClassroomGroups = historyItem.ReassignedClassroomGroups.Split(";");
                                //if a list of groups exist, then split them up and reassign back to initial user for each classroomgroup, and subsequently, learners,m children, classrooms and programmes
                                foreach (string reassignedGroup in reassignedClassroomGroups)
                                {
                                    //Log to the history table the reassignment back to original user as a new row for continuation                                    
                                    ReassignmentLists newReassignment = UpdateClassroomGroups(contextAccessor, repoFactory, historyItem.ReassignedToUser, historyItem.ReassignedBackToUserId, historyItem.HierarchyBackToUser, reassignedGroup);

                                    //Log to the history table for the inverse of the presvious historyitem to indicate reassignment to how it was before
                                    var newReassignmentHistory = new ClassReassignmentHistory
                                    {
                                        UserId = historyItem.ReassignedToUser,
                                        Reason = "Reassignment back from history item " + historyItem.Id,
                                        LoggedBy = uId,
                                        ReassignedToDate = DateTime.Now,
                                        ReassignedToUser = historyItem.ReassignedToUser,
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
                        var historySaved = historyRepo.Update(historyItem);
                        reAssigned = true;
                    }
                    else reAssigned = false;
                }
            }

            return reAssigned;
        }
    }
}
