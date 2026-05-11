using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class NotificationMutationExtension
    {
        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Update)]
        public async Task<bool> DisableNotification([Service] INotificationService notificationService, string notificationId)
        {
            return await notificationService.DisableNotification(notificationId);
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Update)]
        public async Task<bool> MarkAsReadNotification([Service] INotificationService notificationService, string notificationId)
        {
            return await notificationService.MarkAsReadNotification(notificationId);
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)]
        public async Task<BulkInvitationResult> SendNotificationToUser(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ApplicationUserManager userManager,
          [Service] IHttpContextAccessor accessor,
          IEnumerable<string> userIds)
        {
            // Create result
            var result = new BulkInvitationResult() { Failed = userIds.ToList(), Success = new List<string>() };
            // Get current and other admins
            var currentUserId = accessor.HttpContext.GetUser().Id;
            var adminUsers = await userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR);
            var admins = adminUsers?.Select(u => u.Id);
            var guidUserIds = userIds.Select(x => Guid.Parse(x)).ToList();
            var invitedAdmins = adminUsers.Where(a => guidUserIds.Contains(a.Id));
            var currentUser = adminUsers.FirstOrDefault(u => u.Id == currentUserId);
            var currentUserIsAdmin = currentUser is not null;

            // Portal is for admins, so if there are no admins, no invitations can be sent
            // Only admins can send invitations to admins
            if (!currentUserIsAdmin || invitedAdmins?.Count() < 1)
                return result;

            // Add reqested users that aren't admins to failedInvitations
            result.Failed = userIds.Except(invitedAdmins.Select(a => a.Id.ToString())).ToList();

            foreach (var invitedAdmin in invitedAdmins)
            {
                try
                {
                    var token = await invitationManager.GenerateTokenAsync(invitedAdmin);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add(invitedAdmin.Id.ToString());
                        continue;
                    }
                    await notificationManager.SendAdminInvitationAsync(invitedAdmin, token);
                    result.Success.Add(invitedAdmin.Id.ToString());
                }
                catch
                {
                    result.Failed.Add(invitedAdmin.Id.ToString());
                }
            }

            return result;
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Update)]
        public async Task<bool> SaveBulkMessagesForAdmin(
            [Service] AuthenticationDbContext dbContext,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory,
            MessageLogModel input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            if (!contextAccessor.HttpContext.IsInRole(new[] { Roles.ADMINISTRATOR, Roles.SUPER_ADMINISTRATOR }))
            {
                throw new UnauthorizedAccessException("You do not have permission to perform this action.");
            }

            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var messageTemplateRepo = repoFactory.CreateGenericRepository<MessageTemplate>(userContext: uId);

            if (input.RoleIds.Count == 0)
            {
                return false;
            }

            List<Guid> userIds = new List<Guid>();
            List<Guid> messageUserIds = new List<Guid>();

            var isPrincipal = input.RoleIds.FindIndex(x => x == "practitioners_principals") != -1;
            var isNonPractitioner = input.RoleIds.FindIndex(x => x == "practitioners_non_principals") != -1;
            var isCoach = input.RoleIds.FindIndex(x => x == "coaches") != -1;

            var practitioners = isPrincipal || isNonPractitioner
                ? await practitionerRepo.GetAll()
                    .Where(x => x.IsActive && ((isPrincipal && isNonPractitioner) || (isPrincipal && !isNonPractitioner && x.IsPrincipal == true) || (!isPrincipal && isNonPractitioner && x.IsPrincipal == false)))
                    .Include(x => x.SiteAddress)
                    .Select(x => new
                    {
                        UserId = x.UserId.Value,
                        x.IsPrincipal,
                        x.SiteAddress
                    })
                    .Distinct()
                    .ToListAsync()
                : null;

            if (isPrincipal)
            {
                userIds.AddRange(practitioners.Where(x => x.IsPrincipal == true).Select(x => x.UserId));
            }
            if (isNonPractitioner)
            {
                userIds.AddRange(practitioners.Where(x => x.IsPrincipal == false).Select(x => x.UserId));
            }

            var coaches = isCoach
                ? await coachRepo.GetAll()
                    .Where(x => x.IsActive)
                    .Include(x => x.SiteAddress)
                    .Select(x => new
                    {
                        UserId = x.UserId.Value,
                        x.SiteAddress
                    })
                    .ToListAsync()
                : null;
            if (isCoach)
            {
                userIds.AddRange(coaches.Select(x => x.UserId));
            }
            
            // Finding users for criteria
            if (input.ProvinceId != "" || input.WardName != "")
            {
                Guid? provinceGuid = input.ProvinceId != "" ? Guid.Parse(input.ProvinceId) : null;
                if (isPrincipal || isNonPractitioner)
                {
                    if (provinceGuid.HasValue && input.WardName == "")
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.SiteAddress?.ProvinceId == provinceGuid.Value)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.SiteAddress?.ProvinceId == provinceGuid.Value && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                if (isCoach)
                {
                    if (provinceGuid.HasValue && input.WardName == "")
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.SiteAddress?.ProvinceId == provinceGuid.Value)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.SiteAddress?.ProvinceId == provinceGuid.Value && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                
            } else
            {
                messageUserIds = userIds;
            }

            if (messageUserIds.Count > 0)
            {
                MessageTemplate template = await messageTemplateRepo.GetAll().Where(x => x.Protocol == "push" && x.TemplateType == "generic-message" && x.IsActive).FirstOrDefaultAsync();

                if (input.IsEdit)
                {
                    // first delete current records for edit functionality and then create again.
                    await dbContext.MessageLogs.Where(x => input.MessageLogIds.Contains(x.Id)).ExecuteDeleteAsync();
                }
                // ignore the input.MessageTime.  Time is part of the input.MessageDate.
                //var timeItems = input.MessageTime.Split(":");
                //int hour = Int32.Parse(timeItems[0]);
                //int minutes = Int32.Parse(timeItems[1]);
                //var timeSpan = new TimeSpan(hour, minutes, 0);
                //DateTime messageDate = new DateTime(input.MessageDate.Year, input.MessageDate.Month, input.MessageDate.Day).Add(timeSpan);
                DateTime messageDate = input.MessageDate.ToLocalTime();
                foreach (var userId in messageUserIds)
                {
                    await notificationService.SendGenericMessage(userId.ToString(), input.ToGroups, input.Message, input.Subject, messageDate, template, null);
                }
            }
            return true;
                       
        }

    }
}
