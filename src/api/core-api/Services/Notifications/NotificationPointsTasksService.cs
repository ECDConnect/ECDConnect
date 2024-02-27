using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Services
{
    public partial class NotificationTasksService : INotificationTasksService
    {
        public async Task MonthlyTopPointsEarnerNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: adminId);

            var clubs = clubRepo.GetAll().Where(x => x.IsActive).ToList();

            var lastMonth = DateTime.Now.GetEndOfPreviousMonth();

            var replacements = new List<TagsReplacements> 
            {
                new TagsReplacements()
                {
                    FindValue = "PreviousMonth",
                    ReplacementValue = lastMonth.ToString("MMMM")
                }
            };

            foreach (var club in clubs)
            {
                var userPoints = _pointsService.GetClubMemberPointsTotals(club.Id, lastMonth.Year, lastMonth.Month).OrderByDescending(x => x.Value);

                if(!userPoints.Any()) 
                {
                    continue;
                }

                // Get all with the top points earned
                var topEarners = userPoints.Where(x => x.Value == userPoints.First().Value).ToList();

                if (topEarners.Count() == 1)
                {
                    var userToSend = await _userManager.FindByIdAsync(topEarners.First().Key);
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.TopSmartStarterPoints, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
                }
            }
        }

        public async Task MonthlyEarnMorePointsNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: adminId);
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            var clubs = clubRepo.GetAll().Where(x => x.IsActive).ToList();
                        

            foreach (var club in clubs)
            {
                var userPoints = _pointsService.GetClubMemberPointsTotals(club.Id, DateTime.Now.Year, DateTime.Now.Month).OrderByDescending(x => x.Value).ToList();

                var midPosition = userPoints.Count() / 2;

                for(int i = 0; i < userPoints.Count(); i++)
                {
                    var practitioner = practitionerRepo.GetByUserId(userPoints[i].Key);

                    // Check user hasn't earned max - TODO
                    var isPrincipalOrAdmin = 
                        (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value) || 
                        (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value);

                    if ((isPrincipalOrAdmin && userPoints[i].Value >= Constants.PointsEngineSettings.monthly_points_max_principal_or_admin) ||
                        (!isPrincipalOrAdmin && userPoints[i].Value >= Constants.PointsEngineSettings.monthly_points_max_practitioner))
                    {
                        continue;
                    }

                    if (i <= midPosition)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.MonthlyPointsReminderA, DateTime.Now.Date, practitioner.User, "", MessageStatusConstants.Green, null, DateTime.Now.AddDays(7));
                    }
                    else
                    {
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "AveragePoints",
                                ReplacementValue = userPoints[i].Value.ToString(),
                            }
                        };
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.MonthlyPointsReminderA, DateTime.Now.Date, practitioner.User, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
                    }
                }
            }
        }

        public async Task YearlyPointsSummaryNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            var practitionerUsers = practitionerRepo.GetAll().Where(x => x.IsActive).Select(x => x.User).ToList();
            var userPoints = _pointsService.GetUserPointsTotals(practitionerUsers.Select(x => x.Id).ToList(), DateTime.Now.Year);

            foreach (var user in practitionerUsers)
            {
                var points = userPoints.FirstOrDefault(x => x.Key == user.Id.ToString()).Value;

                var replacements = new List<TagsReplacements>
                {
                    new TagsReplacements()
                    {
                        FindValue = "PointsEarned",
                        ReplacementValue = points.ToString(),
                    }
                };

                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.EndofyearPointsEarned, DateTime.Now.Date, user, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
            }
        }
            
    }
}
