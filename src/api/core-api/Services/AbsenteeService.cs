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

namespace ECDLink.Api.CoreApi.Services
{
    public class AbsenteeService : Interfaces.IAbsenteeService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly IReassignmentService _reassignmentService;
        private readonly INotificationService _notificationService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly HierarchyEngine _hierarchyEngine;

        public AbsenteeService(
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
        }

        public Absentees AddAbsenteeForPractitioner(
            string uId,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classroomGroupId = null,
            Guid? practitionerRemovalHistory = null)
        {
            var absenteeRepo = _repositoryFactory.CreateRepository<Absentees>(userContext: uId);
            var updated = new Absentees();
            if (classroomGroupId != null)
            {
                reason = string.IsNullOrEmpty(reason) ? "Practitioner Marked Absent" : reason;
                var absent = new Absentees
                {
                    UserId = practitionerId,
                    Reason = reason,
                    AbsentDate = absentDate,
                    LoggedBy = loggedByUser,
                    ReassignedClass = classroomGroupId,
                    ReassignedToPractitioner = reassignedToPractitioner,
                    UpdatedBy = loggedByUser,
                    UpdatedDate = DateTime.Now,
                    PractitionerRemovalHistoryId = practitionerRemovalHistory
                };
                updated = absenteeRepo.Insert(absent);

                //Log to the history table for reassignment back to owner user
                _reassignmentService.AddReassignmentForPractitioner(uId, practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classroomGroupId, false);

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
    }
}
