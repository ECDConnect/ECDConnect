using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Abstractrions.Constants;
using EcdLink.Api.CoreApi.Services;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Classroom;

namespace ECDLink.Api.CoreApi.Services
{
    public class AbsenteeService : Interfaces.IAbsenteeService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private IHttpContextAccessor _contextAccessor;
        private readonly IReassignmentService _reassignmentService;
        private readonly INotificationService _notificationService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly HierarchyEngine _hierarchyEngine;
        private string _applicationUserId;
        private IGenericRepository<Absentees, Guid> _absenteeRepo;

        public AbsenteeService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] IReassignmentService reassignmentService,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            HierarchyEngine hierarchyEngine)
        {
            _repositoryFactory = repositoryFactory;
            _reassignmentService = reassignmentService;
            _notificationService = notificationService;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = contextAccessor.HttpContext.GetUser()?.Id;
            _absenteeRepo = repositoryFactory.CreateGenericRepository<Absentees>(userContext: _applicationUserId);
        }

        public Absentees AddAbsenteeForPractitioner(
            string uId,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classroomGroupId = null,
            DateTime? absentDateEnd = null,
            Guid? practitionerRemovalHistory = null)
        {
            var updated = new Absentees();
            if (classroomGroupId != null)
            {
                reason = string.IsNullOrEmpty(reason) ? "Practitioner Marked Absent" : reason;
                var absent = new Absentees
                {
                    UserId = practitionerId,
                    Reason = reason,
                    AbsentDate = absentDate,
                    AbsentDateEnd = absentDateEnd,
                    LoggedBy = loggedByUser,
                    ReassignedClass = classroomGroupId,
                    ReassignedToPractitioner = reassignedToPractitioner,
                    UpdatedBy = loggedByUser,
                    UpdatedDate = DateTime.Now,
                    PractitionerRemovalHistoryId = practitionerRemovalHistory
                };
                updated = _absenteeRepo.Insert(absent);

                //Log to the history table for reassignment back to owner user
                _reassignmentService.AddReassignmentForPractitioner(uId, practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classroomGroupId, false, absentDateEnd);

                //send notifications a) Absentee, b) long leave
                var userToSend = _userManager.FindByIdAsync(practitionerId).Result;
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                var parentUser = _hierarchyEngine.GetUserParentUserId(practitionerId);
                if (parentUser != null)
                {
                    var parentToSend = _userManager.FindByIdAsync(parentUser).Result;

                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ParentPrincipalFAACoachName",
                        ReplacementValue = parentToSend.FirstName
                    });
                }
                else {
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "PrincipalName",
                        ReplacementValue = "Principal"
                    });
                }
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "AbsentStartDate",
                    ReplacementValue = absentDate.ToLongDateString(),
                });
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedAbsent, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements);

            }

            //Save the history so it can be reassigned
            return updated;
        }

        public List<AbsenteeDetail> GetAbsenteeByUser(string userId, DateTime? endDate = null)
        {
            var classRoomRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            List<AbsenteeDetail> absenteeDetails = new List<AbsenteeDetail>();

            var absentees = _absenteeRepo.GetAll().Where(a => a.UserId.Equals(userId)).ToList();
            if (endDate != null)
            {
                absentees = absentees.Where(a => a.AbsentDate <= endDate && a.AbsentDate >= DateTime.Now.Date).ToList();
            }

            if (absentees.Any() )
            {
                foreach (var item in absentees)
                {
                    string classRoomName = "";
                    string reassignedToPerson = "";
                    if (item.ReassignedClass!= null)
                    {
                        var classRoom = classRoomRepo.GetAll().Where(c => string.Equals(c.Id, item.ReassignedClass) && c.Name != "Unsure").FirstOrDefault(); //dont count unsure classes
                        if (classRoom != null)
                        {
                            classRoomName = classRoom.Name;
                        }
                    }
                    if (item.ReassignedToPractitioner!=null)
                    {
                        var user = _userManager.FindByIdAsync(item.ReassignedToPractitioner).Result;
                        if (user != null)
                        {
                            reassignedToPerson = user.FirstName + " " + user.Surname;
                        }
                    }

                    absenteeDetails.Add(new AbsenteeDetail() { 
                        Reason = item.Reason, 
                        AbsentDate = item.AbsentDate,
                        AbsentDateEnd = item.AbsentDateEnd,
                        ClassName = classRoomName,
                        ReassignedToPerson = reassignedToPerson,
                        ReassignedToUserId = item.ReassignedToPractitioner
                    });
                }
            }


            return absenteeDetails;

        }
    }
}
