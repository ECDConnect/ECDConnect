using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Managers;
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
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now.Date, userToSend);
        }

        public async Task<bool> SendAnyGGNotificationWithReplacements(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService,
string templateType, string userId = null, List<TagsReplacements> replacements = null)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, templateType, DateTime.Now.Date, userToSend, null, MessageStatusConstants.Blue, replacements);
        }

        public async Task<bool> SendGGWalkthroughNotificationNotification(
  [Service] ApplicationUserManager userManager,
  [Service] INotificationService notificationService, string userId)
        {
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGWalkthroughNotificationInfant, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, new List<TagsReplacements>());
        }

        public async Task<bool> SendGGUploadRTHNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGUploadRTHNotification, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendGGExpectedMomDeliveryDateApproachingNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGExpectedMomDeliveryDateApproaching, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendGGRedAlertMaternalDistressNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string clientFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "ClientFirstName",
                ReplacementValue = clientFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGRedAlertMaternalDistress, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }
        public async Task<bool> SendGGChildMUACNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string childFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "childFirstName",
                ReplacementValue = childFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildMUAC, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }
        public async Task<bool> SendGGChildGrowthIssueNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string childFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "childFirstName",
                ReplacementValue = childFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildGrowthIssue, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendGGMultipleReferralsNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGMultipleReferrals, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(1));
        }

        public async Task<bool> SendGGVisitOverdueNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGVisitOverdue, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements);
        }

        public async Task<bool> SendGGReferralDangerSignsNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferralDangerSigns, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGTwoVisitsMissedNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTwoVisitsMissed, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGVisitsNotCompleted14daysNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGVisitsNotCompleted14days, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGXVisitsMissedNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string visitsOverdue)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "VisitsOverdue",
                ReplacementValue = visitsOverdue
            }};
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGXVisitsMissed, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGChildOlderThanFiveNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildOlderThanFive, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGReferDOHANotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferDOHA, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendGGReferSASSANotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGReferSASSA, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGMaternalDistressNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGMaternalDistress, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGClinicVisitsNotUpToDateNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGClinicVisitsNotUpToDate, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGPregnantMomLowMUACNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPregnantMomLowMUAC, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGChildMUACMalnutritionNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string childFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>(){
                new TagsReplacements()
            {
                FindValue = "ChildFirstName",
                ReplacementValue = childFirstName
            } };
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGChildMUACMalnutrition, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGyoungerthan20Notification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGyoungerthan20, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGSubstanceAbuseNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string caregiverFirstName)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CaregiverFirstName",
                ReplacementValue = caregiverFirstName
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGSubstanceAbuse, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGLowBirthWeightNotification(
[Service] ApplicationUserManager userManager,
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
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGLowBirthWeight, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGAddBreastfeedingClubNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string currentMonth)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentMonth",
                ReplacementValue = currentMonth
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGAddBreastfeedingClub, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task<bool> SendGGGGAddedABreastfeedingClubNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string currentMonth, string currentClubs)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentMonth",
                ReplacementValue = currentMonth
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentClubs",
                ReplacementValue = currentClubs
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGAddedABreastfeedingClub, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }


        //GG points and Ranking
        public async Task<bool> SendGGEarningPointsNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string currentMonth)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentMonth",
                ReplacementValue = currentMonth
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGEarningPoints, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }

        public async Task<bool> SendGGEarningXPointsNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string averagePoints)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "AveragePoints",
                ReplacementValue = averagePoints
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGEarningXPoints, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(10));
        }

        public async Task<bool> SendGGTopPointsEarnerNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTopPointsEarner, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(10));
        }

        public async Task<bool> SendGGTopPointsTeamNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string totalTeamPoints)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TotalTeamPoints",
                ReplacementValue = totalTeamPoints
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTopPointsTeam, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGTop25PercPointsTeamNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string totalTeamPoints, string pointsBehindWinningTeam)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TotalTeamPoints",
                ReplacementValue = totalTeamPoints
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PointsBehindWinningTeam",
                ReplacementValue = pointsBehindWinningTeam
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGTop25PercPointsTeam, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> GGBottom75PercPointsTeam(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string ranking)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Ranking",
                ReplacementValue = ranking
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGBottom75PercPointsTeam, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGGoldTierPointsTeamNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string totalTeamPoints, string quarter)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TotalTeamPoints",
                ReplacementValue = totalTeamPoints
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Quarter",
                ReplacementValue = quarter
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGGoldTierPointsTeam, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGSilverTierPointsTeamNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string totalTeamPoints, string quarter)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TotalTeamPoints",
                ReplacementValue = totalTeamPoints
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Quarter",
                ReplacementValue = quarter
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGSilverTierPointsTeam, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGBronzeTierPointsTeamNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string totalTeamPoints, string quarter)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "TotalTeamPoints",
                ReplacementValue = totalTeamPoints
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Quarter",
                ReplacementValue = quarter
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGBronzeTierPointsTeam, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGPointsTeamPlacementNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string placement, string currentYear)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Placement",
                ReplacementValue = placement
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = currentYear
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsTeamPlacement, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGPointsTeamPlacementNotTop3Notification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string placement, string currentYear)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Placement",
                ReplacementValue = placement
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = currentYear
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsTeamPlacementNotTop3, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }
        public async Task<bool> SendGGPointsTeamPlacementNotBottom75PercNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string placement, string currentYear)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "Placement",
                ReplacementValue = placement
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = currentYear
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsTeamPlacementNotBottom75Perc, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(3));
        }

        public async Task<bool> SendGGPointsYearlySummaryNotification(
[Service] ApplicationUserManager userManager,
[Service] INotificationService notificationService, string userId, string pointsEarned, string currentYear)
        {
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "PointsEarned",
                ReplacementValue = pointsEarned
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = currentYear
            });
            var userToSend = await userManager.FindByIdAsync(userId);
            return await notificationService.SendNotificationAsync(null, TemplateTypeConstants.GGPointsYearlySummary, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(7));
        }

    }
}
