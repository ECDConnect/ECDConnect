using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.Users;

namespace EcdLink.Api.CoreApi.Managers.Notifications
{
    public class ExtendedNotificationManager
    {
        private INotificationProviderFactory<ApplicationUser> _notificationProviderFactory;

        public ExtendedNotificationManager(INotificationProviderFactory<ApplicationUser> notificationProviderFactory)
        {
            _notificationProviderFactory = notificationProviderFactory;
        }

        public async Task<bool> SendGGWalkthroughNotificationNotification(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGWalkthroughNotificationInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, new List<TagsReplacements>(), null, false, true, null, null);
        }

        public async Task<bool> SendGGChildMUACNotification(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string childFirstName, string infantUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "infantId",
                ReplacementValue = infantUserId
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildMUAC, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(infantUserId), "ApplicationUser") });
        }

        public async Task<bool> SendGGChildGrowthIssueNotification(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string childFirstName, string mothername,string infantUserId, string growthIssue)
        {
           List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ChildFirstName",
                        ReplacementValue = childFirstName
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "CaregiverFirstName",
                        ReplacementValue = mothername
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "infantId",
                        ReplacementValue = infantUserId
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "GrowthIssue",
                        ReplacementValue = growthIssue
                    });
            var userToSend = userManager.FindByIdAsync(userId).Result;
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildGrowthIssue, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(infantUserId), "ApplicationUser") });
        }
        public async Task<bool> SendGGReferralDangerSignsInfantNotification(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string firstName, string dangerSignsList, string infantUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "FirstName",
                ReplacementValue = firstName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "infantId",
                ReplacementValue = infantUserId
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "DangerSignsList",
                ReplacementValue = dangerSignsList
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSignsInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(infantUserId), "ApplicationUser") });
        }

         public async Task<bool> SendGGReferralDangerSignsMotherNotification(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string firstName, string dangerSignsList, string motherUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "FirstName",
                ReplacementValue = firstName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "motherId",
                ReplacementValue = motherUserId
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "DangerSignsList",
                ReplacementValue = dangerSignsList
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSignsMother, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(motherUserId), "ApplicationUser") });
        }

         public async Task<bool> SendGGRedAlertMaternalDistressNotificationMother(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string clientFirstName, string motherUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ClientFirstName",
                    ReplacementValue = clientFirstName
                });
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "motherId",
                    ReplacementValue = motherUserId
                });
                var userToSend = userManager.FindByIdAsync(userId).Result;
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGRedAlertMaternalDistressMother, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(motherUserId), "ApplicationUser") });
        }

         public async Task<bool> SendGGRedAlertMaternalDistressNotificationInfant(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string clientFirstName, string infantUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ClientFirstName",
                    ReplacementValue = clientFirstName
                });
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "infantId",
                    ReplacementValue = infantUserId
                });
                var userToSend = userManager.FindByIdAsync(userId).Result;
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGRedAlertMaternalDistressInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(infantUserId), "ApplicationUser") });
        }

        public async Task<bool> SendGGChildMUACMalnutritionNotification(
        [Service] ApplicationUserManager userManager,
        [Service] INotificationService notificationService, string userId, string childFirstName, string infantUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "infantId",
                ReplacementValue = infantUserId
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildMUACMalnutrition, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, null, false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(infantUserId), "ApplicationUser") });
        }

        public async Task<bool> SendGGPortalCHWMaternalDistressNotificationMother(
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService, string hcwUserId, Mother mother)
        {
            var userToSend = userManager.FindByIdAsync(hcwUserId).Result;

            List<TagsReplacements> replacements = new List<TagsReplacements>()
            {
                new TagsReplacements()
                {
                    FindValue = "CHWFirstName",
                    ReplacementValue = userToSend.FirstName
                },
                new TagsReplacements()
                {
                    FindValue = "CHWFullName",
                    ReplacementValue = userToSend.FullName
                },
                new TagsReplacements()
                {
                    FindValue = "PregnantMomFullName",
                    ReplacementValue = mother.User.FullName
                }
            };

            // Valid for 21 days after notification triggered.
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPortalCHWMaternalDistressMother, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(21), false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(mother.UserId.Value, "ApplicationUser") });
        }

        public async Task<bool> SendGGPortalCHWMaternalDistressNotificationInfant(
           [Service] ApplicationUserManager userManager,
           [Service] INotificationService notificationService, 
           string hcwUserId, Infant infant)
        {
            var userToSend = userManager.FindByIdAsync(hcwUserId).Result;

            List<TagsReplacements> replacements = new List<TagsReplacements>()
            {
                new TagsReplacements()
                {
                    FindValue = "CHWFirstName",
                    ReplacementValue = userToSend.FirstName
                },
                new TagsReplacements()
                {
                    FindValue = "CHWFullName",
                    ReplacementValue = userToSend.FullName
                },
                new TagsReplacements()
                {
                    FindValue = "CaregiverFullName",
                    ReplacementValue = infant.Caregiver.FullName
                }
            };
            
            // Valid for 21 days after notification triggered.
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPortalCHWMaternalDistressInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(21), false, true, null,
                relatedEntities: new List<RelatedEntity> { new RelatedEntity(infant.UserId.Value, "ApplicationUser") });
        }

    }
}
