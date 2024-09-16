using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ExtendedNotificationMutationExtension
    {
        
        public async Task<bool> SendAnyNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now.Date, userToSend);
        }

        public async Task<bool> SendAnyNotificationWithReplacements(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null, List<TagsReplacements> replacements = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now.Date, userToSend, null, MessageStatusConstants.Blue, replacements);
        }

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
        
       /* public async Task<bool> SendSetAbsenteeNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string absentStartDate, string parentPrincipalFAACoachName, string parentPrincipalFAACoachUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "AbsentStartDate",
                ReplacementValue = absentStartDate
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PrincipalName",
                ReplacementValue = parentPrincipalFAACoachName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerUserId",
                ReplacementValue = parentPrincipalFAACoachUserId
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedAbsent, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1).Date,false, true);
        }

        public async Task<bool> SendSetLeaveNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string absentStartDate, string absentEndDate, string parentPrincipalFAACoachName, string parentPrincipalUserId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "AbsentStartDate",
                ReplacementValue = absentStartDate
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "AbsentEndDate",
                ReplacementValue = absentEndDate
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ParentPrincipalFAACoachName",
                ReplacementValue = parentPrincipalFAACoachName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerUserId",
                ReplacementValue = parentPrincipalUserId
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedAbsent, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1).Date, false, true);
        }
      

        public async Task<bool> SendAllProgressReportsCompletedForClassNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.AllProgressReportsCompletedForClass, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }*/

        /*public async Task<bool> SendEndofyearPointEarnedNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string pointsEarned)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PointsEarned",
                ReplacementValue = pointsEarned
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.EndofyearPointsEarned, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }*/


        /*public async Task<bool> SendPrincipalReportDeadlinePassedNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string practitionerFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerFirstName",
                ReplacementValue = practitionerFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalReportDeadlinePassed, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }*/

       /* public async Task<bool> SendPrincipalAllReportsDoneNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string practitionerFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerFirstName",
                ReplacementValue = practitionerFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalAllReportsDone, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }*/

       /* public async Task<bool> SendReportDeadlinePassedNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string trackingMonth, string noOfChildren)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TrackingMonth",
                ReplacementValue = trackingMonth
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "NoOfChildren",
                ReplacementValue = noOfChildren
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReportDeadlinePassed, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
        }*/

       /* public async Task<bool> SendPrincipalMovedToProgrammeNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string trackingMonth, string noOfChildren)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TrackingMonth",
                ReplacementValue = trackingMonth
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "NoOfChildren",
                ReplacementValue = noOfChildren
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalMovedToProgramme, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
        }*/

    }
}
