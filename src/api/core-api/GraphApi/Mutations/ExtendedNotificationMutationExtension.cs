using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using EcdLink.Api.CoreApi.Services;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
            List<TagsReplacements> replacements = null;
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
        public async Task<bool> SendPromotedToPrincipalFAAProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string programmeName, string principalOrFAA)
        {
            List<TagsReplacements> replacements = null;
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
            List<TagsReplacements> replacements = null;
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
            List<TagsReplacements> replacements = null;
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

    }
}
