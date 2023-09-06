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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ExtendedNotificationMutationExtension
    {
        
        public async Task<bool> SendAnyGGNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now, userToSend);
        }

        public async Task<bool> SendAnyGGNotificationWithReplacements(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null, List<TagsReplacements> replacements = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now, userToSend, null, MessageStatusConstants.Blue, replacements);
        }

        public async Task<bool> SendGGWalkthroughNotificationNotification(
  [Service] UserManager<ApplicationUser> userManager,
  [Service] INotificationService notificationService, string userId)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGWalkthroughNotification, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, new List<TagsReplacements>());
        }

        public async Task<bool> SendGGUploadRTHNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName, string firstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "FirstName",
                ReplacementValue = firstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGUploadRTHNotification, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendGGExpectedMomDeliveryDateApproachingNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string clientFirstName, string expectedDeliveryDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClientFirstName",
                ReplacementValue = clientFirstName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ExpectedDeliveryDate",
                ReplacementValue = expectedDeliveryDate
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGExpectedMomDeliveryDateApproaching, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendGGRedAlertMaternalDistressNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string clientFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClientFirstName",
                ReplacementValue = clientFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGRedAlertMaternalDistress, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }
        public async Task<bool> SendGGChildMUACNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "childFirstName",
                ReplacementValue = childFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildMUAC, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }
        public async Task<bool> SendGGChildGrowthIssueNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "childFirstName",
                ReplacementValue = childFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildGrowthIssue, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendGGMultipleReferralsNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string clientFirstName, string noOfReferrals)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ClientFirstName",
                ReplacementValue = clientFirstName
            },new TagsReplacements()
            {
                FindValue = "NoOfReferrals",
                ReplacementValue = noOfReferrals
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGMultipleReferrals, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendGGVisitOverdueNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string clientFirstName, string noOfReferrals)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
                {
                    FindValue = "ClientFirstName",
                    ReplacementValue = clientFirstName
                } 
            };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGVisitOverdue, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements);
        }

        public async Task<bool> SendGGReferralDangerSignsNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string firstName, string dangerSignsList)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "FirstName",
                ReplacementValue = firstName
            },new TagsReplacements()
            {
                FindValue = "DangerSignsList",
                ReplacementValue = dangerSignsList
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSigns, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGTwoVisitsMissedNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName, string clientFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            },new TagsReplacements()
            {
                FindValue = "ClientFirstName",
                ReplacementValue = clientFirstName
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTwoVisitsMissed, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGChildOlderThanFiveNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName, string removalDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            },new TagsReplacements()
            {
                FindValue = "RemovalDate",
                ReplacementValue = removalDate
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildOlderThanFive, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGReferDOHANotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            },new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferDOHA, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendGGReferSASSANotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            },new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferSASSA, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGMaternalDistressNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGMaternalDistress, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGClinicVisitsNotUpToDateNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGClinicVisitsNotUpToDate, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGPregnantMomLowMUACNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPregnantMomLowMUAC, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGChildMUACMalnutritionNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string childFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildMUACMalnutrition, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGyoungerthan20Notification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGyoungerthan20, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

    }
}
