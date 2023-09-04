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

    }
}
