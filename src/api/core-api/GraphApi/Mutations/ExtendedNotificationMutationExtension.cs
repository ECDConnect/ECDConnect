using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ExtendedNotificationMutationExtension
    {
        
        public async Task<bool> SendAnyNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now, userToSend);
        }

        public async Task<bool> SendAnyNotificationWithReplacements(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null, List<TagsReplacements> replacements = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now, userToSend, null, MessageStatusConstants.Blue, replacements);
        }

        public async Task<bool> SendPractitionerAddedToProgrammeNotification(
  [Service] UserManager<ApplicationUser> userManager,
  [Service] INotificationService notificationService, string userId, string programmeName)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, "added-to-programme", DateTime.Now, userToSend, "", MessageStatusConstants.Blue, new List<TagsReplacements>() { new TagsReplacements() { FindValue = "ProgrammeName", ReplacementValue = programmeName } });
        }
        public async Task<bool> SendDemotedAsPrincipalFAAProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string programmeName, string principalOrFAA)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "principalOrFAA",
                ReplacementValue = principalOrFAA
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ProgrammeName",
                ReplacementValue = programmeName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.DemotedFromPrincipalOrFAA, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements);
        }

        public async Task<bool> SendPrincipalChangedNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string programmeName, string principalOrFAA)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "principalOrFAA",
                ReplacementValue = principalOrFAA
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ProgrammeName",
                ReplacementValue = programmeName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalFAAChanged, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements);
        }

        public async Task<bool> SendPromotedToPrincipalFAAProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string programmeName, string principalOrFAA)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "principalOrFAA",
                ReplacementValue = principalOrFAA
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ProgrammeName",
                ReplacementValue = programmeName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PromotedToPrincipalOrFAA, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }



        public async Task<bool> SendUserAssignedToClassFromOldClassNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string className, string oldClassName, string principalName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClassName",
                ReplacementValue = className
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "OldClassName",
                ReplacementValue = oldClassName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PrincipalName",
                ReplacementValue = principalName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReassignedToNewClassFromOld, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendUserAssignedToClassNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string className, string oldClassName, string principalName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClassName",
                ReplacementValue = className
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PrincipalName",
                ReplacementValue = principalName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReassignedToNewClass, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendOverdueTraineeTasksNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, DateTime dueDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "DueDate",
                ReplacementValue = dueDate.ToString()
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.TraineeOverdueTasks, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendOnly2MoreTraineeTaskLeftsNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.TwoOnboardingStepsLeft, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendRemovedFromProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string programmeName, string principalName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ProgrammeName",
                ReplacementValue = programmeName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PrincipalName",
                ReplacementValue = principalName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.RemovedFromProgramme, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendPractitionerRemovedFromProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string practitionerName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerName",
                ReplacementValue = practitionerName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerRemovedFromProgramme, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendUpdateFeeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = DateTime.Now.Year.ToString()
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.UpdatePreschoolFee, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31));
        }

        public async Task<bool> SendPractitionerNotAssignedToProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerNotLinkedToProgramme, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendClubleaderRoleAssignedNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string clubName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClubName",
                ReplacementValue = clubName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.ClubLeaderRoleAssigned, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31));
        }
        public async Task<bool> SendGainedCommunitySupportNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string supportDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "SupportDate",
                ReplacementValue = supportDate
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GainCommunitySupport, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31));
        }



        //Coaches Endpoints
        public async Task<bool> SendCoachVisitsOverdueNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachVisitsOverdue, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendCoachRemoveTraineeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string traineeName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TraineeName",
                ReplacementValue = traineeName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachRemoveTrainee, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
        }

    }
}
