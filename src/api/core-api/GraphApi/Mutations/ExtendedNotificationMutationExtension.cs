using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ExtendedNotificationMutationExtension
    {

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)]   
        public async Task<bool> SendAnyNotification(
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService,
            string templateType, string userId = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now.Date, userToSend);
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)] 
        public async Task<bool> SendAnyNotificationWithReplacements(
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService,
            string templateType, string userId = null, List<TagsReplacements> replacements = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now.Date, userToSend, null, MessageStatusConstants.Blue, replacements);
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)] 
        public async Task<bool> SendPromotedToPrincipalFAAProgrammeNotification(
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService, string userId, string programmeName, string principalOrFAA)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "ProgrammeName",
                    ReplacementValue = programmeName
                }
            };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PromotedToPrincipalOrFAA, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7), false, true);
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)] 
        public async Task<bool> SendPractitionerRemovedFromProgrammeNotification(
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService, string userId, string practitionerName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerName",
                ReplacementValue = practitionerName
            });

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerRemovedFromProgramme, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

    }
}
