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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
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

        public async Task<bool> SendTrainee2WeekOnboardingWarningNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string traineeFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TraineeFirstName",
                ReplacementValue = traineeFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.Trainee2WeekOnboardingWarning, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendCoachNewTraineesNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string traineeFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();

            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachNewTrainees, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendCoachAddresUpdatedScheduleVisitNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string principalOrFAAName, string programmeName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PrincipalOrFAA",
                ReplacementValue = principalOrFAAName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ProgrammeName",
                ReplacementValue = programmeName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachAddresUpdatedScheduleVisit, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendCoachTraineeReadySmartspaceCheckNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string traineeFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TraineeFirstName",
                ReplacementValue = traineeFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachTraineeReadySmartspaceCheck, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendCoachVisitRequestedNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string practitionerFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerFirstName",
                ReplacementValue = practitionerFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachVisitRequested, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendNewClubleaderNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string clubLeaderName, string clubName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClubLeaderName",
                ReplacementValue = clubLeaderName
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClubName",
                ReplacementValue = clubName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.NewClubleader, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(14));
        }

        public async Task<bool> SendUserAddedToClubNotification(
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.UserAddedToClub, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendRecordCaregiverMeetingNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string meetingDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "MeetingDate",
                ReplacementValue = meetingDate
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.RecordCaregiverMeeting, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(14));
        }

        public async Task<bool> SendSetAbsenteeNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string absentStartDate, string parentPrincipalFAACoachName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "AbsentStartDate",
                ReplacementValue = absentStartDate
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ParentPrincipalFAACoachName",
                ReplacementValue = parentPrincipalFAACoachName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedAbsent, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendSetLeaveNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string absentStartDate, string absentEndDate, string parentPrincipalFAACoachName)
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
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedAbsent, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendStartupSupportEndingIn2MonthsNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, DateTime startupsupportEndDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "EndMonth",
                ReplacementValue = startupsupportEndDate.Month.ToString("ddd")
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "EndYear",
                ReplacementValue = startupsupportEndDate.Year.ToString()
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.StartupSupportEndingIn2Months, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(60));
        }

        public async Task<bool> SendAllProgressReportsCompletedForClassNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.AllProgressReportsCompletedForClass, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendTopSmartStarterPointsNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string previousMonth)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PreviousMonth",
                ReplacementValue = previousMonth
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.TopSmartStarterPoints, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendEndofyearPointEarnedNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string pointsEarned)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PointsEarned",
                ReplacementValue = pointsEarned
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.EndofyearPointsEarned, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }


        public async Task<bool> SendPrincipalReportDeadlinePassedNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string practitionerFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerFirstName",
                ReplacementValue = practitionerFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalReportDeadlinePassed, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendPrincipalAllReportsDoneNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string practitionerFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PractitionerFirstName",
                ReplacementValue = practitionerFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalAllReportsDone, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendReportDeadlinePassedNotification(
[Service] UserManager<ApplicationUser> userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.ReportDeadlinePassed, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendPrincipalMovedToProgrammeNotification(
[Service] UserManager<ApplicationUser> userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalMovedToProgramme, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendFillInSelfAsessmentFormNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId, string dueDate)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "DueDate",
                ReplacementValue = dueDate
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.FillInSelfAsessmentForm, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendTraineeJourneyStartSelfNotification(
[Service] UserManager<ApplicationUser> userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.TraineeJourneyStartSelf, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }


    }
}
